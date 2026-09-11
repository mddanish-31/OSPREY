import uuid
from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.core.geometry import db_geometry_to_geojson, validate_geojson_polygon


class GeoJSONPolygon(BaseModel):
    """
    Standard GeoJSON Polygon specification schema.
    """
    type: str = Field("Polygon", pattern="^Polygon$")
    coordinates: List[List[List[float]]] = Field(..., min_length=1)


class InvestigationBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255, description="Investigation title or identifier")
    description: Optional[str] = Field(None, description="Detailed incident narrative and notes")
    status: str = Field("active", max_length=50, description="Investigation lifecycle status")


class InvestigationCreate(InvestigationBase):
    geometry: Optional[Dict[str, Any]] = Field(
        None,
        description="Optional GeoJSON Polygon defining the investigation bounding area of interest (SRID 4326)",
    )

    @field_validator("name")
    @classmethod
    def validate_name_not_empty(cls, v: str) -> str:
        stripped = v.strip()
        if not stripped:
            raise ValueError("Investigation name cannot be empty or whitespace only")
        return stripped

    @field_validator("geometry")
    @classmethod
    def validate_polygon_geometry(cls, v: Optional[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
        if v is None:
            return None
        # Validate coordinates and structure using Shapely & RFC 7946 rules
        poly = validate_geojson_polygon(v)
        # Return cleaned GeoJSON polygon mapping
        all_rings = [poly.exterior.coords] + [r.coords for r in poly.interiors]
        raw_mapping = {
            "type": "Polygon",
            "coordinates": [
                [[float(c[0]), float(c[1])] for c in ring]
                for ring in all_rings
            ],
        }
        return raw_mapping


class InvestigationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str
    description: Optional[str]
    status: str
    geometry: Optional[Dict[str, Any]]
    created_at: datetime
    updated_at: datetime

    @field_validator("geometry", mode="before")
    @classmethod
    def convert_geometry_to_geojson(cls, v: Any) -> Optional[Dict[str, Any]]:
        if v is None:
            return None
        if isinstance(v, dict):
            return v
        return db_geometry_to_geojson(v)


class InvestigationListResponse(BaseModel):
    items: List[InvestigationResponse]
    total: int
