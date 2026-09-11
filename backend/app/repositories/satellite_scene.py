import uuid
from typing import List, Optional, Tuple
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.geometry import geojson_to_db_geometry
from app.models.satellite_scene import SatelliteScene
from app.schemas.satellite_scene import SatelliteSceneCreate


class SatelliteSceneRepository:
    """
    Data access and persistence layer for SatelliteScene domain entities.
    """

    @staticmethod
    def create(
        db: Session, investigation_id: uuid.UUID, obj_in: SatelliteSceneCreate
    ) -> SatelliteScene:
        footprint_db = geojson_to_db_geometry(obj_in.footprint, srid=4326)

        db_obj = SatelliteScene(
            investigation_id=investigation_id,
            scene_identifier=obj_in.scene_identifier,
            provider=obj_in.provider,
            platform=obj_in.platform,
            sensor=obj_in.sensor,
            product_type=obj_in.product_type,
            acquisition_time=obj_in.acquisition_time,
            orbit_direction=obj_in.orbit_direction,
            relative_orbit=obj_in.relative_orbit,
            polarization=obj_in.polarization,
            cloud_cover=obj_in.cloud_cover,
            footprint=footprint_db,
            source_uri=obj_in.source_uri,
            metadata_json=obj_in.metadata_json,
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    @staticmethod
    def get_by_id(db: Session, scene_id: uuid.UUID) -> Optional[SatelliteScene]:
        stmt = select(SatelliteScene).where(SatelliteScene.id == scene_id)
        return db.scalars(stmt).first()

    @staticmethod
    def list_by_investigation(
        db: Session, investigation_id: uuid.UUID
    ) -> Tuple[List[SatelliteScene], int]:
        # Count total
        count_stmt = select(func.count(SatelliteScene.id)).where(
            SatelliteScene.investigation_id == investigation_id
        )
        total = db.scalar(count_stmt) or 0

        # Query scenes newest acquisition first
        stmt = (
            select(SatelliteScene)
            .where(SatelliteScene.investigation_id == investigation_id)
            .order_by(SatelliteScene.acquisition_time.desc())
        )
        items = list(db.scalars(stmt).all())
        return items, total

    @staticmethod
    def update_metadata(
        db: Session, scene: SatelliteScene, metadata_updates: dict
    ) -> SatelliteScene:
        current = dict(scene.metadata_json or {})
        current.update(metadata_updates)
        scene.metadata_json = current
        db.add(scene)
        db.commit()
        db.refresh(scene)
        return scene

