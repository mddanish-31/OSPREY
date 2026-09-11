import hashlib
import logging
import time
import urllib.parse
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple
import httpx
from fastapi import HTTPException, status
import shapely.geometry
import shapely.wkt

from app.core.config import settings
from app.schemas.copernicus import Sentinel1SearchResult
from app.services.copernicus.normalizer import normalize_cdse_product

logger = logging.getLogger(__name__)


class CopernicusCatalogClient:
    """
    Client for the official Copernicus Data Space Ecosystem (CDSE) OData catalog & download services.
    Handles query construction, spatial AOI intersection, product retrieval, and authenticated streaming downloads.
    """

    def __init__(
        self,
        catalog_url: Optional[str] = None,
        download_url: Optional[str] = None,
        timeout_seconds: float = 30.0,
    ):
        self.catalog_url = (catalog_url or settings.COPERNICUS_CATALOG_URL).rstrip("/")
        self.download_url = (download_url or settings.CDSE_DOWNLOAD_URL).rstrip("/")
        self.timeout = timeout_seconds

    def _build_filter_expression(
        self,
        aoi_polygon: shapely.geometry.Polygon,
        start_datetime: datetime,
        end_datetime: datetime,
        product_type: str = "IW_GRDH_1S",
        operational_mode: Optional[str] = None,
        polarization: Optional[str] = None,
        orbit_direction: Optional[str] = None,
    ) -> str:
        """
        Builds the structured OData $filter string for Sentinel-1 catalog discovery.
        """
        # Ensure UTC timezone formatting
        if start_datetime.tzinfo is None:
            start_utc = start_datetime.replace(tzinfo=timezone.utc)
        else:
            start_utc = start_datetime.astimezone(timezone.utc)

        if end_datetime.tzinfo is None:
            end_utc = end_datetime.replace(tzinfo=timezone.utc)
        else:
            end_utc = end_datetime.astimezone(timezone.utc)

        start_iso = start_utc.strftime("%Y-%m-%dT%H:%M:%S.000Z")
        end_iso = end_utc.strftime("%Y-%m-%dT%H:%M:%S.000Z")

        # 1. Collection Filter (Mandatory SENTINEL-1)
        filters = ["Collection/Name eq 'SENTINEL-1'"]

        # 2. Structured Product Type Filter
        if product_type:
            filters.append(
                f"Attributes/OData.CSC.StringAttribute/any(att:att/Name eq 'productType' and att/OData.CSC.StringAttribute/Value eq '{product_type.strip()}')"
            )

        # 3. Spatial AOI Intersection Filter (WKT Polygon in EPSG:4326)
        wkt_str = aoi_polygon.wkt.replace("POLYGON (", "POLYGON(").replace("POLYGON  (", "POLYGON(")
        filters.append(f"OData.CSC.Intersects(area=geography'SRID=4326;{wkt_str}')")

        # 4. Temporal Observation Filter (ContentDate/Start)
        filters.append(f"ContentDate/Start ge {start_iso}")
        filters.append(f"ContentDate/Start le {end_iso}")

        # 5. Optional Structured Attribute Filters
        if operational_mode and operational_mode.strip():
            mode_clean = operational_mode.strip().upper()
            filters.append(
                f"Attributes/OData.CSC.StringAttribute/any(att:att/Name eq 'operationalMode' and att/OData.CSC.StringAttribute/Value eq '{mode_clean}')"
            )

        if polarization and polarization.strip():
            pol_clean = polarization.strip()
            pol_alt = pol_clean.replace("+", "&")
            filters.append(
                f"Attributes/OData.CSC.StringAttribute/any(att:att/Name eq 'polarisationChannels' and (att/OData.CSC.StringAttribute/Value eq '{pol_clean}' or att/OData.CSC.StringAttribute/Value eq '{pol_alt}'))"
            )

        if orbit_direction and orbit_direction.strip():
            orbit_clean = orbit_direction.strip().upper()
            filters.append(
                f"Attributes/OData.CSC.StringAttribute/any(att:att/Name eq 'orbitDirection' and att/OData.CSC.StringAttribute/Value eq '{orbit_clean}')"
            )

        return " and ".join(filters)

    def search_sentinel1_products(
        self,
        aoi_polygon: shapely.geometry.Polygon,
        start_datetime: datetime,
        end_datetime: datetime,
        product_type: str = "IW_GRDH_1S",
        limit: int = 20,
        operational_mode: Optional[str] = None,
        polarization: Optional[str] = None,
        orbit_direction: Optional[str] = None,
    ) -> Tuple[List[Sentinel1SearchResult], bool]:
        """
        Executes bounded Sentinel-1 discovery query against official CDSE OData catalog.
        Returns a tuple of (normalized_results, has_more).
        """
        bounded_limit = min(max(int(limit), 1), 100)
        filter_query = self._build_filter_expression(
            aoi_polygon=aoi_polygon,
            start_datetime=start_datetime,
            end_datetime=end_datetime,
            product_type=product_type,
            operational_mode=operational_mode,
            polarization=polarization,
            orbit_direction=orbit_direction,
        )

        params = {
            "$filter": filter_query,
            "$orderby": "ContentDate/Start desc",
            "$top": bounded_limit,
            "$expand": "Attributes",
        }

        try:
            with httpx.Client(timeout=self.timeout) as client:
                response = client.get(self.catalog_url, params=params)

                if response.status_code == 400:
                    logger.warning("CDSE 400 Bad Request: %s", response.text[:200])
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Invalid CDSE catalog search parameters or unsupported product type filter.",
                    )

                if response.status_code == 429:
                    logger.warning("CDSE 429 Rate Limit Exceeded")
                    raise HTTPException(
                        status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                        detail="Copernicus Data Space catalog rate limit exceeded. Please retry in a few moments.",
                    )

                if response.status_code >= 500:
                    logger.warning("CDSE server error status %s: %s", response.status_code, response.text[:200])
                    raise HTTPException(
                        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                        detail="Copernicus Data Space catalog is currently unavailable or experiencing high load.",
                    )

                response.raise_for_status()
                data = response.json()

        except httpx.TimeoutException:
            logger.warning("CDSE request timed out after %s seconds", self.timeout)
            raise HTTPException(
                status_code=status.HTTP_504_GATEWAY_TIMEOUT,
                detail="Connection to Copernicus Data Space catalog timed out.",
            ) from None
        except httpx.RequestError as exc:
            logger.warning("CDSE connection network error: %s", type(exc).__name__)
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Unable to connect to Copernicus Data Space catalog network.",
            ) from None
        except HTTPException:
            raise
        except Exception as exc:
            logger.error("Failed to parse CDSE catalog response: %s", exc)
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Received invalid or unparseable response from Copernicus Data Space catalog.",
            ) from None

        raw_items = data.get("value", [])
        has_more = "@odata.nextLink" in data

        results: List[Sentinel1SearchResult] = []
        for raw in raw_items:
            try:
                norm = normalize_cdse_product(raw)
                results.append(norm)
            except Exception as exc:
                logger.warning("Skipping non-normalizable CDSE item %s: %s", raw.get("Id"), exc)

        return results, has_more

    def get_product_by_id(self, product_id: str) -> Dict[str, Any]:
        """
        Retrieves authoritative Sentinel-1 product metadata by official CDSE Product UUID.
        """
        clean_id = product_id.strip()
        url = f"{self.catalog_url}({clean_id})"
        params = {"$expand": "Attributes"}

        try:
            with httpx.Client(timeout=self.timeout) as client:
                response = client.get(url, params=params)

                if response.status_code == 404:
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail=f"Sentinel-1 product with ID '{clean_id}' was not found in Copernicus Data Space.",
                    )

                if response.status_code == 400:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Invalid Copernicus product identifier '{clean_id}'.",
                    )

                if response.status_code >= 500:
                    raise HTTPException(
                        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                        detail="Copernicus Data Space catalog is currently unavailable.",
                    )

                response.raise_for_status()
                return response.json()

        except httpx.TimeoutException:
            raise HTTPException(
                status_code=status.HTTP_504_GATEWAY_TIMEOUT,
                detail="Connection to Copernicus Data Space catalog timed out.",
            ) from None
        except httpx.RequestError as exc:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Unable to connect to Copernicus Data Space catalog network.",
            ) from None
        except HTTPException:
            raise
        except Exception as exc:
            logger.error("Failed to retrieve CDSE product %s: %s", clean_id, exc)
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Received invalid or unparseable response from Copernicus Data Space catalog.",
            ) from None

    def download_product_stream(
        self,
        source_product_id: str,
        destination_temp_path: Path,
        access_token: str,
        expected_checksum: Optional[str] = None,
        checksum_algorithm: Optional[str] = None,
        expected_content_length: Optional[int] = None,
        max_retries: int = 3,
    ) -> Dict[str, Any]:
        """
        Streams authoritative Sentinel-1 product binaries from CDSE download service
        into a temporary file with on-the-fly SHA-256 and checksum integrity calculation.
        Implements exponential backoff retries for transient HTTP/network errors.
        """
        clean_id = source_product_id.strip()
        download_url = f"{self.download_url}({clean_id})/$value"
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Accept": "application/octet-stream, application/zip, */*",
        }

        algo_lower = (checksum_algorithm or "").strip().lower()
        use_md5 = "md5" in algo_lower

        last_exception = None

        for attempt in range(1, max_retries + 1):
            bytes_written = 0
            sha256_hasher = hashlib.sha256()
            md5_hasher = hashlib.md5() if use_md5 else None

            # Ensure parent dir exists
            destination_temp_path.parent.mkdir(parents=True, exist_ok=True)

            try:
                with httpx.Client(timeout=60.0, follow_redirects=True) as client:
                    with client.stream("GET", download_url, headers=headers) as stream_resp:
                        if stream_resp.status_code == 401:
                            raise HTTPException(
                                status_code=status.HTTP_401_UNAUTHORIZED,
                                detail="CDSE download token expired or unauthorized.",
                            )
                        if stream_resp.status_code == 403:
                            raise HTTPException(
                                status_code=status.HTTP_403_FORBIDDEN,
                                detail="Access to CDSE product download is forbidden.",
                            )
                        if stream_resp.status_code == 404:
                            raise HTTPException(
                                status_code=status.HTTP_404_NOT_FOUND,
                                detail=f"Downloadable product with ID '{clean_id}' not found in CDSE.",
                            )
                        if stream_resp.status_code == 429:
                            raise httpx.HTTPStatusError("429 Too Many Requests", request=stream_resp.request, response=stream_resp)
                        if stream_resp.status_code >= 500:
                            raise httpx.HTTPStatusError(f"HTTP {stream_resp.status_code} Server Error", request=stream_resp.request, response=stream_resp)

                        stream_resp.raise_for_status()

                        # Write chunks to disk
                        with open(destination_temp_path, "wb") as f:
                            for chunk in stream_resp.iter_bytes(chunk_size=65536):
                                if chunk:
                                    f.write(chunk)
                                    sha256_hasher.update(chunk)
                                    if md5_hasher:
                                        md5_hasher.update(chunk)
                                    bytes_written += len(chunk)

                # Streaming completed successfully for this attempt
                local_sha256 = sha256_hasher.hexdigest()

                # Integrity Verification Logic
                verification_status = "NOT_AVAILABLE"
                verification_method = "NONE"

                if expected_checksum:
                    # Validate against CDSE authoritative checksum
                    calculated_check = (
                        md5_hasher.hexdigest() if use_md5 else local_sha256
                    )
                    if calculated_check.lower() != expected_checksum.strip().lower():
                        raise ValueError(
                            f"Integrity check failed: Authoritative {checksum_algorithm or 'checksum'} mismatch "
                            f"(expected '{expected_checksum}', calculated '{calculated_check}')"
                        )
                    verification_status = "VERIFIED"
                    verification_method = "AUTHORITATIVE_CHECKSUM"
                elif expected_content_length is not None and expected_content_length > 0:
                    # Validate against Content-Length
                    if bytes_written != expected_content_length:
                        raise ValueError(
                            f"Integrity check failed: Content-Length mismatch "
                            f"(expected {expected_content_length} bytes, received {bytes_written} bytes)"
                        )
                    verification_status = "VERIFIED"
                    verification_method = "CONTENT_LENGTH"
                else:
                    # File downloaded with non-zero bytes
                    if bytes_written > 0:
                        verification_status = "VERIFIED"
                        verification_method = "STREAM_COMPLETE"

                return {
                    "bytes_downloaded": bytes_written,
                    "local_sha256": local_sha256,
                    "authoritative_checksum": expected_checksum,
                    "authoritative_checksum_algorithm": checksum_algorithm,
                    "verification_status": verification_status,
                    "verification_method": verification_method,
                }

            except (httpx.TimeoutException, httpx.RequestError, httpx.HTTPStatusError) as exc:
                last_exception = exc
                logger.warning(
                    "CDSE download attempt %d/%d for %s failed: %s",
                    attempt,
                    max_retries,
                    clean_id,
                    type(exc).__name__,
                )
                if attempt < max_retries:
                    time.sleep(2 ** attempt)
            except HTTPException:
                raise
            except Exception as exc:
                logger.error("Download failed due to non-retryable error: %s", exc)
                raise

        # All retries exhausted
        logger.error("All %d download attempts exhausted for CDSE product %s", max_retries, clean_id)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Failed to download Sentinel-1 product after {max_retries} attempts due to CDSE server/network unavailability.",
        ) from last_exception
