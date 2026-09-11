import pytest
from httpx import ASGITransport, AsyncClient
from app.main import app
from app.core.config import settings
from app.db.session import check_database_health, get_db


@pytest.mark.asyncio
async def test_health_endpoint():
    """
    Verify GET /api/v1/health returns HTTP 200 and the exact expected JSON schema:
    {
        "status": "ok",
        "service": "osprey-backend"
    }
    """
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        response = await client.get(f"{settings.API_V1_PREFIX}/health")
        assert response.status_code == 200
        assert response.json() == {
            "status": "ok",
            "service": "osprey-backend",
        }


@pytest.mark.asyncio
async def test_root_endpoint():
    """
    Verify GET / returns HTTP 200 and operational status message.
    """
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        response = await client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "operational"
        assert "service" in data


@pytest.mark.asyncio
async def test_database_health_endpoint_safe_behavior():
    """
    Verify GET /api/v1/health/db safely reports database status:
    - If unconfigured, returns HTTP 503 with database: not_configured (no secret leaks).
    - If configured, returns HTTP 200 (connected) or HTTP 503 (disconnected).
    """
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        response = await client.get(f"{settings.API_V1_PREFIX}/health/db")
        data = response.json()

        assert "service" in data
        assert data["service"] == "osprey-backend"

        if not settings.DATABASE_URL:
            assert response.status_code == 503
            assert data["database"] == "not_configured"
            assert data["status"] == "error"
        else:
            assert response.status_code in [200, 503]
            assert data["database"] in ["connected", "disconnected"]


@pytest.mark.asyncio
async def test_database_health_endpoint_disconnected_returns_503(monkeypatch):
    """
    Verify GET /api/v1/health/db returns HTTP 503 Service Unavailable when DB is disconnected.
    """
    monkeypatch.setattr(
        "app.api.v1.health.check_database_health",
        lambda: {
            "configured": True,
            "connected": False,
            "postgis_available": False,
            "postgis_version": None,
            "error": "Database connection unavailable",
        },
    )
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        response = await client.get(f"{settings.API_V1_PREFIX}/health/db")
        assert response.status_code == 503
        data = response.json()
        assert data["status"] == "error"
        assert data["service"] == "osprey-backend"
        assert data["database"] == "disconnected"
        assert data["message"] == "Database connection unavailable."


@pytest.mark.asyncio
async def test_database_health_endpoint_unconfigured_returns_503(monkeypatch):
    """
    Verify GET /api/v1/health/db returns HTTP 503 Service Unavailable when DB is unconfigured.
    """
    monkeypatch.setattr(
        "app.api.v1.health.check_database_health",
        lambda: {
            "configured": False,
            "connected": False,
            "postgis_available": False,
            "postgis_version": None,
            "error": "Database configuration is missing",
        },
    )
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        response = await client.get(f"{settings.API_V1_PREFIX}/health/db")
        assert response.status_code == 503
        data = response.json()
        assert data["status"] == "error"
        assert data["service"] == "osprey-backend"
        assert data["database"] == "not_configured"
        assert data["message"] == "Database configuration is missing."


@pytest.mark.asyncio
async def test_database_health_endpoint_connected_returns_200(monkeypatch):
    """
    Verify GET /api/v1/health/db returns HTTP 200 OK when DB and PostGIS are connected.
    """
    monkeypatch.setattr(
        "app.api.v1.health.check_database_health",
        lambda: {
            "configured": True,
            "connected": True,
            "postgis_available": True,
            "postgis_version": "3.6.0",
            "error": None,
        },
    )
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        response = await client.get(f"{settings.API_V1_PREFIX}/health/db")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ok"
        assert data["service"] == "osprey-backend"
        assert data["database"] == "connected"
        assert data["postgis"] == "available"


def test_check_database_health_function():
    """
    Unit test for check_database_health() utility function.
    Verifies that it returns a structured dict and never raises uncaught exceptions.
    """
    result = check_database_health()
    assert isinstance(result, dict)
    assert "configured" in result
    assert "connected" in result
    assert "postgis_available" in result
    assert "postgis_version" in result
    assert "error" in result


def test_get_db_dependency_generator():
    """
    Verify get_db() dependency yields safely whether database is configured or not.
    """
    gen = get_db()
    db = next(gen)
    # If not configured, db is None
    if not settings.DATABASE_URL:
        assert db is None
    # Generator completes cleanly
    try:
        next(gen)
    except StopIteration:
        pass
