import uuid
from typing import List, Optional, Tuple
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.geometry import geojson_to_db_geometry
from app.models.investigation import Investigation
from app.schemas.investigation import InvestigationCreate


class InvestigationRepository:
    """
    Data access and persistence layer for Investigation domain entities.
    """

    @staticmethod
    def create(db: Session, obj_in: InvestigationCreate) -> Investigation:
        geom_db = (
            geojson_to_db_geometry(obj_in.geometry, srid=4326)
            if obj_in.geometry is not None
            else None
        )
        db_obj = Investigation(
            name=obj_in.name,
            description=obj_in.description,
            status=obj_in.status,
            geometry=geom_db,
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    @staticmethod
    def get_by_id(db: Session, investigation_id: uuid.UUID) -> Optional[Investigation]:
        stmt = select(Investigation).where(Investigation.id == investigation_id)
        return db.scalars(stmt).first()

    @staticmethod
    def get_list(
        db: Session, page: int = 1, page_size: int = 20
    ) -> Tuple[List[Investigation], int]:
        # Count total
        count_stmt = select(func.count(Investigation.id))
        total = db.scalar(count_stmt) or 0

        # Paginated items ordered newest first (created_at desc)
        offset = (page - 1) * page_size
        stmt = (
            select(Investigation)
            .order_by(Investigation.created_at.desc())
            .offset(offset)
            .limit(page_size)
        )
        items = list(db.scalars(stmt).all())
        return items, total
