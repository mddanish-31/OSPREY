-- ==============================================================================
-- OSPREY — COMPLETE OFFLINE DATABASE UPGRADE SCRIPT (BASE -> HEAD)
-- Target: Neon PostgreSQL 18.0 with PostGIS 3.6.4
-- Migration Chain: base -> 66afcaa2c01b -> 842ba098c750
-- ==============================================================================

BEGIN;

-- 1. Initialize Alembic Version Tracking Table
CREATE TABLE IF NOT EXISTS alembic_version (
    version_num VARCHAR(32) NOT NULL, 
    CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num)
);

-- ------------------------------------------------------------------------------
-- REVISION: 66afcaa2c01b (enable_postgis)
-- ------------------------------------------------------------------------------
-- Running upgrade -> 66afcaa2c01b

CREATE EXTENSION IF NOT EXISTS postgis;

INSERT INTO alembic_version (version_num) VALUES ('66afcaa2c01b') RETURNING alembic_version.version_num;

-- ------------------------------------------------------------------------------
-- REVISION: 842ba098c750 (create_domain_tables)
-- ------------------------------------------------------------------------------
-- Running upgrade 66afcaa2c01b -> 842ba098c750

-- Table 1: investigations
CREATE TABLE investigations (
    id UUID NOT NULL, 
    name VARCHAR(255) NOT NULL, 
    description TEXT, 
    status VARCHAR(50) DEFAULT 'active' NOT NULL, 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
    geometry geometry(POLYGON,4326) NOT NULL, 
    PRIMARY KEY (id)
);

CREATE INDEX idx_investigations_geometry ON investigations USING gist (geometry);

-- Table 2: satellite_scenes
CREATE TABLE satellite_scenes (
    id UUID NOT NULL, 
    investigation_id UUID NOT NULL, 
    provider VARCHAR(100) NOT NULL, 
    platform VARCHAR(100) NOT NULL, 
    sensor VARCHAR(100) NOT NULL, 
    product_type VARCHAR(100) NOT NULL, 
    acquisition_time TIMESTAMP WITH TIME ZONE NOT NULL, 
    orbit_direction VARCHAR(50), 
    relative_orbit INTEGER, 
    polarization VARCHAR(50), 
    cloud_cover FLOAT, 
    scene_identifier VARCHAR(255) NOT NULL, 
    footprint geometry(POLYGON,4326) NOT NULL, 
    source_uri TEXT, 
    metadata JSON, 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(investigation_id) REFERENCES investigations (id) ON DELETE CASCADE
);

CREATE INDEX idx_satellite_scenes_footprint ON satellite_scenes USING gist (footprint);

CREATE INDEX ix_satellite_scenes_investigation_id ON satellite_scenes (investigation_id);

CREATE INDEX ix_satellite_scenes_acquisition_time ON satellite_scenes (acquisition_time);

-- Table 3: spill_detections
CREATE TABLE spill_detections (
    id UUID NOT NULL, 
    investigation_id UUID NOT NULL, 
    satellite_scene_id UUID NOT NULL, 
    geometry geometry(MULTIPOLYGON,4326) NOT NULL, 
    detection_time TIMESTAMP WITH TIME ZONE, 
    model_name VARCHAR(100), 
    model_version VARCHAR(50), 
    confidence FLOAT, 
    area_sq_km FLOAT, 
    perimeter_km FLOAT, 
    status VARCHAR(50) DEFAULT 'detected' NOT NULL, 
    metadata JSON, 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(investigation_id) REFERENCES investigations (id) ON DELETE CASCADE, 
    FOREIGN KEY(satellite_scene_id) REFERENCES satellite_scenes (id) ON DELETE CASCADE
);

CREATE INDEX idx_spill_detections_geometry ON spill_detections USING gist (geometry);

CREATE INDEX ix_spill_detections_investigation_id ON spill_detections (investigation_id);

CREATE INDEX ix_spill_detections_satellite_scene_id ON spill_detections (satellite_scene_id);

-- Table 4: environmental_observations
CREATE TABLE environmental_observations (
    id UUID NOT NULL, 
    investigation_id UUID NOT NULL, 
    provider VARCHAR(100) NOT NULL, 
    dataset VARCHAR(100) NOT NULL, 
    observation_time TIMESTAMP WITH TIME ZONE NOT NULL, 
    variable VARCHAR(100) NOT NULL, 
    value FLOAT, 
    unit VARCHAR(50), 
    bbox geometry(POLYGON,4326) NOT NULL, 
    metadata JSON, 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(investigation_id) REFERENCES investigations (id) ON DELETE CASCADE
);

CREATE INDEX idx_environmental_observations_bbox ON environmental_observations USING gist (bbox);

CREATE INDEX ix_environmental_observations_investigation_id ON environmental_observations (investigation_id);

CREATE INDEX ix_environmental_observations_observation_time ON environmental_observations (observation_time);

-- Table 5: vessels
CREATE TABLE vessels (
    id UUID NOT NULL, 
    mmsi VARCHAR(20), 
    imo VARCHAR(20), 
    name VARCHAR(255), 
    vessel_type VARCHAR(100), 
    flag VARCHAR(50), 
    callsign VARCHAR(50), 
    length_m FLOAT, 
    breadth_m FLOAT, 
    metadata JSON, 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
    PRIMARY KEY (id)
);

CREATE UNIQUE INDEX ix_vessels_mmsi ON vessels (mmsi);

CREATE UNIQUE INDEX ix_vessels_imo ON vessels (imo);

-- Table 6: ais_positions
CREATE TABLE ais_positions (
    id UUID NOT NULL, 
    vessel_id UUID NOT NULL, 
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL, 
    location geometry(POINT,4326) NOT NULL, 
    sog FLOAT, 
    cog FLOAT, 
    heading FLOAT, 
    nav_status VARCHAR(50), 
    rot FLOAT, 
    source VARCHAR(50), 
    metadata JSON, 
    PRIMARY KEY (id), 
    FOREIGN KEY(vessel_id) REFERENCES vessels (id) ON DELETE CASCADE
);

CREATE INDEX idx_ais_positions_location ON ais_positions USING gist (location);

CREATE INDEX ix_ais_positions_vessel_id ON ais_positions (vessel_id);

CREATE INDEX ix_ais_positions_timestamp ON ais_positions (timestamp);

-- Table 7: drift_runs
CREATE TABLE drift_runs (
    id UUID NOT NULL, 
    investigation_id UUID NOT NULL, 
    spill_detection_id UUID, 
    model_name VARCHAR(100) NOT NULL, 
    model_version VARCHAR(50), 
    start_time TIMESTAMP WITH TIME ZONE NOT NULL, 
    end_time TIMESTAMP WITH TIME ZONE NOT NULL, 
    forcing_sources JSON, 
    origin_geometry geometry(POLYGON,4326), 
    result_geometry geometry(MULTIPOLYGON,4326), 
    status VARCHAR(50) DEFAULT 'pending' NOT NULL, 
    uncertainty JSON, 
    metadata JSON, 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(investigation_id) REFERENCES investigations (id) ON DELETE CASCADE, 
    FOREIGN KEY(spill_detection_id) REFERENCES spill_detections (id) ON DELETE SET NULL
);

CREATE INDEX idx_drift_runs_origin_geometry ON drift_runs USING gist (origin_geometry);

CREATE INDEX idx_drift_runs_result_geometry ON drift_runs USING gist (result_geometry);

CREATE INDEX ix_drift_runs_investigation_id ON drift_runs (investigation_id);

CREATE INDEX ix_drift_runs_spill_detection_id ON drift_runs (spill_detection_id);

-- Table 8: vessel_attributions
CREATE TABLE vessel_attributions (
    id UUID NOT NULL, 
    investigation_id UUID NOT NULL, 
    vessel_id UUID NOT NULL, 
    spill_detection_id UUID, 
    drift_run_id UUID, 
    score FLOAT, 
    rank INTEGER, 
    distance_km FLOAT, 
    temporal_match_score FLOAT, 
    trajectory_match_score FLOAT, 
    behavioral_match_score FLOAT, 
    ais_gap_score FLOAT, 
    evidence JSON, 
    explanation TEXT, 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(investigation_id) REFERENCES investigations (id) ON DELETE CASCADE, 
    FOREIGN KEY(vessel_id) REFERENCES vessels (id) ON DELETE CASCADE, 
    FOREIGN KEY(spill_detection_id) REFERENCES spill_detections (id) ON DELETE SET NULL, 
    FOREIGN KEY(drift_run_id) REFERENCES drift_runs (id) ON DELETE SET NULL
);

CREATE INDEX ix_vessel_attributions_investigation_id ON vessel_attributions (investigation_id);

CREATE INDEX ix_vessel_attributions_vessel_id ON vessel_attributions (vessel_id);

CREATE INDEX ix_vessel_attributions_score ON vessel_attributions (score);

CREATE INDEX ix_vessel_attributions_spill_detection_id ON vessel_attributions (spill_detection_id);

CREATE INDEX ix_vessel_attributions_drift_run_id ON vessel_attributions (drift_run_id);

-- Update Alembic Version to Head (842ba098c750)
UPDATE alembic_version SET version_num='842ba098c750' WHERE alembic_version.version_num = '66afcaa2c01b';

COMMIT;
