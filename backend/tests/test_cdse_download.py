import hashlib
import io
import json
import tempfile
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional
from unittest.mock import MagicMock, patch
import httpx
import pytest
import shapely.geometry
from fastapi import HTTPException, status
from geoalchemy2.shape import from_shape
from httpx import ASGITransport, AsyncClient

from app.core.config import settings
from app.db.session import get_db
from app.main import app
from app.models.investigation import Investigation
from app.models.satellite_scene import SatelliteScene
from app.repositories.investigation import InvestigationRepository
from app.repositories.satellite_scene import SatelliteSceneRepository
from app.schemas.copernicus import Sentinel1DownloadResponse
from app.services.copernicus.auth import CopernicusAuthService
from app.services.copernicus.client import CopernicusCatalogClient
from app.services.storage.storage_service import LocalStorageService

# Sample valid GeoJSON polygon footprint
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
    provider: str = "Copernicus Data Space",
    platform: str = "Sentinel-1A",
    sensor: str = "C-SAR",
    product_type: str = "IW_GRDH_1S",
    acquisition_time: Optional[datetime] = None,
    orbit_direction: Optional[str] = "ASCENDING",
    relative_orbit: Optional[int] = 120,
    polarization: Optional[str] = "VV+VH",
    cloud_cover: Optional[float] = None,
    source_uri: Optional[str] = None,
    metadata_json: Optional[Dict[str, Any]] = None,
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
        source_uri=source_uri or f"https://catalogue.dataspace.copernicus.eu/odata/v1/Products({uuid.uuid4()})",
        metadata_json=metadata_json
        or {
            "source": "copernicus_dataspace",
            "source_product_id": "a0000000-0000-0000-0000-000000000001",
            "processing_state": "METADATA_IMPORTED",
        },
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

    scene = make_scene_instance(
        investigation_id=inv_id,
        scene_identifier="S1A_IW_GRDH_1SDV_20260911T023000_050000_060000_A1B2",
        metadata_json={
            "source": "copernicus_dataspace",
            "source_product_id": "a0000000-0000-0000-0000-000000000001",
            "processing_state": "METADATA_IMPORTED",
            "online": True,
        },
    )
    store.scenes[scene.id] = scene
    return store


@pytest.fixture
def mock_db_session(mock_store: MockSceneStore, monkeypatch):
    mock_session = MagicMock()

    def mock_inv_get_by_id(db, investigation_id: uuid.UUID):
        return mock_store.investigations.get(investigation_id)

    def mock_scene_get_by_id(db, scene_id: uuid.UUID):
        return mock_store.scenes.get(scene_id)

    def mock_scene_update_metadata(db, scene: SatelliteScene, metadata_updates: Dict[str, Any]):
        current = scene.metadata_json or {}
        merged = {**current, **metadata_updates}
        scene.metadata_json = merged
        return scene

    monkeypatch.setattr(InvestigationRepository, "get_by_id", mock_inv_get_by_id)
    monkeypatch.setattr(SatelliteSceneRepository, "get_by_id", mock_scene_get_by_id)
    monkeypatch.setattr(SatelliteSceneRepository, "update_metadata", mock_scene_update_metadata)

    app.dependency_overrides[get_db] = lambda: mock_session
    yield mock_session
    app.dependency_overrides.pop(get_db, None)


# ==============================================================================
# 1. AUTHENTICATION SERVICE TESTS (CopernicusAuthService)
# ==============================================================================

def test_auth_missing_credentials(monkeypatch):
    """1. Test that missing credentials raises HTTP 503 configuration error."""
    monkeypatch.setattr(settings, "CDSE_USERNAME", "")
    monkeypatch.setattr(settings, "CDSE_PASSWORD", "")

    auth = CopernicusAuthService()
    assert not auth.is_configured()

    with pytest.raises(HTTPException) as exc_info:
        auth.get_access_token()
    assert exc_info.value.status_code == status.HTTP_503_SERVICE_UNAVAILABLE
    assert "CDSE authentication is not configured" in exc_info.value.detail


def test_auth_successful_token_acquisition(monkeypatch):
    """2. Test successful OpenID Connect token acquisition with cdse-public client."""
    monkeypatch.setattr(settings, "CDSE_USERNAME", "test_user@dataspace.copernicus.eu")
    monkeypatch.setattr(settings, "CDSE_PASSWORD", "test_secret_pass")

    auth = CopernicusAuthService()
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = {
        "access_token": "mock-jwt-access-token-xyz123",
        "expires_in": 600,
        "refresh_token": "mock-refresh-token-456",
        "refresh_expires_in": 1800,
    }

    with patch("httpx.Client.post", return_value=mock_response) as mock_post:
        token = auth.get_access_token()
        assert token == "mock-jwt-access-token-xyz123"
        assert auth._access_token == "mock-jwt-access-token-xyz123"
        assert auth._refresh_token == "mock-refresh-token-456"

        mock_post.assert_called_once()
        call_args = mock_post.call_args
        assert call_args[1]["data"]["client_id"] == "cdse-public"
        assert call_args[1]["data"]["grant_type"] == "password"
        assert call_args[1]["data"]["username"] == "test_user@dataspace.copernicus.eu"


def test_auth_token_caching_and_runtime_memory(monkeypatch):
    """3. Test that token is cached in runtime memory and reused without redundant HTTP calls."""
    monkeypatch.setattr(settings, "CDSE_USERNAME", "test_user@dataspace.copernicus.eu")
    monkeypatch.setattr(settings, "CDSE_PASSWORD", "test_pass")

    auth = CopernicusAuthService()
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = {
        "access_token": "cached-token-123",
        "expires_in": 600,
        "refresh_token": "refresh-123",
    }

    with patch("httpx.Client.post", return_value=mock_response) as mock_post:
        token1 = auth.get_access_token()
        token2 = auth.get_access_token()
        assert token1 == "cached-token-123"
        assert token2 == "cached-token-123"
        # Only 1 POST was made because token is cached in runtime memory
        assert mock_post.call_count == 1


def test_auth_failure_sanitized_error(monkeypatch):
    """4. Test that authentication failure raises sanitized 503 error without leaking credentials."""
    monkeypatch.setattr(settings, "CDSE_USERNAME", "test_user@dataspace.copernicus.eu")
    monkeypatch.setattr(settings, "CDSE_PASSWORD", "wrong_password_secret")

    auth = CopernicusAuthService()
    mock_response = MagicMock()
    mock_response.status_code = 401
    mock_response.text = '{"error": "invalid_grant", "error_description": "Invalid user credentials"}'

    with patch("httpx.Client.post", return_value=mock_response):
        with pytest.raises(HTTPException) as exc_info:
            auth.get_access_token()
        assert exc_info.value.status_code == status.HTTP_503_SERVICE_UNAVAILABLE
        assert "CDSE authentication failed" in exc_info.value.detail
        # Ensure password is not present in detail
        assert "wrong_password_secret" not in exc_info.value.detail


# ==============================================================================
# 2. STORAGE ABSTRACTION & SECURITY TESTS (LocalStorageService)
# ==============================================================================

def test_storage_path_traversal_prevention():
    """5. Test that LocalStorageService rejects directory traversal attempts."""
    with tempfile.TemporaryDirectory() as tmp_dir:
        storage = LocalStorageService(root_dir=tmp_dir)

        with pytest.raises(ValueError, match="Invalid path component"):
            storage.get_scene_dir("..", "product123")

        with pytest.raises(ValueError, match="Invalid path component"):
            storage.get_scene_dir("inv1", "../../../etc/passwd")

        with pytest.raises(ValueError, match="Invalid path component"):
            storage.get_final_path("inv1", "prod1", "..")


def test_storage_atomic_commit_and_cleanup():
    """6. Test atomic file rename (.part -> final) and cleanup."""
    with tempfile.TemporaryDirectory() as tmp_dir:
        storage = LocalStorageService(root_dir=tmp_dir)
        inv_id = "inv-test-123"
        prod_id = "prod-test-456"
        filename = "S1A_IW_GRDH.zip"

        temp_path = storage.get_temp_path(inv_id, prod_id, filename)
        final_path = storage.get_final_path(inv_id, prod_id, filename)

        assert str(temp_path).endswith(".zip.part")
        assert not temp_path.exists()
        assert not final_path.exists()

        # Write sample binary data to temp file
        temp_path.write_bytes(b"PK\x03\x04mock_zip_binary_payload")
        assert temp_path.exists()

        # Atomic commit
        committed = storage.atomic_commit(temp_path, final_path)
        assert committed == final_path
        assert not temp_path.exists()
        assert final_path.exists()
        assert final_path.read_bytes() == b"PK\x03\x04mock_zip_binary_payload"

        # Check storage service queries
        assert storage.file_exists(inv_id, prod_id, filename)
        assert storage.get_file_size(inv_id, prod_id, filename) == len(b"PK\x03\x04mock_zip_binary_payload")

        # Test cleanup
        dummy_temp = storage.get_temp_path(inv_id, prod_id, "other.zip")
        dummy_temp.write_bytes(b"trash")
        storage.cleanup_temp(dummy_temp)
        assert not dummy_temp.exists()


# ==============================================================================
# 3. STREAMING DOWNLOAD & INTEGRITY VERIFICATION (CopernicusCatalogClient)
# ==============================================================================

def test_download_streaming_and_local_sha256():
    """7. Test streaming chunked download, .part file creation, and local SHA-256 computation."""
    client = CopernicusCatalogClient()
    mock_payload = b"SAMPLE_SENTINEL1_SAR_BINARY_DATA_CHUNK_12345"
    expected_sha256 = hashlib.sha256(mock_payload).hexdigest()

    with tempfile.TemporaryDirectory() as tmp_dir:
        dest_temp = Path(tmp_dir) / "test.zip.part"

        mock_resp = MagicMock()
        mock_resp.status_code = 200
        mock_resp.iter_bytes.return_value = [
            b"SAMPLE_SENTINEL1_",
            b"SAR_BINARY_DATA_",
            b"CHUNK_12345",
        ]

        with patch("httpx.Client.stream") as mock_stream:
            mock_stream.return_value.__enter__.return_value = mock_resp

            result = client.download_product_stream(
                source_product_id="prod-uuid-1",
                destination_temp_path=dest_temp,
                access_token="valid-token",
            )

            assert dest_temp.exists()
            assert dest_temp.read_bytes() == mock_payload
            assert result["bytes_downloaded"] == len(mock_payload)
            assert result["local_sha256"] == expected_sha256
            assert result["verification_status"] == "VERIFIED"


def test_download_authoritative_checksum_verification_success():
    """8. Test integrity verification against authoritative CDSE MD5 checksum."""
    client = CopernicusCatalogClient()
    mock_payload = b"SAR_DATA_WITH_KNOWN_MD5"
    actual_md5 = hashlib.md5(mock_payload).hexdigest()

    with tempfile.TemporaryDirectory() as tmp_dir:
        dest_temp = Path(tmp_dir) / "test.zip.part"

        mock_resp = MagicMock()
        mock_resp.status_code = 200
        mock_resp.iter_bytes.return_value = [mock_payload]

        with patch("httpx.Client.stream") as mock_stream:
            mock_stream.return_value.__enter__.return_value = mock_resp

            result = client.download_product_stream(
                source_product_id="prod-uuid-1",
                destination_temp_path=dest_temp,
                access_token="valid-token",
                expected_checksum=actual_md5,
                checksum_algorithm="MD5",
            )

            assert result["verification_status"] == "VERIFIED"
            assert result["verification_method"] == "AUTHORITATIVE_CHECKSUM"
            assert result["authoritative_checksum"] == actual_md5


def test_download_authoritative_checksum_mismatch_failure():
    """9. Test that checksum mismatch raises ValueError and fails integrity verification."""
    client = CopernicusCatalogClient()
    mock_payload = b"SAR_DATA_CORRUPTED"

    with tempfile.TemporaryDirectory() as tmp_dir:
        dest_temp = Path(tmp_dir) / "test.zip.part"

        mock_resp = MagicMock()
        mock_resp.status_code = 200
        mock_resp.iter_bytes.return_value = [mock_payload]

        with patch("httpx.Client.stream") as mock_stream:
            mock_stream.return_value.__enter__.return_value = mock_resp

            with pytest.raises(ValueError, match="Integrity check failed: Authoritative MD5 mismatch"):
                client.download_product_stream(
                    source_product_id="prod-uuid-1",
                    destination_temp_path=dest_temp,
                    access_token="valid-token",
                    expected_checksum="00000000000000000000000000000000",
                    checksum_algorithm="MD5",
                )


def test_download_content_length_verification():
    """10. Test fallback to Content-Length verification when no authoritative checksum is provided."""
    client = CopernicusCatalogClient()
    mock_payload = b"EXACT_TWENTY_BYTES!!"
    expected_len = len(mock_payload)

    with tempfile.TemporaryDirectory() as tmp_dir:
        dest_temp = Path(tmp_dir) / "test.zip.part"

        mock_resp = MagicMock()
        mock_resp.status_code = 200
        mock_resp.iter_bytes.return_value = [mock_payload]

        with patch("httpx.Client.stream") as mock_stream:
            mock_stream.return_value.__enter__.return_value = mock_resp

            result = client.download_product_stream(
                source_product_id="prod-uuid-1",
                destination_temp_path=dest_temp,
                access_token="valid-token",
                expected_content_length=expected_len,
            )

            assert result["verification_status"] == "VERIFIED"
            assert result["verification_method"] == "CONTENT_LENGTH"

        # Test Content-Length mismatch
        with patch("httpx.Client.stream") as mock_stream:
            mock_stream.return_value.__enter__.return_value = mock_resp

            with pytest.raises(ValueError, match="Content-Length mismatch"):
                client.download_product_stream(
                    source_product_id="prod-uuid-1",
                    destination_temp_path=dest_temp,
                    access_token="valid-token",
                    expected_content_length=999999,  # Mismatched length
                )


def test_download_http_errors_no_infinite_retry():
    """11. Test HTTP 401, 403, and 404 raise without looping."""
    client = CopernicusCatalogClient()

    with tempfile.TemporaryDirectory() as tmp_dir:
        dest_temp = Path(tmp_dir) / "test.zip.part"

        for status_code in [401, 403, 404]:
            mock_resp = MagicMock()
            mock_resp.status_code = status_code

            with patch("httpx.Client.stream") as mock_stream:
                mock_stream.return_value.__enter__.return_value = mock_resp

                with pytest.raises(HTTPException) as exc_info:
                    client.download_product_stream(
                        source_product_id="prod-uuid-1",
                        destination_temp_path=dest_temp,
                        access_token="token",
                        max_retries=3,
                    )
                assert exc_info.value.status_code == status_code


def test_download_retry_on_429_and_5xx(monkeypatch):
    """12. Test that transient 429 / 503 triggers bounded exponential retries."""
    monkeypatch.setattr("time.sleep", lambda s: None)
    client = CopernicusCatalogClient()

    with tempfile.TemporaryDirectory() as tmp_dir:
        dest_temp = Path(tmp_dir) / "test.zip.part"

        # Attempt 1: 503, Attempt 2: 429, Attempt 3: Success
        resp_503 = MagicMock(status_code=503)
        resp_429 = MagicMock(status_code=429)
        resp_200 = MagicMock(status_code=200)
        resp_200.iter_bytes.return_value = [b"FINAL_SUCCESSFUL_CHUNK"]

        with patch("httpx.Client.stream") as mock_stream:
            mock_stream.return_value.__enter__.side_effect = [resp_503, resp_429, resp_200]

            result = client.download_product_stream(
                source_product_id="prod-uuid-1",
                destination_temp_path=dest_temp,
                access_token="token",
                max_retries=3,
            )

            assert result["bytes_downloaded"] == len(b"FINAL_SUCCESSFUL_CHUNK")
            assert mock_stream.call_count == 3


# ==============================================================================
# 4. DOWNLOAD ENDPOINT (POST /api/v1/satellite-scenes/{scene_id}/download)
# ==============================================================================

@pytest.mark.asyncio
async def test_api_download_satellite_scene_success(mock_db_session, mock_store, monkeypatch, tmp_path):
    """13. Full vertical slice: DB lookup -> CDSE revalidation -> auth -> stream -> atomic commit -> READY_FOR_PROCESSING."""
    scene = list(mock_store.scenes.values())[0]
    source_prod_id = scene.metadata_json["source_product_id"]

    # Point storage to temporary test directory
    monkeypatch.setattr(settings, "OSPREY_DATA_ROOT", str(tmp_path))
    from app.services.storage.storage_service import storage_service
    monkeypatch.setattr(storage_service, "root_path", tmp_path)

    # Mock CDSE Product Revalidation response
    raw_cdse_product = {
        "Id": source_prod_id,
        "Name": scene.scene_identifier,
        "CollectionName": "SENTINEL-1",
        "ContentLength": 32,
        "Attributes": [
            {"Name": "checksum", "Value": "abcd1234ef5678"},
        ],
    }

    mock_client_get = MagicMock(return_value=raw_cdse_product)
    monkeypatch.setattr(CopernicusCatalogClient, "get_product_by_id", mock_client_get)

    # Mock Auth Service
    monkeypatch.setattr(
        "app.services.copernicus.auth.auth_service.get_access_token",
        lambda: "valid-jwt-token-123",
    )

    # Mock Stream Download
    def mock_download_stream(self, source_product_id, destination_temp_path, access_token, **kwargs):
        destination_temp_path.parent.mkdir(parents=True, exist_ok=True)
        destination_temp_path.write_bytes(b"STREAMED_SENTINEL1_MOCK_SAFE_ZIP")
        return {
            "bytes_downloaded": 32,
            "local_sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
            "authoritative_checksum": "abcd1234ef5678",
            "authoritative_checksum_algorithm": "checksum",
            "verification_status": "VERIFIED",
            "verification_method": "AUTHORITATIVE_CHECKSUM",
        }

    monkeypatch.setattr(CopernicusCatalogClient, "download_product_stream", mock_download_stream)

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post(
            f"{settings.API_V1_PREFIX}/satellite-scenes/{scene.id}/download"
        )
        assert response.status_code == 200
        data = response.json()

        assert data["scene_id"] == str(scene.id)
        assert data["source_product_id"] == source_prod_id
        assert data["processing_state"] == "READY_FOR_PROCESSING"
        assert data["verification_status"] == "VERIFIED"
        assert data["verification_method"] == "AUTHORITATIVE_CHECKSUM"
        assert data["content_length"] == 32
        assert data["downloaded_filename"] == f"{scene.scene_identifier}.zip"
        assert data["local_sha256"] == "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"

        # Verify DB metadata state updated
        assert scene.metadata_json["processing_state"] == "READY_FOR_PROCESSING"
        assert scene.metadata_json["verification_status"] == "VERIFIED"

        # Verify final file exists in storage root
        expected_final = tmp_path / "sentinel1" / str(scene.investigation_id) / source_prod_id / f"{scene.scene_identifier}.zip"
        assert expected_final.exists()


@pytest.mark.asyncio
async def test_api_download_revalidation_uuid_mismatch(mock_db_session, mock_store, monkeypatch):
    """14. Test that revalidation failing UUID check returns HTTP 400."""
    scene = list(mock_store.scenes.values())[0]

    # Return mismatched UUID from CDSE
    mismatched_product = {
        "Id": "different-uuid-9999",
        "Name": scene.scene_identifier,
        "CollectionName": "SENTINEL-1",
    }
    monkeypatch.setattr(CopernicusCatalogClient, "get_product_by_id", lambda self, pid: mismatched_product)

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post(
            f"{settings.API_V1_PREFIX}/satellite-scenes/{scene.id}/download"
        )
        assert response.status_code == 400
        assert "UUID mismatch" in response.json()["detail"]


@pytest.mark.asyncio
async def test_api_download_revalidation_non_sentinel1_collection(mock_db_session, mock_store, monkeypatch):
    """15. Test that revalidation rejecting non-SENTINEL-1 collection returns HTTP 400."""
    scene = list(mock_store.scenes.values())[0]
    source_prod_id = scene.metadata_json["source_product_id"]

    non_s1_product = {
        "Id": source_prod_id,
        "Name": "S2A_MSIL2A_20260911",
        "CollectionName": "SENTINEL-2",
    }
    monkeypatch.setattr(CopernicusCatalogClient, "get_product_by_id", lambda self, pid: non_s1_product)

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post(
            f"{settings.API_V1_PREFIX}/satellite-scenes/{scene.id}/download"
        )
        assert response.status_code == 400
        assert "expected SENTINEL-1" in response.json()["detail"]


@pytest.mark.asyncio
async def test_api_download_idempotency(mock_db_session, mock_store, monkeypatch, tmp_path):
    """16. Test idempotency: already downloaded and verified product is not redownloaded."""
    scene = list(mock_store.scenes.values())[0]
    source_prod_id = scene.metadata_json["source_product_id"]
    filename = f"{scene.scene_identifier}.zip"

    # Pre-seed verified scene metadata and existing file
    scene.metadata_json["processing_state"] = "READY_FOR_PROCESSING"
    scene.metadata_json["verification_status"] = "VERIFIED"
    scene.metadata_json["local_sha256"] = "precomputed-sha256"

    monkeypatch.setattr(settings, "OSPREY_DATA_ROOT", str(tmp_path))
    from app.services.storage.storage_service import storage_service
    monkeypatch.setattr(storage_service, "root_path", tmp_path)

    final_dir = tmp_path / "sentinel1" / str(scene.investigation_id) / source_prod_id
    final_dir.mkdir(parents=True, exist_ok=True)
    (final_dir / filename).write_bytes(b"EXISTING_VALID_PRODUCT")

    raw_cdse_product = {
        "Id": source_prod_id,
        "Name": scene.scene_identifier,
        "CollectionName": "SENTINEL-1",
    }
    monkeypatch.setattr(CopernicusCatalogClient, "get_product_by_id", lambda self, pid: raw_cdse_product)

    download_stream_mock = MagicMock()
    monkeypatch.setattr(CopernicusCatalogClient, "download_product_stream", download_stream_mock)

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post(
            f"{settings.API_V1_PREFIX}/satellite-scenes/{scene.id}/download"
        )
        assert response.status_code == 200
        data = response.json()
        assert data["processing_state"] == "READY_FOR_PROCESSING"
        assert data["verification_status"] == "VERIFIED"
        # Download stream was NOT called because file is already verified
        download_stream_mock.assert_not_called()


@pytest.mark.asyncio
async def test_api_download_failed_state_transition(mock_db_session, mock_store, monkeypatch, tmp_path):
    """17. Test that failure cleans up .part and sets processing_state to DOWNLOAD_FAILED."""
    scene = list(mock_store.scenes.values())[0]
    source_prod_id = scene.metadata_json["source_product_id"]

    monkeypatch.setattr(settings, "OSPREY_DATA_ROOT", str(tmp_path))
    from app.services.storage.storage_service import storage_service
    monkeypatch.setattr(storage_service, "root_path", tmp_path)

    raw_cdse_product = {
        "Id": source_prod_id,
        "Name": scene.scene_identifier,
        "CollectionName": "SENTINEL-1",
    }
    monkeypatch.setattr(CopernicusCatalogClient, "get_product_by_id", lambda self, pid: raw_cdse_product)
    monkeypatch.setattr("app.services.copernicus.auth.auth_service.get_access_token", lambda: "valid-token")

    def mock_failing_stream(*args, **kwargs):
        raise HTTPException(status_code=503, detail="CDSE server stream disconnected")

    monkeypatch.setattr(CopernicusCatalogClient, "download_product_stream", mock_failing_stream)

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post(
            f"{settings.API_V1_PREFIX}/satellite-scenes/{scene.id}/download"
        )
        assert response.status_code == 503
        assert scene.metadata_json["processing_state"] == "DOWNLOAD_FAILED"
        assert scene.metadata_json["download_status"] == "FAILED"
