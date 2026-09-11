import uuid
from datetime import datetime, timezone
from typing import TYPE_CHECKING, List, Optional
from geoalchemy2 import Geometry
from sqlalchemy import JSON, DateTime, Float, ForeignKey, Integer, String, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.investigation import Investigation
    from app.models.spill_detection import SpillDetection


class SatelliteScene(Base):
    """
    Satellite scene imagery acquired for an investigation (Sentinel-1, Sentinel-2, etc.).
    """

    __tablename__ = "satellite_scenes"

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
    provider: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )
    platform: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )
    sensor: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )
    product_type: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )
    acquisition_time: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        index=True,
    )
    orbit_direction: Mapped[Optional[str]] = mapped_column(
        String(50),
        nullable=True,
    )
    relative_orbit: Mapped[Optional[int]] = mapped_column(
        Integer,
        nullable=True,
    )
    polarization: Mapped[Optional[str]] = mapped_column(
        String(50),
        nullable=True,
    )
    cloud_cover: Mapped[Optional[float]] = mapped_column(
        Float,
        nullable=True,
    )
    scene_identifier: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )
    footprint: Mapped[Geometry] = mapped_column(
        Geometry(geometry_type="POLYGON", srid=4326),
        nullable=False,
    )
    source_uri: Mapped[Optional[str]] = mapped_column(
        Text,
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
        back_populates="satellite_scenes",
    )
    spill_detections: Mapped[List["SpillDetection"]] = relationship(
        "SpillDetection",
        back_populates="satellite_scene",
        cascade="all, delete-orphan",
    )
