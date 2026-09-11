import pytest
from sqlalchemy.orm import configure_mappers
from app.db.base import Base
from app.models import (
    Investigation,
    SatelliteScene,
    SpillDetection,
    EnvironmentalObservation,
    Vessel,
    AISPosition,
    DriftRun,
    VesselAttribution,
)


def test_models_metadata_and_table_count():
    """
    Verify Base.metadata.tables contains exactly the 8 requested domain tables.
    """
    expected_tables = {
        "investigations",
        "satellite_scenes",
        "spill_detections",
        "environmental_observations",
        "vessels",
        "ais_positions",
        "drift_runs",
        "vessel_attributions",
    }
    actual_tables = set(Base.metadata.tables.keys())
    assert actual_tables == expected_tables, f"Mismatch in tables: {actual_tables ^ expected_tables}"
    assert len(actual_tables) == 8


def test_mappers_compile_successfully():
    """
    Ensure all SQLAlchemy mappers and relationships configure cleanly without errors.
    """
    configure_mappers()


def test_spatial_column_definitions():
    """
    Verify geometry column types, dimensions, and SRID 4326 for all spatial fields.
    """
    # 1. Investigation geometry: Polygon, SRID 4326
    inv_geom = Investigation.__table__.c.geometry.type
    assert inv_geom.geometry_type.upper() == "POLYGON"
    assert inv_geom.srid == 4326

    # 2. SatelliteScene footprint: Polygon, SRID 4326
    sat_geom = SatelliteScene.__table__.c.footprint.type
    assert sat_geom.geometry_type.upper() == "POLYGON"
    assert sat_geom.srid == 4326

    # 3. SpillDetection geometry: MultiPolygon, SRID 4326
    spill_geom = SpillDetection.__table__.c.geometry.type
    assert spill_geom.geometry_type.upper() == "MULTIPOLYGON"
    assert spill_geom.srid == 4326

    # 4. EnvironmentalObservation bbox: Polygon, SRID 4326
    env_geom = EnvironmentalObservation.__table__.c.bbox.type
    assert env_geom.geometry_type.upper() == "POLYGON"
    assert env_geom.srid == 4326

    # 5. AISPosition location: Point, SRID 4326
    ais_geom = AISPosition.__table__.c.location.type
    assert ais_geom.geometry_type.upper() == "POINT"
    assert ais_geom.srid == 4326

    # 6. DriftRun origin_geometry and result_geometry
    drift_orig_geom = DriftRun.__table__.c.origin_geometry.type
    assert drift_orig_geom.geometry_type.upper() == "POLYGON"
    assert drift_orig_geom.srid == 4326

    drift_res_geom = DriftRun.__table__.c.result_geometry.type
    assert drift_res_geom.geometry_type.upper() == "MULTIPOLYGON"
    assert drift_res_geom.srid == 4326


def test_foreign_keys_and_relationships():
    """
    Verify foreign keys exist on child tables.
    """
    # SatelliteScene -> Investigation
    sat_fks = {fk.target_fullname for fk in SatelliteScene.__table__.foreign_keys}
    assert "investigations.id" in sat_fks

    # SpillDetection -> Investigation, SatelliteScene
    spill_fks = {fk.target_fullname for fk in SpillDetection.__table__.foreign_keys}
    assert "investigations.id" in spill_fks
    assert "satellite_scenes.id" in spill_fks

    # EnvironmentalObservation -> Investigation
    env_fks = {fk.target_fullname for fk in EnvironmentalObservation.__table__.foreign_keys}
    assert "investigations.id" in env_fks

    # AISPosition -> Vessel
    ais_fks = {fk.target_fullname for fk in AISPosition.__table__.foreign_keys}
    assert "vessels.id" in ais_fks

    # DriftRun -> Investigation, SpillDetection
    drift_fks = {fk.target_fullname for fk in DriftRun.__table__.foreign_keys}
    assert "investigations.id" in drift_fks
    assert "spill_detections.id" in drift_fks

    # VesselAttribution -> Investigation, Vessel, SpillDetection, DriftRun
    attr_fks = {fk.target_fullname for fk in VesselAttribution.__table__.foreign_keys}
    assert "investigations.id" in attr_fks
    assert "vessels.id" in attr_fks
    assert "spill_detections.id" in attr_fks
    assert "drift_runs.id" in attr_fks
