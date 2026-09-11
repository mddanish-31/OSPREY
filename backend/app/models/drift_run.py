import uuid
from datetime import datetime, timezone
from typing import TYPE_CHECKING, List, Optional
from geoalchemy2 import Geometry
from sqlalchemy import JSON, DateTime, ForeignKey, String, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.investigation import Investigation
    from app.models.spill_detection import SpillDetection
    from app.models.vessel_attribution import VesselAttribution


class DriftRun(Base):
    """
    Hydrodynamic drift trajectory simulation run (OpenDrift / OpenOil / backward & forward backtracking).
    """

    __tablename__ = "drift_runs"

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
    spill_detection_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("spill_detections.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    model_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )
    model_version: Mapped[Optional[str]] = mapped_column(
        String(50),
        nullable=True,
    )
    start_time: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
    )
    end_time: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
    )
    forcing_sources: Mapped[Optional[dict]] = mapped_column(
        JSON,
        nullable=True,
    )
    origin_geometry: Mapped[Optional[Geometry]] = mapped_column(
        Geometry(geometry_type="POLYGON", srid=4326),
        nullable=True,
    )
    result_geometry: Mapped[Optional[Geometry]] = mapped_column(
        Geometry(geometry_type="MULTIPOLYGON", srid=4326),
        nullable=True,
    )
    status: Mapped[str] = mapped_column(
        String(50),
        default="pending",
        nullable=False,
    )
    uncertainty: Mapped[Optional[dict]] = mapped_column(
        JSON,
        nullable=True,
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
        back_populates="drift_runs",
    )
    spill_detection: Mapped[Optional["SpillDetection"]] = relationship(
        "SpillDetection",
        back_populates="drift_runs",
    )
    vessel_attributions: Mapped[List["VesselAttribution"]] = relationship(
        "VesselAttribution",
        back_populates="drift_run",
    )
