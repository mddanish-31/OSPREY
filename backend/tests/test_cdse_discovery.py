import uuid
from datetime import datetime, timezone
import pytest
import shapely.geometry
from unittest.mock import MagicMock, patch
from httpx import ASGITransport, AsyncClient

from app.core.config import settings
from app.main import app
from app.models.investigation import Investigation
from app.models.satellite_scene import SatelliteScene
from app.schemas.copernicus import (
    Sentinel1ImportRequest,
    Sentinel1SearchRequest,
    Sentinel1SearchResult,
)
from app.services.copernicus.client import CopernicusCatalogClient
from app.services.copernicus.normalizer import normalize_cdse_product, parse_footprint


# Sample Mock CDSE Product Payload
SAMPLE_CDSE_PRODUCT = {
    "Id": "9651b2d4-3782-4ac3-a52c-51d7e13280a7",
    "Name": "S1D_IW_GRDH_1SDV_20260910T111644_20260910T111709_004515_00863D_2C69.SAFE",
    "ContentType": "application/octet-stream",
    "ContentLength": 1048576000,
    "PublicationDate": "2026-09-10T12:00:00.000Z",
    "ModificationDate": "2026-09-10T12:00:00.000Z",
    "Online": True,
    "ContentDate": {
        "Start": "2026-09-10T11:16:44.851782Z",
        "End": "2026-09-10T11:17:09.851351Z",
    },
    "GeoFootprint": {
        "type": "Polygon",
        "coordinates": [
            [
                [103.814354, 2.436898],
                [104.129578, 0.924696],
                [106.379799, 1.404931],
                [106.06749, 2.912659],
                [103.814354, 2.436898],
            ]
        ],
    },
    "Attributes": [
        {"Name": "productType", "Value": "IW_GRDH_1S"},
        {"Name": "operationalMode", "Value": "IW"},
        {"Name": "polarisationChannels", "Value": "VV&VH"},
        {"Name": "orbitDirection", "Value": "DESCENDING"},
        {"Name": "relativeOrbitNumber", "Value": 26},
        {"Name": "platformShortName", "Value": "SENTINEL-1"},
        {"Name": "platformSerialIdentifier", "Value": "D"},
        {"Name": "s3Path", "Value": "/eodata/Sentinel-1/SAR/IW_GRDH_1S/2026/09/10/..."},
    ],
}


# =========================================================================
# 1. Schema Validation Tests
# =========================================================================

def test_sentinel1_search_request_valid():
    req = Sentinel1SearchRequest(
        start_datetime=datetime(2026, 9, 1, 0, 0, tzinfo=timezone.utc),
        end_datetime=datetime(2026, 9, 11, 0, 0, tzinfo=timezone.utc),
        limit=20,
        product_type="IW_GRDH_1S",
    )
    assert req.limit == 20
    assert req.product_type == "IW_GRDH_1S"


def test_sentinel1_search_request_invalid_dates():
    with pytest.raises(ValueError, match="strictly earlier than end_datetime"):
        Sentinel1SearchRequest(
            start_datetime=datetime(2026, 9, 11, 0, 0, tzinfo=timezone.utc),
            end_datetime=datetime(2026, 9, 1, 0, 0, tzinfo=timezone.utc),
        )


def test_sentinel1_search_request_limit_bounds():
    with pytest.raises(ValueError):
        Sentinel1SearchRequest(
            start_datetime=datetime(2026, 9, 1, 0, 0, tzinfo=timezone.utc),
            end_datetime=datetime(2026, 9, 11, 0, 0, tzinfo=timezone.utc),
            limit=150,  # Max is 100
        )


# =========================================================================
# 2. OData Query Construction Tests
# =========================================================================

def test_copernicus_client_filter_construction():
    client = CopernicusCatalogClient()
    aoi_poly = shapely.geometry.Polygon([
        (103.5, 1.0),
        (104.5, 1.0),
        (104.5, 2.0),
        (103.5, 2.0),
        (103.5, 1.0),
    ])
    start = datetime(2026, 9, 1, 0, 0, 0, tzinfo=timezone.utc)
    end = datetime(2026, 9, 10, 23, 59, 59, tzinfo=timezone.utc)

    filter_str = client._build_filter_expression(
        aoi_polygon=aoi_poly,
        start_datetime=start,
        end_datetime=end,
        product_type="IW_GRDH_1S",
        operational_mode="IW",
        polarization="VV+VH",
        orbit_direction="DESCENDING",
    )

    # 1. Collection filter
    assert "Collection/Name eq 'SENTINEL-1'" in filter_str
    # 2. Structured productType filter
    assert "Attributes/OData.CSC.StringAttribute/any(att:att/Name eq 'productType' and att/OData.CSC.StringAttribute/Value eq 'IW_GRDH_1S')" in filter_str
    # 3. Spatial Intersects filter
    assert "OData.CSC.Intersects(area=geography'SRID=4326;POLYGON((103.5 1, 104.5 1, 104.5 2, 103.5 2, 103.5 1))')" in filter_str or "POLYGON ((103.5 1.0" in filter_str or "POLYGON((103.5 1.0" in filter_str
    # 4. ContentDate temporal filter
    assert "ContentDate/Start ge 2026-09-01T00:00:00.000Z" in filter_str
    assert "ContentDate/Start le 2026-09-10T23:59:59.000Z" in filter_str
    # 5. Optional filters
    assert "att/Name eq 'operationalMode' and att/OData.CSC.StringAttribute/Value eq 'IW'" in filter_str
    assert "att/Name eq 'orbitDirection' and att/OData.CSC.StringAttribute/Value eq 'DESCENDING'" in filter_str


# =========================================================================
# 3. Normalizer & Footprint Parsing Tests
# =========================================================================

def test_normalize_cdse_product_success():
    res = normalize_cdse_product(SAMPLE_CDSE_PRODUCT)
    assert isinstance(res, Sentinel1SearchResult)
    assert res.source == "copernicus_dataspace"
    assert res.source_product_id == "9651b2d4-3782-4ac3-a52c-51d7e13280a7"
    assert res.name == "S1D_IW_GRDH_1SDV_20260910T111644_20260910T111709_004515_00863D_2C69.SAFE"
    assert res.platform == "Sentinel-1D"
    assert res.product_type == "IW_GRDH_1S"
    assert res.polarization == "VV+VH"
    assert res.orbit_direction == "DESCENDING"
    assert res.relative_orbit == 26
    assert res.online is True
    assert res.content_length == 1048576000
    assert res.footprint["type"] == "Polygon"
    assert len(res.footprint["coordinates"][0]) == 5


def test_parse_footprint_from_wkt_fallback():
    wkt_str = "geography'SRID=4326;POLYGON((103.0 1.0, 104.0 1.0, 104.0 2.0, 103.0 2.0, 103.0 1.0))'"
    parsed = parse_footprint(None, wkt_str)
    assert parsed["type"] == "Polygon"
    assert parsed["coordinates"][0][0] == [103.0, 1.0]
    assert parsed["coordinates"][0][-1] == [103.0, 1.0]


def test_normalize_missing_optional_attributes():
    minimal_product = {
        "Id": "abc-123",
        "Name": "S1A_IW_GRDH_1SDV_20260910T000000.SAFE",
        "ContentDate": {"Start": "2026-09-10T00:00:00Z"},
        "GeoFootprint": {
            "type": "Polygon",
            "coordinates": [[[10, 10], [11, 10], [11, 11], [10, 11], [10, 10]]],
        },
    }
    norm = normalize_cdse_product(minimal_product)
    assert norm.source_product_id == "abc-123"
    assert norm.platform == "Sentinel-1A"
    assert norm.operational_mode is None
    assert norm.polarization is None
    assert norm.relative_orbit is None


def test_normalize_missing_id_raises_error():
    with pytest.raises(ValueError, match="missing required 'Id'"):
        normalize_cdse_product({"Name": "test"})


def test_normalize_missing_footprint_raises_error():
    with pytest.raises(ValueError, match="missing a valid spatial footprint"):
        normalize_cdse_product({
            "Id": "123",
            "Name": "test",
            "ContentDate": {"Start": "2026-09-10T00:00:00Z"},
        })


# =========================================================================
# 4. API Endpoints Unit Tests (with Mocked CDSE & DB)
# =========================================================================

@pytest.mark.asyncio
async def test_search_sentinel1_endpoint_success(monkeypatch):
    test_inv_id = uuid.uuid4()
    mock_inv = MagicMock()
    mock_inv.id = test_inv_id
    mock_inv.name = "Malacca Strait Patrol"
    # Create valid Shapely polygon for investigation
    mock_poly = shapely.geometry.Polygon([
        (103.5, 1.0),
        (104.5, 1.0),
        (104.5, 2.0),
        (103.5, 2.0),
        (103.5, 1.0),
    ])
    mock_inv.geometry = MagicMock()

    # Mock DB repositories & DB session
    monkeypatch.setattr("app.api.v1.satellite_scenes._require_db", lambda: MagicMock())
    monkeypatch.setattr("app.api.v1.satellite_scenes.InvestigationRepository.get_by_id", lambda db, iid: mock_inv)
    monkeypatch.setattr("app.api.v1.satellite_scenes.to_shape", lambda geom: mock_poly)

    # Mock CopernicusCatalogClient
    mock_search_res = [normalize_cdse_product(SAMPLE_CDSE_PRODUCT)]
    monkeypatch.setattr(
        "app.api.v1.satellite_scenes.CopernicusCatalogClient.search_sentinel1_products",
        lambda self, **kwargs: (mock_search_res, False),
    )

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        payload = {
            "start_datetime": "2026-09-01T00:00:00Z",
            "end_datetime": "2026-09-11T00:00:00Z",
            "limit": 10,
            "product_type": "IW_GRDH_1S",
        }
        resp = await client.post(
            f"{settings.API_V1_PREFIX}/investigations/{test_inv_id}/satellite-scenes/search",
            json=payload,
        )
        assert resp.status_code == 200
        data = resp.json()
        assert data["source"] == "Copernicus Data Space Ecosystem"
        assert data["count"] == 1
        assert len(data["results"]) == 1
        assert data["results"][0]["source_product_id"] == "9651b2d4-3782-4ac3-a52c-51d7e13280a7"
        assert data["results"][0]["platform"] == "Sentinel-1D"


@pytest.mark.asyncio
async def test_search_sentinel1_investigation_not_found(monkeypatch):
    test_inv_id = uuid.uuid4()
    monkeypatch.setattr("app.api.v1.satellite_scenes._require_db", lambda: MagicMock())
    monkeypatch.setattr("app.api.v1.satellite_scenes.InvestigationRepository.get_by_id", lambda db, iid: None)

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        resp = await client.post(
            f"{settings.API_V1_PREFIX}/investigations/{test_inv_id}/satellite-scenes/search",
            json={
                "start_datetime": "2026-09-01T00:00:00Z",
                "end_datetime": "2026-09-11T00:00:00Z",
            },
        )
        assert resp.status_code == 404


@pytest.mark.asyncio
async def test_import_sentinel1_endpoint_success(monkeypatch):
    test_inv_id = uuid.uuid4()
    mock_inv = MagicMock()
    mock_inv.id = test_inv_id

    monkeypatch.setattr("app.api.v1.satellite_scenes._require_db", lambda: MagicMock())
    monkeypatch.setattr("app.api.v1.satellite_scenes.InvestigationRepository.get_by_id", lambda db, iid: mock_inv)
    monkeypatch.setattr(
        "app.api.v1.satellite_scenes.SatelliteSceneRepository.list_by_investigation",
        lambda db, iid: ([], 0),
    )

    # Mock CDSE get_product_by_id
    monkeypatch.setattr(
        "app.api.v1.satellite_scenes.CopernicusCatalogClient.get_product_by_id",
        lambda self, pid: SAMPLE_CDSE_PRODUCT,
    )

    # Mock SatelliteSceneRepository.create
    mock_saved_scene = MagicMock()
    mock_saved_scene.id = uuid.uuid4()
    mock_saved_scene.investigation_id = test_inv_id
    mock_saved_scene.scene_identifier = SAMPLE_CDSE_PRODUCT["Name"]
    mock_saved_scene.provider = "Copernicus Data Space"
    mock_saved_scene.platform = "Sentinel-1D"
    mock_saved_scene.sensor = "C-SAR"
    mock_saved_scene.product_type = "IW_GRDH_1S"
    mock_saved_scene.acquisition_time = datetime(2026, 9, 10, 11, 16, 44, tzinfo=timezone.utc)
    mock_saved_scene.orbit_direction = "DESCENDING"
    mock_saved_scene.relative_orbit = 26
    mock_saved_scene.polarization = "VV+VH"
    mock_saved_scene.cloud_cover = None
    mock_saved_scene.source_uri = f"{settings.COPERNICUS_CATALOG_URL}({SAMPLE_CDSE_PRODUCT['Id']})"
    mock_saved_scene.metadata_json = {
        "source": "copernicus_dataspace",
        "source_product_id": SAMPLE_CDSE_PRODUCT["Id"],
        "processing_state": "METADATA_IMPORTED",
    }
    mock_saved_scene.footprint = SAMPLE_CDSE_PRODUCT["GeoFootprint"]
    mock_saved_scene.created_at = datetime.now(timezone.utc)

    monkeypatch.setattr(
        "app.api.v1.satellite_scenes.SatelliteSceneRepository.create",
        lambda db, iid, obj_in: mock_saved_scene,
    )

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        resp = await client.post(
            f"{settings.API_V1_PREFIX}/investigations/{test_inv_id}/satellite-scenes/import",
            json={"source_product_id": SAMPLE_CDSE_PRODUCT["Id"]},
        )
        assert resp.status_code == 201
        data = resp.json()
        assert data["scene_identifier"] == SAMPLE_CDSE_PRODUCT["Name"]
        assert data["platform"] == "Sentinel-1D"
        assert data["metadata_json"]["processing_state"] == "METADATA_IMPORTED"


@pytest.mark.asyncio
async def test_import_sentinel1_duplicate_rejected(monkeypatch):
    test_inv_id = uuid.uuid4()
    mock_inv = MagicMock()
    mock_inv.id = test_inv_id

    # Existing scene in DB with same source_product_id
    existing_scene = MagicMock()
    existing_scene.scene_identifier = SAMPLE_CDSE_PRODUCT["Name"]
    existing_scene.metadata_json = {"source_product_id": SAMPLE_CDSE_PRODUCT["Id"]}
    existing_scene.source_uri = f"{settings.COPERNICUS_CATALOG_URL}({SAMPLE_CDSE_PRODUCT['Id']})"

    monkeypatch.setattr("app.api.v1.satellite_scenes._require_db", lambda: MagicMock())
    monkeypatch.setattr("app.api.v1.satellite_scenes.InvestigationRepository.get_by_id", lambda db, iid: mock_inv)
    monkeypatch.setattr(
        "app.api.v1.satellite_scenes.SatelliteSceneRepository.list_by_investigation",
        lambda db, iid: ([existing_scene], 1),
    )
    monkeypatch.setattr(
        "app.api.v1.satellite_scenes.CopernicusCatalogClient.get_product_by_id",
        lambda self, pid: SAMPLE_CDSE_PRODUCT,
    )

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        resp = await client.post(
            f"{settings.API_V1_PREFIX}/investigations/{test_inv_id}/satellite-scenes/import",
            json={"source_product_id": SAMPLE_CDSE_PRODUCT["Id"]},
        )
        assert resp.status_code == 409
        data = resp.json()
        assert "already imported" in data["detail"]
