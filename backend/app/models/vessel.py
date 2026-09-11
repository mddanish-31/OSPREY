import uuid
from datetime import datetime, timezone
from typing import TYPE_CHECKING, List, Optional
from sqlalchemy import JSON, DateTime, Float, String, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.ais_position import AISPosition
    from app.models.vessel_attribution import VesselAttribution


class Vessel(Base):
    """
    Vessel entity tracked via AIS and subject to potential oil spill attribution.
    """

    __tablename__ = "vessels"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    mmsi: Mapped[Optional[str]] = mapped_column(
        String(20),
        unique=True,
        index=True,
        nullable=True,
    )
    imo: Mapped[Optional[str]] = mapped_column(
        String(20),
        unique=True,
        index=True,
        nullable=True,
    )
    name: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True,
    )
    vessel_type: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True,
    )
    flag: Mapped[Optional[str]] = mapped_column(
        String(50),
        nullable=True,
    )
    callsign: Mapped[Optional[str]] = mapped_column(
        String(50),
        nullable=True,
    )
    length_m: Mapped[Optional[float]] = mapped_column(
        Float,
        nullable=True,
    )
    breadth_m: Mapped[Optional[float]] = mapped_column(
        Float,
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
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    ais_positions: Mapped[List["AISPosition"]] = relationship(
        "AISPosition",
        back_populates="vessel",
        cascade="all, delete-orphan",
    )
    vessel_attributions: Mapped[List["VesselAttribution"]] = relationship(
        "VesselAttribution",
        back_populates="vessel",
        cascade="all, delete-orphan",
    )
