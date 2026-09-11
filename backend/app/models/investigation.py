import uuid
from datetime import datetime, timezone
from typing import List, Optional
from geoalchemy2 import Geometry
from sqlalchemy import DateTime, String, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Investigation(Base):
    """
    Core Investigation entity representing an oil spill / anomaly incident analysis.
    """

    __tablename__ = "investigations"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )
    description: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )
    status: Mapped[str] = mapped_column(
        String(50),
        default="active",
        nullable=False,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    geometry: Mapped[Geometry] = mapped_column(
        Geometry(geometry_type="POLYGON", srid=4326),
        nullable=False,
        index=True,
    )

    # Relationships
    satellite_scenes: Mapped[List["SatelliteScene"]] = relationship(
        "SatelliteScene",
        back_populates="investigation",
        cascade="all, delete-orphan",
    )
    spill_detections: Mapped[List["SpillDetection"]] = relationship(
        "SpillDetection",
        back_populates="investigation",
        cascade="all, delete-orphan",
    )
    environmental_observations: Mapped[List["EnvironmentalObservation"]] = relationship(
        "EnvironmentalObservation",
        back_populates="investigation",
        cascade="all, delete-orphan",
    )
    drift_runs: Mapped[List["DriftRun"]] = relationship(
        "DriftRun",
        back_populates="investigation",
        cascade="all, delete-orphan",
    )
    vessel_attributions: Mapped[List["VesselAttribution"]] = relationship(
        "VesselAttribution",
        back_populates="investigation",
        cascade="all, delete-orphan",
    )
