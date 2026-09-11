import json
import logging
import re
from datetime import datetime
from typing import Any, Dict, List, Optional
import shapely.geometry
import shapely.wkt

from app.core.geometry import validate_geojson_polygon
from app.schemas.copernicus import Sentinel1SearchResult

logger = logging.getLogger(__name__)


def parse_footprint(raw_footprint: Any, raw_wkt_footprint: Optional[str] = None) -> Dict[str, Any]:
    """
    Parses and validates authoritative CDSE footprint geometry into a standardized
    EPSG:4326 GeoJSON Polygon.
    Raises ValueError if geometry is missing, unparseable, or topologically invalid.
    """
    geojson_dict = None

    if isinstance(raw_footprint, dict):
        geojson_dict = raw_footprint
    elif isinstance(raw_footprint, str) and raw_footprint.strip():
        try:
            geojson_dict = json.loads(raw_footprint)
        except Exception:
            geojson_dict = None

    if geojson_dict is None and raw_wkt_footprint and isinstance(raw_wkt_footprint, str):
        # Handle CDSE WKT geography string format e.g. geography'SRID=4326;POLYGON((...))' or POLYGON((...))
        wkt_str = raw_wkt_footprint.strip()
        wkt_match = re.search(r"POLYGON\s*\(.*\)", wkt_str, re.IGNORECASE)
        if wkt_match:
            clean_wkt = wkt_match.group(0)
            try:
                shape = shapely.wkt.loads(clean_wkt)
                geojson_dict = shapely.geometry.mapping(shape)
            except Exception as exc:
                raise ValueError(f"Failed to parse CDSE WKT footprint: {exc}") from exc

    if not geojson_dict:
        raise ValueError("CDSE product is missing a valid spatial footprint (GeoFootprint/Footprint)")

    # Validate using core geometry validator (ensures closed ring, valid bounds, valid Polygon)
    poly = validate_geojson_polygon(geojson_dict)
    all_rings = [poly.exterior.coords] + [r.coords for r in poly.interiors]
    return {
        "type": "Polygon",
        "coordinates": [
            [[float(c[0]), float(c[1])] for c in ring]
            for ring in all_rings
        ],
    }


def normalize_cdse_product(raw_product: Dict[str, Any]) -> Sentinel1SearchResult:
    """
    Normalizes a single authoritative Copernicus Data Space product into the OSPREY discovery schema.
    Strictly preserves CDSE product truth — zero fake fallbacks or synthesized data.
    """
    if not isinstance(raw_product, dict):
        raise ValueError("CDSE product payload must be a JSON object")

    product_id = raw_product.get("Id")
    if not product_id:
        raise ValueError("CDSE product payload missing required 'Id' field")

    product_name = raw_product.get("Name")
    if not product_name:
        raise ValueError("CDSE product payload missing required 'Name' field")

    # Extract OData Attributes collection
    attributes_list = raw_product.get("Attributes", [])
    attrs_map: Dict[str, Any] = {}
    if isinstance(attributes_list, list):
        for att in attributes_list:
            if isinstance(att, dict) and "Name" in att:
                attrs_map[att["Name"]] = att.get("Value")

    # Determine platform from serial identifier or product name prefix
    serial_id = attrs_map.get("platformSerialIdentifier")
    if serial_id and isinstance(serial_id, str):
        platform = f"Sentinel-1{serial_id.strip().upper()}"
    elif product_name.startswith("S1A"):
        platform = "Sentinel-1A"
    elif product_name.startswith("S1B"):
        platform = "Sentinel-1B"
    elif product_name.startswith("S1C"):
        platform = "Sentinel-1C"
    elif product_name.startswith("S1D"):
        platform = "Sentinel-1D"
    else:
        platform = attrs_map.get("platformShortName") or "Sentinel-1"

    # Product type from attributes or fallback to parsing from product name
    product_type = attrs_map.get("productType")
    if not product_type:
        parts = product_name.split("_")
        if len(parts) >= 4:
            product_type = f"{parts[1]}_{parts[2]}"
        else:
            product_type = "IW_GRDH_1S"

    # Operational mode (IW, EW, SM, WV)
    operational_mode = attrs_map.get("operationalMode")

    # Polarization channels (VV+VH, HH+HV, VV, HH)
    polarization = attrs_map.get("polarisationChannels")
    if polarization and isinstance(polarization, str):
        polarization = polarization.replace("&", "+").strip()

    # Orbit direction (ASCENDING / DESCENDING)
    orbit_direction = attrs_map.get("orbitDirection")
    if orbit_direction and isinstance(orbit_direction, str):
        orbit_direction = orbit_direction.strip().upper()

    # Relative orbit / track
    rel_orbit_raw = attrs_map.get("relativeOrbitNumber")
    relative_orbit = None
    if rel_orbit_raw is not None:
        try:
            relative_orbit = int(rel_orbit_raw)
        except (ValueError, TypeError):
            relative_orbit = None

    # Dates
    content_date = raw_product.get("ContentDate") or {}
    start_str = content_date.get("Start")
    if not start_str:
        raise ValueError(f"CDSE product {product_id} is missing ContentDate/Start")

    acq_start = datetime.fromisoformat(start_str.replace("Z", "+00:00"))

    end_str = content_date.get("End")
    acq_end = (
        datetime.fromisoformat(end_str.replace("Z", "+00:00"))
        if end_str
        else None
    )

    pub_str = raw_product.get("PublicationDate")
    publication_date = (
        datetime.fromisoformat(pub_str.replace("Z", "+00:00"))
        if pub_str
        else None
    )

    # Online & size
    online = bool(raw_product.get("Online", True))
    content_length = raw_product.get("ContentLength")
    if content_length is not None:
        try:
            content_length = int(content_length)
        except (ValueError, TypeError):
            content_length = None

    s3_path = attrs_map.get("s3Path") or raw_product.get("S3Path")

    # Spatial Footprint
    footprint = parse_footprint(
        raw_product.get("GeoFootprint"),
        raw_product.get("Footprint"),
    )

    return Sentinel1SearchResult(
        source="copernicus_dataspace",
        source_product_id=str(product_id),
        name=str(product_name),
        acquisition_start=acq_start,
        acquisition_end=acq_end,
        publication_date=publication_date,
        online=online,
        content_length=content_length,
        s3_path=s3_path,
        product_type=str(product_type),
        operational_mode=operational_mode,
        polarization=polarization,
        orbit_direction=orbit_direction,
        relative_orbit=relative_orbit,
        platform=platform,
        footprint=footprint,
    )
