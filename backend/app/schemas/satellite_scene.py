import uuid
from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.core.geometry import db_geometry_to_geojson, validate_geojson_polygon


class SatelliteSceneBase(BaseModel):
    scene_identifier: str = Field(
        ...,
        min_length=1,
        max_length=255,
        description="Sentinel-1 scene product identifier (e.g. S1A_IW_GRDH_1SDV_...)",
    )
    provider: str = Field(
        "Copernicus",
        max_length=100,
        description="Data provider / distribution service",
    )
    platform: str = Field(
        "Sentinel-1A",
        max_length=100,
        description="Spacecraft platform (Sentinel-1A, Sentinel-1B, Sentinel-1C)",
    )
    sensor: str = Field(
        "C-SAR",
        max_length=100,
        description="Imaging radar sensor name",
    )
    product_type: str = Field(
        "GRD",
        max_length=100,
        description="SAR product level / type (GRD, SLC, OCN)",
    )
    acquisition_time: datetime = Field(
        ...,
        description="UTC timestamp of satellite radar observation",
    )
    orbit_direction: Optional[str] = Field(
        None,
        max_length=50,
        description="Satellite pass trajectory (ASCENDING or DESCENDING)",
    )
    relative_orbit: Optional[int] = Field(
        None,
        ge=1,
        le=175,
        description="Sentinel-1 track / relative orbit number (1-175)",
    )
    polarization: Optional[str] = Field(
        "VV+VH",
        max_length=50,
        description="Radar transmit and receive polarization channels",
    )
    cloud_cover: Optional[float] = Field(
        None,
        ge=0.0,
        le=100.0,
        description="Cloud cover percentage (typically null for SAR)",
    )
    source_uri: Optional[str] = Field(
        None,
        description="Safe download or catalog URI for the scene",
    )
    metadata_json: Optional[Dict[str, Any]] = Field(
        None,
        description="Additional Sentinel-1 acquisition and processing metadata",
    )


class SatelliteSceneCreate(SatelliteSceneBase):
    footprint: Dict[str, Any] = Field(
        ...,
        description="GeoJSON Polygon defining the Sentinel-1 spatial ground footprint (SRID 4326)",
    )

    @field_validator("scene_identifier")
    @classmethod
    def validate_scene_identifier_not_empty(cls, v: str) -> str:
        stripped = v.strip()
        if not stripped:
            raise ValueError("Scene identifier cannot be empty or whitespace only")
        return stripped

    @field_validator("footprint")
    @classmethod
    def validate_footprint_polygon(cls, v: Dict[str, Any]) -> Dict[str, Any]:
        poly = validate_geojson_polygon(v)
        all_rings = [poly.exterior.coords] + [r.coords for r in poly.interiors]
        raw_mapping = {
            "type": "Polygon",
            "coordinates": [
                [[float(c[0]), float(c[1])] for c in ring]
                for ring in all_rings
            ],
        }
        return raw_mapping


class SatelliteSceneResponse(SatelliteSceneBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    investigation_id: uuid.UUID
    footprint: Dict[str, Any]
    created_at: datetime

    @field_validator("footprint", mode="before")
    @classmethod
    def convert_footprint_to_geojson(cls, v: Any) -> Optional[Dict[str, Any]]:
        if v is None:
            return None
        if isinstance(v, dict):
            return v
        return db_geometry_to_geojson(v)


class SatelliteSceneListResponse(BaseModel):
    items: List[SatelliteSceneResponse]
    total: int
