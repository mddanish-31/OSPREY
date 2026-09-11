import uuid
from datetime import datetime, timezone
from typing import TYPE_CHECKING, Optional
from sqlalchemy import JSON, DateTime, Float, ForeignKey, Integer, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.drift_run import DriftRun
    from app.models.investigation import Investigation
    from app.models.spill_detection import SpillDetection
    from app.models.vessel import Vessel


class VesselAttribution(Base):
    """
    Evidence-backed vessel attribution score connecting an investigation to a culprit vessel.
    """

    __tablename__ = "vessel_attributions"

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
    vessel_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("vessels.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    spill_detection_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("spill_detections.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    drift_run_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("drift_runs.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    score: Mapped[Optional[float]] = mapped_column(
        Float,
        nullable=True,
        index=True,
    )
    rank: Mapped[Optional[int]] = mapped_column(
        Integer,
        nullable=True,
    )
    distance_km: Mapped[Optional[float]] = mapped_column(
        Float,
        nullable=True,
    )
    temporal_match_score: Mapped[Optional[float]] = mapped_column(
        Float,
        nullable=True,
    )
    trajectory_match_score: Mapped[Optional[float]] = mapped_column(
        Float,
        nullable=True,
    )
    behavioral_match_score: Mapped[Optional[float]] = mapped_column(
        Float,
        nullable=True,
    )
    ais_gap_score: Mapped[Optional[float]] = mapped_column(
        Float,
        nullable=True,
    )
    evidence: Mapped[Optional[dict]] = mapped_column(
        JSON,
        nullable=True,
    )
    explanation: Mapped[Optional[str]] = mapped_column(
        Text,
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
        back_populates="vessel_attributions",
    )
    vessel: Mapped["Vessel"] = relationship(
        "Vessel",
        back_populates="vessel_attributions",
    )
    spill_detection: Mapped[Optional["SpillDetection"]] = relationship(
        "SpillDetection",
        back_populates="vessel_attributions",
    )
    drift_run: Mapped[Optional["DriftRun"]] = relationship(
        "DriftRun",
        back_populates="vessel_attributions",
    )
