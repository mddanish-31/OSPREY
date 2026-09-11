import uuid
from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, ConfigDict, Field, model_validator


class Sentinel1SearchRequest(BaseModel):
    """
    Search parameters for querying Copernicus Data Space Ecosystem (CDSE) Sentinel-1 products.
    The AOI geometry is automatically retrieved from the active Investigation in PostGIS.
    """

    start_datetime: datetime = Field(
        ...,
        description="UTC start datetime for observation acquisition window",
    )
    end_datetime: datetime = Field(
        ...,
        description="UTC end datetime for observation acquisition window",
    )
    limit: int = Field(
        20,
        ge=1,
        le=100,
        description="Maximum number of CDSE products to return (1-100)",
    )
    product_type: str = Field(
        "IW_GRDH_1S",
        min_length=1,
        max_length=50,
        description="Sentinel-1 product type (e.g. IW_GRDH_1S, IW_SLC__1S, EW_GRDH_1S)",
    )
    operational_mode: Optional[str] = Field(
        None,
        max_length=20,
        description="Optional sensor operational mode filter (e.g. IW, EW, SM, WV)",
    )
    polarization: Optional[str] = Field(
        None,
        max_length=20,
        description="Optional polarization channels filter (e.g. VV+VH, HH+HV, VV, HH)",
    )
    orbit_direction: Optional[str] = Field(
        None,
        max_length=20,
        description="Optional orbit pass direction filter (ASCENDING or DESCENDING)",
    )

    @model_validator(mode="after")
    def validate_datetime_range(self) -> "Sentinel1SearchRequest":
        if self.start_datetime >= self.end_datetime:
            raise ValueError("start_datetime must be strictly earlier than end_datetime")
        return self


class Sentinel1SearchResult(BaseModel):
    """
    Normalized, authoritative Sentinel-1 product metadata returned from CDSE OData discovery.
    Contains zero synthetic or fabricated values.
    """

    model_config = ConfigDict(from_attributes=True)

    source: str = Field(
        "copernicus_dataspace",
        description="Discovery catalog origin",
    )
    source_product_id: str = Field(
        ...,
        description="Official CDSE product UUID",
    )
    name: str = Field(
        ...,
        description="Authoritative Sentinel-1 product name (.SAFE)",
    )
    acquisition_start: datetime = Field(
        ...,
        description="Observation start timestamp (UTC)",
    )
    acquisition_end: Optional[datetime] = Field(
        None,
        description="Observation end timestamp (UTC)",
    )
    publication_date: Optional[datetime] = Field(
        None,
        description="CDSE publication timestamp (UTC)",
    )
    online: bool = Field(
        True,
        description="Whether product is immediately available online",
    )
    content_length: Optional[int] = Field(
        None,
        description="Product archive size in bytes if reported by CDSE",
    )
    s3_path: Optional[str] = Field(
        None,
        description="CDSE S3 repository path if available",
    )
    product_type: str = Field(
        ...,
        description="Sentinel-1 product type (e.g. IW_GRDH_1S)",
    )
    operational_mode: Optional[str] = Field(
        None,
        description="Sensor operational mode (e.g. IW)",
    )
    polarization: Optional[str] = Field(
        None,
        description="Polarization channels (e.g. VV+VH)",
    )
    orbit_direction: Optional[str] = Field(
        None,
        description="Orbit trajectory pass direction (ASCENDING or DESCENDING)",
    )
    relative_orbit: Optional[int] = Field(
        None,
        description="Relative orbit / track number",
    )
    platform: Optional[str] = Field(
        None,
        description="Spacecraft platform identifier (e.g. Sentinel-1A, Sentinel-1B, Sentinel-1C, Sentinel-1D)",
    )
    footprint: Dict[str, Any] = Field(
        ...,
        description="Authoritative GeoJSON Polygon ground footprint (EPSG:4326)",
    )


class Sentinel1SearchResponse(BaseModel):
    """
    Search response wrapper for Sentinel-1 catalog discovery.
    """

    source: str = Field(
        "Copernicus Data Space Ecosystem",
        description="Data catalog origin description",
    )
    results: List[Sentinel1SearchResult] = Field(
        ...,
        description="List of matching real Sentinel-1 products",
    )
    count: int = Field(
        ...,
        description="Total items returned in this response page",
    )
    has_more: bool = Field(
        False,
        description="Whether further results exist in CDSE",
    )


class Sentinel1ImportRequest(BaseModel):
    """
    Import request identifying an authoritative CDSE Sentinel-1 product for persistence.
    """

    source_product_id: str = Field(
        ...,
        min_length=1,
        max_length=100,
        description="Official CDSE product UUID to validate and ingest",
    )


class Sentinel1DownloadResponse(BaseModel):
    """
    Response model for authenticated Sentinel-1 product download and integrity verification.
    """

    model_config = ConfigDict(from_attributes=True)

    scene_id: uuid.UUID = Field(
        ...,
        description="OSPREY Satellite Scene UUID in Neon",
    )
    source_product_id: str = Field(
        ...,
        description="Official CDSE product UUID",
    )
    processing_state: str = Field(
        ...,
        description="Current scene processing lifecycle state (e.g. READY_FOR_PROCESSING, DOWNLOADING, DOWNLOAD_FAILED)",
    )
    verification_status: str = Field(
        ...,
        description="Integrity verification status (VERIFIED, FAILED, NOT_AVAILABLE)",
    )
    verification_method: Optional[str] = Field(
        None,
        description="Verification method used (AUTHORITATIVE_CHECKSUM, CONTENT_LENGTH, STREAM_COMPLETE)",
    )
    content_length: Optional[int] = Field(
        None,
        description="Downloaded file size in bytes",
    )
    downloaded_filename: Optional[str] = Field(
        None,
        description="Safe filename stored in storage abstraction",
    )
    download_started_at: Optional[datetime] = Field(
        None,
        description="UTC timestamp when streaming download commenced",
    )
    download_completed_at: Optional[datetime] = Field(
        None,
        description="UTC timestamp when download & verification finalized",
    )
    local_sha256: Optional[str] = Field(
        None,
        description="Cryptographic SHA-256 fingerprint of the verified product binary",
    )
    error_message: Optional[str] = Field(
        None,
        description="Sanitized error description if download or verification failed",
    )

