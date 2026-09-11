import uuid
from datetime import datetime, timezone
from typing import TYPE_CHECKING, Optional
from geoalchemy2 import Geometry
from sqlalchemy import JSON, DateTime, Float, ForeignKey, String, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.investigation import Investigation


class EnvironmentalObservation(Base):
    """
    Environmental observation context (ocean currents, wind, waves, temperature from ERA5/CMEMS).
    """

    __tablename__ = "environmental_observations"

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
    dataset: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )
    observation_time: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        index=True,
    )
    variable: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )
    value: Mapped[Optional[float]] = mapped_column(
        Float,
        nullable=True,
    )
    unit: Mapped[Optional[str]] = mapped_column(
        String(50),
        nullable=True,
    )
    bbox: Mapped[Geometry] = mapped_column(
        Geometry(geometry_type="POLYGON", srid=4326),
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
        back_populates="environmental_observations",
    )
