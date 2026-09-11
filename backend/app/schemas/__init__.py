"""
OSPREY Pydantic Schemas Package.
"""

from app.schemas.investigation import (
    InvestigationCreate,
    InvestigationResponse,
    InvestigationListResponse,
)
from app.schemas.satellite_scene import (
    SatelliteSceneCreate,
    SatelliteSceneResponse,
    SatelliteSceneListResponse,
)

__all__ = [
    "InvestigationCreate",
    "InvestigationResponse",
    "InvestigationListResponse",
    "SatelliteSceneCreate",
    "SatelliteSceneResponse",
    "SatelliteSceneListResponse",
]
