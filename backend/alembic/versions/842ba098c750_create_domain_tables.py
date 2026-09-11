"""create_domain_tables

Revision ID: 842ba098c750
Revises: 66afcaa2c01b
Create Date: 2026-09-11 14:22:02.366126

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import geoalchemy2


# revision identifiers, used by Alembic.
revision: str = '842ba098c750'
down_revision: Union[str, None] = '66afcaa2c01b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. investigations table
    op.create_table(
        'investigations',
        sa.Column('id', sa.UUID(as_uuid=True), primary_key=True),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('status', sa.String(length=50), server_default='active', nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('geometry', geoalchemy2.types.Geometry(geometry_type='POLYGON', srid=4326, from_text='ST_GeomFromEWKT', name='geometry', nullable=False)),
    )

    # 2. satellite_scenes table
    op.create_table(
        'satellite_scenes',
        sa.Column('id', sa.UUID(as_uuid=True), primary_key=True),
        sa.Column('investigation_id', sa.UUID(as_uuid=True), sa.ForeignKey('investigations.id', ondelete='CASCADE'), nullable=False),
        sa.Column('provider', sa.String(length=100), nullable=False),
        sa.Column('platform', sa.String(length=100), nullable=False),
        sa.Column('sensor', sa.String(length=100), nullable=False),
        sa.Column('product_type', sa.String(length=100), nullable=False),
        sa.Column('acquisition_time', sa.DateTime(timezone=True), nullable=False),
        sa.Column('orbit_direction', sa.String(length=50), nullable=True),
        sa.Column('relative_orbit', sa.Integer(), nullable=True),
        sa.Column('polarization', sa.String(length=50), nullable=True),
        sa.Column('cloud_cover', sa.Float(), nullable=True),
        sa.Column('scene_identifier', sa.String(length=255), nullable=False),
        sa.Column('footprint', geoalchemy2.types.Geometry(geometry_type='POLYGON', srid=4326, from_text='ST_GeomFromEWKT', name='geometry', nullable=False)),
        sa.Column('source_uri', sa.Text(), nullable=True),
        sa.Column('metadata', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    )
    op.create_index('ix_satellite_scenes_investigation_id', 'satellite_scenes', ['investigation_id'], unique=False)
    op.create_index('ix_satellite_scenes_acquisition_time', 'satellite_scenes', ['acquisition_time'], unique=False)

    # 3. spill_detections table
    op.create_table(
        'spill_detections',
        sa.Column('id', sa.UUID(as_uuid=True), primary_key=True),
        sa.Column('investigation_id', sa.UUID(as_uuid=True), sa.ForeignKey('investigations.id', ondelete='CASCADE'), nullable=False),
        sa.Column('satellite_scene_id', sa.UUID(as_uuid=True), sa.ForeignKey('satellite_scenes.id', ondelete='CASCADE'), nullable=False),
        sa.Column('geometry', geoalchemy2.types.Geometry(geometry_type='MULTIPOLYGON', srid=4326, from_text='ST_GeomFromEWKT', name='geometry', nullable=False)),
        sa.Column('detection_time', sa.DateTime(timezone=True), nullable=True),
        sa.Column('model_name', sa.String(length=100), nullable=True),
        sa.Column('model_version', sa.String(length=50), nullable=True),
        sa.Column('confidence', sa.Float(), nullable=True),
        sa.Column('area_sq_km', sa.Float(), nullable=True),
        sa.Column('perimeter_km', sa.Float(), nullable=True),
        sa.Column('status', sa.String(length=50), server_default='detected', nullable=False),
        sa.Column('metadata', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    )
    op.create_index('ix_spill_detections_investigation_id', 'spill_detections', ['investigation_id'], unique=False)
    op.create_index('ix_spill_detections_satellite_scene_id', 'spill_detections', ['satellite_scene_id'], unique=False)

    # 4. environmental_observations table
    op.create_table(
        'environmental_observations',
        sa.Column('id', sa.UUID(as_uuid=True), primary_key=True),
        sa.Column('investigation_id', sa.UUID(as_uuid=True), sa.ForeignKey('investigations.id', ondelete='CASCADE'), nullable=False),
        sa.Column('provider', sa.String(length=100), nullable=False),
        sa.Column('dataset', sa.String(length=100), nullable=False),
        sa.Column('observation_time', sa.DateTime(timezone=True), nullable=False),
        sa.Column('variable', sa.String(length=100), nullable=False),
        sa.Column('value', sa.Float(), nullable=True),
        sa.Column('unit', sa.String(length=50), nullable=True),
        sa.Column('bbox', geoalchemy2.types.Geometry(geometry_type='POLYGON', srid=4326, from_text='ST_GeomFromEWKT', name='geometry', nullable=False)),
        sa.Column('metadata', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    )
    op.create_index('ix_environmental_observations_investigation_id', 'environmental_observations', ['investigation_id'], unique=False)
    op.create_index('ix_environmental_observations_observation_time', 'environmental_observations', ['observation_time'], unique=False)

    # 5. vessels table
    op.create_table(
        'vessels',
        sa.Column('id', sa.UUID(as_uuid=True), primary_key=True),
        sa.Column('mmsi', sa.String(length=20), nullable=True),
        sa.Column('imo', sa.String(length=20), nullable=True),
        sa.Column('name', sa.String(length=255), nullable=True),
        sa.Column('vessel_type', sa.String(length=100), nullable=True),
        sa.Column('flag', sa.String(length=50), nullable=True),
        sa.Column('callsign', sa.String(length=50), nullable=True),
        sa.Column('length_m', sa.Float(), nullable=True),
        sa.Column('breadth_m', sa.Float(), nullable=True),
        sa.Column('metadata', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    )
    op.create_index('ix_vessels_mmsi', 'vessels', ['mmsi'], unique=True)
    op.create_index('ix_vessels_imo', 'vessels', ['imo'], unique=True)

    # 6. ais_positions table
    op.create_table(
        'ais_positions',
        sa.Column('id', sa.UUID(as_uuid=True), primary_key=True),
        sa.Column('vessel_id', sa.UUID(as_uuid=True), sa.ForeignKey('vessels.id', ondelete='CASCADE'), nullable=False),
        sa.Column('timestamp', sa.DateTime(timezone=True), nullable=False),
        sa.Column('location', geoalchemy2.types.Geometry(geometry_type='POINT', srid=4326, from_text='ST_GeomFromEWKT', name='geometry', nullable=False)),
        sa.Column('sog', sa.Float(), nullable=True),
        sa.Column('cog', sa.Float(), nullable=True),
        sa.Column('heading', sa.Float(), nullable=True),
        sa.Column('nav_status', sa.String(length=50), nullable=True),
        sa.Column('rot', sa.Float(), nullable=True),
        sa.Column('source', sa.String(length=50), nullable=True),
        sa.Column('metadata', sa.JSON(), nullable=True),
    )
    op.create_index('ix_ais_positions_vessel_id', 'ais_positions', ['vessel_id'], unique=False)
    op.create_index('ix_ais_positions_timestamp', 'ais_positions', ['timestamp'], unique=False)

    # 7. drift_runs table
    op.create_table(
        'drift_runs',
        sa.Column('id', sa.UUID(as_uuid=True), primary_key=True),
        sa.Column('investigation_id', sa.UUID(as_uuid=True), sa.ForeignKey('investigations.id', ondelete='CASCADE'), nullable=False),
        sa.Column('spill_detection_id', sa.UUID(as_uuid=True), sa.ForeignKey('spill_detections.id', ondelete='SET NULL'), nullable=True),
        sa.Column('model_name', sa.String(length=100), nullable=False),
        sa.Column('model_version', sa.String(length=50), nullable=True),
        sa.Column('start_time', sa.DateTime(timezone=True), nullable=False),
        sa.Column('end_time', sa.DateTime(timezone=True), nullable=False),
        sa.Column('forcing_sources', sa.JSON(), nullable=True),
        sa.Column('origin_geometry', geoalchemy2.types.Geometry(geometry_type='POLYGON', srid=4326, from_text='ST_GeomFromEWKT', name='geometry', nullable=True)),
        sa.Column('result_geometry', geoalchemy2.types.Geometry(geometry_type='MULTIPOLYGON', srid=4326, from_text='ST_GeomFromEWKT', name='geometry', nullable=True)),
        sa.Column('status', sa.String(length=50), server_default='pending', nullable=False),
        sa.Column('uncertainty', sa.JSON(), nullable=True),
        sa.Column('metadata', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    )
    op.create_index('ix_drift_runs_investigation_id', 'drift_runs', ['investigation_id'], unique=False)
    op.create_index('ix_drift_runs_spill_detection_id', 'drift_runs', ['spill_detection_id'], unique=False)

    # 8. vessel_attributions table
    op.create_table(
        'vessel_attributions',
        sa.Column('id', sa.UUID(as_uuid=True), primary_key=True),
        sa.Column('investigation_id', sa.UUID(as_uuid=True), sa.ForeignKey('investigations.id', ondelete='CASCADE'), nullable=False),
        sa.Column('vessel_id', sa.UUID(as_uuid=True), sa.ForeignKey('vessels.id', ondelete='CASCADE'), nullable=False),
        sa.Column('spill_detection_id', sa.UUID(as_uuid=True), sa.ForeignKey('spill_detections.id', ondelete='SET NULL'), nullable=True),
        sa.Column('drift_run_id', sa.UUID(as_uuid=True), sa.ForeignKey('drift_runs.id', ondelete='SET NULL'), nullable=True),
        sa.Column('score', sa.Float(), nullable=True),
        sa.Column('rank', sa.Integer(), nullable=True),
        sa.Column('distance_km', sa.Float(), nullable=True),
        sa.Column('temporal_match_score', sa.Float(), nullable=True),
        sa.Column('trajectory_match_score', sa.Float(), nullable=True),
        sa.Column('behavioral_match_score', sa.Float(), nullable=True),
        sa.Column('ais_gap_score', sa.Float(), nullable=True),
        sa.Column('evidence', sa.JSON(), nullable=True),
        sa.Column('explanation', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    )
    op.create_index('ix_vessel_attributions_investigation_id', 'vessel_attributions', ['investigation_id'], unique=False)
    op.create_index('ix_vessel_attributions_vessel_id', 'vessel_attributions', ['vessel_id'], unique=False)
    op.create_index('ix_vessel_attributions_score', 'vessel_attributions', ['score'], unique=False)
    op.create_index('ix_vessel_attributions_spill_detection_id', 'vessel_attributions', ['spill_detection_id'], unique=False)
    op.create_index('ix_vessel_attributions_drift_run_id', 'vessel_attributions', ['drift_run_id'], unique=False)


def downgrade() -> None:
    op.drop_table('vessel_attributions')
    op.drop_table('drift_runs')
    op.drop_table('ais_positions')
    op.drop_table('vessels')
    op.drop_table('environmental_observations')
    op.drop_table('spill_detections')
    op.drop_table('satellite_scenes')
    op.drop_table('investigations')
