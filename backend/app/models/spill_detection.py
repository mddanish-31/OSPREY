import uuid
from datetime import datetime, timezone
from typing import TYPE_CHECKING, List, Optional
from geoalchemy2 import Geometry
from sqlalchemy import JSON, DateTime, Float, ForeignKey, String, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.drift_run import DriftRun
    from app.models.investigation import Investigation
    from app.models.satellite_scene import SatelliteScene
    from app.models.vessel_attribution import VesselAttribution


class SpillDetection(Base):
    """
    Spill detection polygon(s) inferred from satellite imagery or reported observations.
    """

    __tablename__ = "spill_detections"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    investigation_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("investigations.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    satellite_scene_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("satellite_scenes.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    geometry: Mapped[Geometry] = mapped_column(
        Geometry(geometry_type="MULTIPOLYGON", srid=4326),
        nullable=False,
    )
    detection_time: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )
    model_name: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True,
    )
    model_version: Mapped[Optional[str]] = mapped_column(
        String(50),
        nullable=True,
    )
    confidence: Mapped[Optional[float]] = mapped_column(
        Float,
        nullable=True,
    )
    area_sq_km: Mapped[Optional[float]] = mapped_column(
        Float,
        nullable=True,
    )
    perimeter_km: Mapped[Optional[float]] = mapped_column(
        Float,
        nullable=True,
    )
    status: Mapped[str] = mapped_column(
        String(50),
        default="detected",
        nullable=False,
    )
    metadata_json: Mapped[Optional[dict]] = mapped_column(
        "metadata",
        JSON,
        nullable=True,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    investigation: Mapped["Investigation"] = relationship(
        "Investigation",
        back_populates="spill_detections",
    )
    satellite_scene: Mapped["SatelliteScene"] = relationship(
        "SatelliteScene",
        back_populates="spill_detections",
    )
    drift_runs: Mapped[List["DriftRun"]] = relationship(
        "DriftRun",
        back_populates="spill_detection",
    )
    vessel_attributions: Mapped[List["VesselAttribution"]] = relationship(
        "VesselAttribution",
        back_populates="spill_detection",
    )
