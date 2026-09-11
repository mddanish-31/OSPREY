import uuid
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from unittest.mock import MagicMock
import pytest
from httpx import ASGITransport, AsyncClient
import shapely.geometry
from geoalchemy2.shape import from_shape

from app.core.config import settings
from app.db.session import get_db
from app.main import app
from app.models.investigation import Investigation
from app.models.satellite_scene import SatelliteScene
from app.repositories.investigation import InvestigationRepository
from app.repositories.satellite_scene import SatelliteSceneRepository
from app.schemas.satellite_scene import SatelliteSceneCreate

# Sample valid GeoJSON polygon footprint for Sentinel-1 scene
VALID_FOOTPRINT_GEOJSON = {
    "type": "Polygon",
    "coordinates": [
        [
            [103.2, 1.0],
            [104.5, 1.0],
            [104.5, 2.2],
            [103.2, 2.2],
            [103.2, 1.0],
        ]
    ],
}


def make_scene_instance(
    id: Optional[uuid.UUID] = None,
    investigation_id: Optional[uuid.UUID] = None,
    scene_identifier: str = "S1A_IW_GRDH_1SDV_20260911T023000_050000_060000_A1B2",
    provider: str = "Copernicus",
    platform: str = "Sentinel-1A",
    sensor: str = "C-SAR",
    product_type: str = "GRD",
    acquisition_time: Optional[datetime] = None,
    orbit_direction: Optional[str] = "ASCENDING",
    relative_orbit: Optional[int] = 120,
    polarization: Optional[str] = "VV+VH",
    cloud_cover: Optional[float] = None,
    footprint_geojson: Optional[Dict[str, Any]] = None,
) -> SatelliteScene:
    poly = shapely.geometry.shape(footprint_geojson or VALID_FOOTPRINT_GEOJSON)
    db_geom = from_shape(poly, srid=4326)
    now = datetime.now(timezone.utc)
    return SatelliteScene(
        id=id or uuid.uuid4(),
        investigation_id=investigation_id or uuid.uuid4(),
        scene_identifier=scene_identifier,
        provider=provider,
        platform=platform,
        sensor=sensor,
        product_type=product_type,
        acquisition_time=acquisition_time or now,
        orbit_direction=orbit_direction,
        relative_orbit=relative_orbit,
        polarization=polarization,
        cloud_cover=cloud_cover,
        footprint=db_geom,
        created_at=now,
    )


class MockSceneStore:
    def __init__(self):
        self.investigations: Dict[uuid.UUID, Investigation] = {}
        self.scenes: Dict[uuid.UUID, SatelliteScene] = {}


@pytest.fixture
def mock_store():
    store = MockSceneStore()
    # Seed 1 parent investigation
    inv_id = uuid.uuid4()
    now = datetime.now(timezone.utc)
    inv = Investigation(
        id=inv_id,
        name="Malacca Strait AOI",
        status="active",
        geometry=from_shape(shapely.geometry.shape(VALID_FOOTPRINT_GEOJSON), srid=4326),
        created_at=now,
        updated_at=now,
    )
    store.investigations[inv_id] = inv

    # Seed 1 scene for the investigation
    scene = make_scene_instance(investigation_id=inv_id)
    store.scenes[scene.id] = scene

    return store


@pytest.fixture
def mock_db_session(mock_store: MockSceneStore, monkeypatch):
    mock_session = MagicMock()

    def mock_inv_get_by_id(db, investigation_id: uuid.UUID):
        return mock_store.investigations.get(investigation_id)

    def mock_scene_create(db, investigation_id: uuid.UUID, obj_in: SatelliteSceneCreate):
        scene = make_scene_instance(
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
            footprint_geojson=obj_in.footprint,
        )
        mock_store.scenes[scene.id] = scene
        return scene

    def mock_scene_get_by_id(db, scene_id: uuid.UUID):
        return mock_store.scenes.get(scene_id)

    def mock_scene_list(db, investigation_id: uuid.UUID):
        matching = [
            s for s in mock_store.scenes.values() if s.investigation_id == investigation_id
        ]
        matching.sort(key=lambda s: s.acquisition_time, reverse=True)
        return matching, len(matching)

    monkeypatch.setattr(InvestigationRepository, "get_by_id", mock_inv_get_by_id)
    monkeypatch.setattr(SatelliteSceneRepository, "create", mock_scene_create)
    monkeypatch.setattr(SatelliteSceneRepository, "get_by_id", mock_scene_get_by_id)
    monkeypatch.setattr(SatelliteSceneRepository, "list_by_investigation", mock_scene_list)

    app.dependency_overrides[get_db] = lambda: mock_session
    yield mock_session
    app.dependency_overrides.pop(get_db, None)


# ==============================================================================
# 1. POST /api/v1/investigations/{id}/satellite-scenes
# ==============================================================================

@pytest.mark.asyncio
async def test_create_satellite_scene_success(mock_db_session, mock_store):
    inv_id = list(mock_store.investigations.keys())[0]
    payload = {
        "scene_identifier": "S1A_IW_GRDH_1SDV_20260911T034500_051234_067890_C3D4",
        "provider": "Copernicus",
        "platform": "Sentinel-1A",
        "sensor": "C-SAR",
        "product_type": "GRD",
        "acquisition_time": "2026-09-11T03:45:00Z",
        "orbit_direction": "ASCENDING",
        "relative_orbit": 45,
        "polarization": "VV+VH",
        "footprint": VALID_FOOTPRINT_GEOJSON,
    }
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post(
            f"{settings.API_V1_PREFIX}/investigations/{inv_id}/satellite-scenes",
            json=payload,
        )
        assert response.status_code == 201
        data = response.json()
        assert "id" in data
        assert uuid.UUID(data["id"])
        assert data["investigation_id"] == str(inv_id)
        assert data["scene_identifier"] == "S1A_IW_GRDH_1SDV_20260911T034500_051234_067890_C3D4"
        assert data["platform"] == "Sentinel-1A"
        assert data["sensor"] == "C-SAR"
        assert data["product_type"] == "GRD"
        assert data["orbit_direction"] == "ASCENDING"
        assert data["relative_orbit"] == 45
        assert data["polarization"] == "VV+VH"
        assert data["footprint"]["type"] == "Polygon"
        assert len(data["footprint"]["coordinates"]) == 1


@pytest.mark.asyncio
async def test_create_satellite_scene_nonexistent_investigation(mock_db_session):
    fake_inv_id = uuid.uuid4()
    payload = {
        "scene_identifier": "S1A_IW_GRDH_1SDV_20260911T034500",
        "acquisition_time": "2026-09-11T03:45:00Z",
        "footprint": VALID_FOOTPRINT_GEOJSON,
    }
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post(
            f"{settings.API_V1_PREFIX}/investigations/{fake_inv_id}/satellite-scenes",
            json=payload,
        )
        assert response.status_code == 404
        assert "not found" in response.json()["detail"].lower()


@pytest.mark.asyncio
async def test_create_satellite_scene_invalid_footprint_geojson(mock_db_session, mock_store):
    inv_id = list(mock_store.investigations.keys())[0]
    # Unclosed Polygon ring
    payload = {
        "scene_identifier": "S1A_IW_GRDH_1SDV_20260911T034500",
        "acquisition_time": "2026-09-11T03:45:00Z",
        "footprint": {
            "type": "Polygon",
            "coordinates": [[[103.2, 1.0], [104.5, 1.0], [104.5, 2.2], [103.2, 2.2]]],
        },
    }
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post(
            f"{settings.API_V1_PREFIX}/investigations/{inv_id}/satellite-scenes",
            json=payload,
        )
        assert response.status_code == 422


@pytest.mark.asyncio
async def test_create_satellite_scene_missing_required_fields(mock_db_session, mock_store):
    inv_id = list(mock_store.investigations.keys())[0]
    # Missing acquisition_time
    payload = {
        "scene_identifier": "S1A_IW_GRDH_1SDV_20260911T034500",
        "footprint": VALID_FOOTPRINT_GEOJSON,
    }
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post(
            f"{settings.API_V1_PREFIX}/investigations/{inv_id}/satellite-scenes",
            json=payload,
        )
        assert response.status_code == 422


# ==============================================================================
# 2. GET /api/v1/investigations/{id}/satellite-scenes (List)
# ==============================================================================

@pytest.mark.asyncio
async def test_list_satellite_scenes_success(mock_db_session, mock_store):
    inv_id = list(mock_store.investigations.keys())[0]
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get(
            f"{settings.API_V1_PREFIX}/investigations/{inv_id}/satellite-scenes"
        )
        assert response.status_code == 200
        data = response.json()
        assert "items" in data
        assert "total" in data
        assert data["total"] == 1
        assert len(data["items"]) == 1
        assert data["items"][0]["platform"] == "Sentinel-1A"
        assert data["items"][0]["footprint"]["type"] == "Polygon"


@pytest.mark.asyncio
async def test_list_satellite_scenes_nonexistent_investigation(mock_db_session):
    fake_inv_id = uuid.uuid4()
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get(
            f"{settings.API_V1_PREFIX}/investigations/{fake_inv_id}/satellite-scenes"
        )
        assert response.status_code == 404


# ==============================================================================
# 3. GET /api/v1/satellite-scenes/{scene_id}
# ==============================================================================

@pytest.mark.asyncio
async def test_get_satellite_scene_by_id(mock_db_session, mock_store):
    scene_id = list(mock_store.scenes.keys())[0]
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get(f"{settings.API_V1_PREFIX}/satellite-scenes/{scene_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == str(scene_id)
        assert data["footprint"]["type"] == "Polygon"


@pytest.mark.asyncio
async def test_get_satellite_scene_nonexistent_id(mock_db_session):
    fake_scene_id = uuid.uuid4()
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get(f"{settings.API_V1_PREFIX}/satellite-scenes/{fake_scene_id}")
        assert response.status_code == 404


@pytest.mark.asyncio
async def test_get_satellite_scene_invalid_uuid(mock_db_session):
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get(f"{settings.API_V1_PREFIX}/satellite-scenes/not-a-valid-uuid")
        assert response.status_code == 422
