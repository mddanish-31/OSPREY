import uuid
from datetime import datetime
from typing import TYPE_CHECKING, Optional
from geoalchemy2 import Geometry
from sqlalchemy import JSON, DateTime, Float, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.vessel import Vessel


class AISPosition(Base):
    """
    AIS position fix report associated with a vessel trajectory.
    """

    __tablename__ = "ais_positions"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    vessel_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("vessels.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    timestamp: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        index=True,
    )
    location: Mapped[Geometry] = mapped_column(
        Geometry(geometry_type="POINT", srid=4326),
        nullable=False,
    )
    sog: Mapped[Optional[float]] = mapped_column(
        Float,
        nullable=True,
    )
    cog: Mapped[Optional[float]] = mapped_column(
        Float,
        nullable=True,
    )
    heading: Mapped[Optional[float]] = mapped_column(
        Float,
        nullable=True,
    )
    nav_status: Mapped[Optional[str]] = mapped_column(
        String(50),
        nullable=True,
    )
    rot: Mapped[Optional[float]] = mapped_column(
        Float,
        nullable=True,
    )
    source: Mapped[Optional[str]] = mapped_column(
        String(50),
        nullable=True,
    )
    metadata_json: Mapped[Optional[dict]] = mapped_column(
        "metadata",
        JSON,
        nullable=True,
    )

    # Relationships
    vessel: Mapped["Vessel"] = relationship(
        "Vessel",
        back_populates="ais_positions",
    )
