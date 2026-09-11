import uuid
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from unittest.mock import MagicMock
import pytest
from httpx import ASGITransport, AsyncClient
import shapely.geometry
from geoalchemy2.shape import from_shape

from app.api.v1.investigations import _require_db
from app.core.config import settings
from app.db.session import get_db
from app.main import app
from app.models.investigation import Investigation
from app.repositories.investigation import InvestigationRepository
from app.schemas.investigation import (
    InvestigationCreate,
)


# Sample valid GeoJSON polygon in SRID 4326
VALID_POLYGON_GEOJSON = {
    "type": "Polygon",
    "coordinates": [
        [
            [103.5, 1.1],
            [104.0, 1.1],
            [104.0, 1.5],
            [103.5, 1.5],
            [103.5, 1.1],
        ]
    ],
}


def make_investigation_instance(
    id: Optional[uuid.UUID] = None,
    name: str = "Singapore Strait Incident",
    description: Optional[str] = "Anomalous dark slick detected near shipping lane",
    status: str = "active",
    geojson: Optional[Dict[str, Any]] = None,
    use_default_geometry: bool = True,
) -> Investigation:
    """Helper to instantiate an in-memory Investigation ORM model."""
    if geojson is not None:
        poly = shapely.geometry.shape(geojson)
        db_geom = from_shape(poly, srid=4326)
    elif use_default_geometry:
        poly = shapely.geometry.shape(VALID_POLYGON_GEOJSON)
        db_geom = from_shape(poly, srid=4326)
    else:
        db_geom = None

    now = datetime.now(timezone.utc)
    return Investigation(
        id=id or uuid.uuid4(),
        name=name,
        description=description,
        status=status,
        geometry=db_geom,
        created_at=now,
        updated_at=now,
    )


class MockDBStore:
    """In-memory mock storage for Investigation testing."""

    def __init__(self):
        self.investigations: Dict[uuid.UUID, Investigation] = {}

    def seed(self, items: List[Investigation]):
        for item in items:
            self.investigations[item.id] = item


@pytest.fixture
def mock_store():
    store = MockDBStore()
    # Seed 3 investigations for listing/pagination tests
    item1 = make_investigation_instance(name="Alpha Slick AOI")
    item2 = make_investigation_instance(name="Bravo Spill AOI")
    item3 = make_investigation_instance(name="Charlie Thermal AOI")
    store.seed([item1, item2, item3])
    return store


@pytest.fixture
def mock_db_session(mock_store: MockDBStore, monkeypatch):
    """Overrides get_db dependency and mock repository methods to use in-memory store."""
    mock_session = MagicMock()

    # Override InvestigationRepository methods with in-memory store logic
    def mock_create(db, obj_in: InvestigationCreate) -> Investigation:
        inv = make_investigation_instance(
            name=obj_in.name,
            description=obj_in.description,
            status=obj_in.status,
            geojson=obj_in.geometry,
            use_default_geometry=False,
        )
        mock_store.investigations[inv.id] = inv
        return inv

    def mock_get_by_id(db, investigation_id: uuid.UUID) -> Optional[Investigation]:
        return mock_store.investigations.get(investigation_id)

    def mock_get_list(db, page: int = 1, page_size: int = 20):
        all_items = sorted(
            mock_store.investigations.values(),
            key=lambda x: x.created_at,
            reverse=True,
        )
        total = len(all_items)
        offset = (page - 1) * page_size
        items = all_items[offset : offset + page_size]
        return items, total

    monkeypatch.setattr(InvestigationRepository, "create", mock_create)
    monkeypatch.setattr(InvestigationRepository, "get_by_id", mock_get_by_id)
    monkeypatch.setattr(InvestigationRepository, "get_list", mock_get_list)

    # Override get_db dependency
    app.dependency_overrides[get_db] = lambda: mock_session
    yield mock_session
    app.dependency_overrides.pop(get_db, None)


# ==============================================================================
# 1. POST /api/v1/investigations (Create)
# ==============================================================================

@pytest.mark.asyncio
async def test_create_investigation_success(mock_db_session):
    payload = {
        "name": "Malacca Strait Slick Alpha",
        "description": "Synthetic aperture radar anomaly confirmed",
        "status": "active",
        "geometry": VALID_POLYGON_GEOJSON,
    }
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post(f"{settings.API_V1_PREFIX}/investigations", json=payload)
        assert response.status_code == 201
        data = response.json()
        assert "id" in data
        assert uuid.UUID(data["id"])
        assert data["name"] == "Malacca Strait Slick Alpha"
        assert data["description"] == "Synthetic aperture radar anomaly confirmed"
        assert data["status"] == "active"
        assert data["geometry"]["type"] == "Polygon"
        assert len(data["geometry"]["coordinates"]) == 1
        assert "created_at" in data
        assert "updated_at" in data


@pytest.mark.asyncio
async def test_create_investigation_without_geometry(mock_db_session):
    payload = {
        "name": "Incident Without Geometry",
        "description": "Initial placeholder",
        "status": "active",
    }
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post(f"{settings.API_V1_PREFIX}/investigations", json=payload)
        assert response.status_code == 201
        data = response.json()
        assert data["name"] == "Incident Without Geometry"
        assert data["geometry"] is None


@pytest.mark.asyncio
async def test_create_investigation_missing_name(mock_db_session):
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post(
            f"{settings.API_V1_PREFIX}/investigations",
            json={"description": "Missing name test", "geometry": VALID_POLYGON_GEOJSON},
        )
        assert response.status_code == 422


@pytest.mark.asyncio
async def test_create_investigation_empty_or_whitespace_name(mock_db_session):
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # Empty string
        res1 = await client.post(
            f"{settings.API_V1_PREFIX}/investigations",
            json={"name": "", "geometry": VALID_POLYGON_GEOJSON},
        )
        assert res1.status_code == 422

        # Whitespace string
        res2 = await client.post(
            f"{settings.API_V1_PREFIX}/investigations",
            json={"name": "   ", "geometry": VALID_POLYGON_GEOJSON},
        )
        assert res2.status_code == 422


@pytest.mark.asyncio
async def test_create_investigation_invalid_geojson_type(mock_db_session):
    # Point instead of Polygon
    payload_point = {
        "name": "Invalid Type Point",
        "geometry": {
            "type": "Point",
            "coordinates": [103.5, 1.1],
        },
    }
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post(f"{settings.API_V1_PREFIX}/investigations", json=payload_point)
        assert response.status_code == 422

    # LineString instead of Polygon
    payload_linestring = {
        "name": "Invalid Type LineString",
        "geometry": {
            "type": "LineString",
            "coordinates": [[103.5, 1.1], [104.0, 1.2]],
        },
    }
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post(f"{settings.API_V1_PREFIX}/investigations", json=payload_linestring)
        assert response.status_code == 422


@pytest.mark.asyncio
async def test_create_investigation_invalid_polygon_geometry(mock_db_session):
    # Unclosed linear ring (first != last)
    payload_unclosed = {
        "name": "Unclosed Ring",
        "geometry": {
            "type": "Polygon",
            "coordinates": [
                [
                    [103.5, 1.1],
                    [104.0, 1.1],
                    [104.0, 1.5],
                    [103.5, 1.5],  # Not closed back to [103.5, 1.1]
                ]
            ],
        },
    }
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post(f"{settings.API_V1_PREFIX}/investigations", json=payload_unclosed)
        assert response.status_code == 422

    # Fewer than 4 points
    payload_too_few = {
        "name": "Too Few Points",
        "geometry": {
            "type": "Polygon",
            "coordinates": [[[103.5, 1.1], [104.0, 1.1], [103.5, 1.1]]],
        },
    }
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post(f"{settings.API_V1_PREFIX}/investigations", json=payload_too_few)
        assert response.status_code == 422

    # Coordinates out of range
    payload_out_of_bounds = {
        "name": "Out of Bounds",
        "geometry": {
            "type": "Polygon",
            "coordinates": [
                [
                    [200.0, 1.1],
                    [201.0, 1.1],
                    [201.0, 1.5],
                    [200.0, 1.5],
                    [200.0, 1.1],
                ]
            ],
        },
    }
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post(f"{settings.API_V1_PREFIX}/investigations", json=payload_out_of_bounds)
        assert response.status_code == 422


# ==============================================================================
# 2. GET /api/v1/investigations (List & Pagination)
# ==============================================================================

@pytest.mark.asyncio
async def test_list_investigations_success(mock_db_session):
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get(f"{settings.API_V1_PREFIX}/investigations")
        assert response.status_code == 200
        data = response.json()
        assert "items" in data
        assert "total" in data
        assert data["total"] == 3
        assert len(data["items"]) == 3
        assert isinstance(data["items"], list)
        assert data["items"][0]["name"] in ["Alpha Slick AOI", "Bravo Spill AOI", "Charlie Thermal AOI"]


@pytest.mark.asyncio
async def test_list_investigations_pagination_behavior(mock_db_session):
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # Page 1 with page_size=2
        response1 = await client.get(f"{settings.API_V1_PREFIX}/investigations?page=1&page_size=2")
        assert response1.status_code == 200
        data1 = response1.json()
        assert data1["total"] == 3
        assert len(data1["items"]) == 2

        # Page 2 with page_size=2
        response2 = await client.get(f"{settings.API_V1_PREFIX}/investigations?page=2&page_size=2")
        assert response2.status_code == 200
        data2 = response2.json()
        assert data2["total"] == 3
        assert len(data2["items"]) == 1

        # Invalid page (page < 1)
        response_invalid_page = await client.get(f"{settings.API_V1_PREFIX}/investigations?page=0")
        assert response_invalid_page.status_code == 422

        # Invalid page_size (page_size > 100)
        response_invalid_size = await client.get(f"{settings.API_V1_PREFIX}/investigations?page_size=101")
        assert response_invalid_size.status_code == 422


# ==============================================================================
# 3. GET /api/v1/investigations/{id} (Get by ID)
# ==============================================================================

@pytest.mark.asyncio
async def test_get_investigation_by_valid_id(mock_db_session, mock_store):
    existing_id = list(mock_store.investigations.keys())[0]
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get(f"{settings.API_V1_PREFIX}/investigations/{existing_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == str(existing_id)
        assert "geometry" in data
        assert data["geometry"]["type"] == "Polygon"


@pytest.mark.asyncio
async def test_get_investigation_nonexistent_id(mock_db_session):
    fake_id = uuid.uuid4()
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get(f"{settings.API_V1_PREFIX}/investigations/{fake_id}")
        assert response.status_code == 404
        assert "not found" in response.json()["detail"].lower()


@pytest.mark.asyncio
async def test_get_investigation_invalid_uuid(mock_db_session):
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get(f"{settings.API_V1_PREFIX}/investigations/not-a-valid-uuid")
        assert response.status_code == 422
