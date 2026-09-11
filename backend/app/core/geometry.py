from typing import Any, Dict, List
import shapely.geometry
from geoalchemy2.elements import WKBElement, WKTElement
from geoalchemy2.shape import from_shape, to_shape


def validate_geojson_polygon(data: Dict[str, Any]) -> shapely.geometry.Polygon:
    """
    Validates that data is a structurally valid GeoJSON Polygon object.
    Raises ValueError with a descriptive message on any validation error.
    """
    if not isinstance(data, dict):
        raise ValueError("Geometry must be a GeoJSON object")

    geom_type = data.get("type")
    if geom_type != "Polygon":
        raise ValueError(f"Geometry type must be 'Polygon', got '{geom_type}'")

    coords = data.get("coordinates")
    if not isinstance(coords, (list, tuple)) or len(coords) == 0:
        raise ValueError("Polygon coordinates must be a non-empty list of linear rings")

    for ring_idx, ring in enumerate(coords):
        if not isinstance(ring, (list, tuple)) or len(ring) < 4:
            raise ValueError(
                f"Linear ring {ring_idx} must contain at least 4 coordinate positions"
            )

        # Check closing coordinate: first and last position must match
        first = ring[0]
        last = ring[-1]
        if len(first) < 2 or len(last) < 2:
            raise ValueError(f"Coordinate positions in ring {ring_idx} must have at least 2 numbers (lon, lat)")

        if first[0] != last[0] or first[1] != last[1]:
            raise ValueError(
                f"Linear ring {ring_idx} is not closed: first position {first} != last position {last}"
            )

        for pt_idx, pt in enumerate(ring):
            if not isinstance(pt, (list, tuple)) or len(pt) < 2:
                raise ValueError(f"Invalid coordinate position at ring {ring_idx}, index {pt_idx}")
            lon, lat = pt[0], pt[1]
            if not isinstance(lon, (int, float)) or not isinstance(lat, (int, float)):
                raise ValueError(f"Coordinates must be numbers, got lon={lon}, lat={lat}")
            if not (-180.0 <= lon <= 180.0):
                raise ValueError(f"Longitude must be between -180 and 180 degrees, got {lon}")
            if not (-90.0 <= lat <= 90.0):
                raise ValueError(f"Latitude must be between -90 and 90 degrees, got {lat}")

    try:
        poly = shapely.geometry.shape(data)
    except Exception as exc:
        raise ValueError(f"Invalid Polygon geometry: {exc}") from exc

    if not isinstance(poly, shapely.geometry.Polygon):
        raise ValueError(f"Expected Polygon geometry, got {poly.geom_type}")

    if not poly.is_valid:
        raise ValueError(f"Polygon geometry is topologically invalid: {shapely.is_valid_reason(poly)}")

    return poly


def geojson_to_db_geometry(data: Dict[str, Any], srid: int = 4326) -> WKBElement:
    """
    Converts a valid GeoJSON Polygon dictionary to a GeoAlchemy2 WKBElement with the specified SRID.
    """
    poly = validate_geojson_polygon(data)
    return from_shape(poly, srid=srid)


def db_geometry_to_geojson(geom: Any) -> Dict[str, Any]:
    """
    Converts a database geometry (WKBElement, WKTElement, or shapely geometry)
    to a standard GeoJSON Polygon dictionary.
    """
    if geom is None:
        return None

    if isinstance(geom, (WKBElement, WKTElement)):
        shape = to_shape(geom)
    elif isinstance(geom, shapely.geometry.base.BaseGeometry):
        shape = geom
    elif isinstance(geom, (bytes, bytearray)):
        shape = shapely.wkb.loads(geom)
    elif isinstance(geom, str):
        shape = shapely.wkt.loads(geom)
    else:
        # Fallback to to_shape
        shape = to_shape(geom)

    # Format into standard GeoJSON with list coordinates
    raw_mapping = shapely.geometry.mapping(shape)
    # Ensure coordinates are JSON lists of floats
    coords = [
        [[float(coord[0]), float(coord[1])] for coord in ring]
        for ring in raw_mapping["coordinates"]
    ]
    return {
        "type": raw_mapping["type"],
        "coordinates": coords,
    }
