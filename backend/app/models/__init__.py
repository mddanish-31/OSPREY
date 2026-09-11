"""
OSPREY Core Domain Models Package.
Exports all 8 foundational domain entities and Base metadata.
"""

from app.db.base import Base
from app.models.investigation import Investigation
from app.models.satellite_scene import SatelliteScene
from app.models.spill_detection import SpillDetection
from app.models.environmental_observation import EnvironmentalObservation
from app.models.vessel import Vessel
from app.models.ais_position import AISPosition
from app.models.drift_run import DriftRun
from app.models.vessel_attribution import VesselAttribution

__all__ = [
    "Base",
    "Investigation",
    "SatelliteScene",
    "SpillDetection",
    "EnvironmentalObservation",
    "Vessel",
    "AISPosition",
    "DriftRun",
    "VesselAttribution",
]
