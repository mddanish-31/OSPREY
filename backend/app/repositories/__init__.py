"""
OSPREY Repositories Package.
"""

from app.repositories.investigation import InvestigationRepository
from app.repositories.satellite_scene import SatelliteSceneRepository

__all__ = ["InvestigationRepository", "SatelliteSceneRepository"]
