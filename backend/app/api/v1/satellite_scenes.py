import logging
import uuid
from datetime import datetime, timezone
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from geoalchemy2.shape import to_shape
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.geometry import db_geometry_to_geojson, validate_geojson_polygon
from app.db.session import get_db
from app.repositories.investigation import InvestigationRepository
from app.repositories.satellite_scene import SatelliteSceneRepository
from app.schemas.copernicus import (
    Sentinel1DownloadResponse,
    Sentinel1ImportRequest,
    Sentinel1SearchRequest,
    Sentinel1SearchResponse,
)
from app.schemas.satellite_scene import (
    SatelliteSceneCreate,
    SatelliteSceneListResponse,
    SatelliteSceneResponse,
)
from app.services.copernicus.auth import auth_service
from app.services.copernicus.client import CopernicusCatalogClient
from app.services.copernicus.normalizer import normalize_cdse_product
from app.services.storage.storage_service import storage_service

logger = logging.getLogger(__name__)

router = APIRouter(tags=["Satellite Scenes"])


def _require_db(db: Optional[Session] = Depends(get_db)) -> Session:
    if db is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database service is currently unavailable or not configured",
        )
    return db


@router.post(
    "/investigations/{investigation_id}/satellite-scenes",
    response_model=SatelliteSceneResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Add a Sentinel-1 satellite scene to an investigation (Direct Ingestion)",
)
def create_satellite_scene(
    investigation_id: uuid.UUID,
    payload: SatelliteSceneCreate,
    db: Session = Depends(_require_db),
) -> SatelliteSceneResponse:
    try:
        # 1. Verify parent investigation exists
        investigation = InvestigationRepository.get_by_id(db, investigation_id)
        if not investigation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Investigation with ID '{investigation_id}' not found",
            )

        # 2. Persist satellite scene
        scene = SatelliteSceneRepository.create(db, investigation_id, payload)
        return SatelliteSceneResponse.model_validate(scene)
    except HTTPException:
        raise
    except Exception as exc:
        logger.error("Failed to create satellite scene: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create satellite scene",
        ) from None


@router.post(
    "/investigations/{investigation_id}/satellite-scenes/search",
    response_model=Sentinel1SearchResponse,
    summary="Search Copernicus Data Space (CDSE) for real Sentinel-1 products intersecting investigation AOI",
)
def search_sentinel1_scenes(
    investigation_id: uuid.UUID,
    payload: Sentinel1SearchRequest,
    db: Session = Depends(_require_db),
) -> Sentinel1SearchResponse:
    # 1. Verify parent investigation exists
    investigation = InvestigationRepository.get_by_id(db, investigation_id)
    if not investigation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Investigation with ID '{investigation_id}' not found",
        )

    # 2. Retrieve AOI Polygon from PostGIS
    if not investigation.geometry:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Active investigation does not have a spatial boundary (AOI) defined.",
        )

    try:
        # Convert DB geometry to Shapely polygon
        aoi_poly = to_shape(investigation.geometry)
        if not aoi_poly.is_valid:
            raise ValueError(f"Invalid AOI polygon: {aoi_poly}")
    except Exception as exc:
        logger.error("Failed to parse investigation AOI geometry: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Investigation spatial boundary geometry is invalid.",
        ) from None

    # 3. Query CDSE Catalog Client (ephemeral discovery)
    client = CopernicusCatalogClient()
    results, has_more = client.search_sentinel1_products(
        aoi_polygon=aoi_poly,
        start_datetime=payload.start_datetime,
        end_datetime=payload.end_datetime,
        product_type=payload.product_type,
        limit=payload.limit,
        operational_mode=payload.operational_mode,
        polarization=payload.polarization,
        orbit_direction=payload.orbit_direction,
    )

    return Sentinel1SearchResponse(
        source="Copernicus Data Space Ecosystem",
        results=results,
        count=len(results),
        has_more=has_more,
    )


@router.post(
    "/investigations/{investigation_id}/satellite-scenes/import",
    response_model=SatelliteSceneResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Import authoritative Sentinel-1 metadata and footprint from CDSE into Neon/PostGIS",
)
def import_sentinel1_scene(
    investigation_id: uuid.UUID,
    payload: Sentinel1ImportRequest,
    db: Session = Depends(_require_db),
) -> SatelliteSceneResponse:
    # 1. Verify parent investigation exists
    investigation = InvestigationRepository.get_by_id(db, investigation_id)
    if not investigation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Investigation with ID '{investigation_id}' not found",
        )

    # 2. Fetch authoritative CDSE product by UUID (revalidation)
    client = CopernicusCatalogClient()
    raw_product = client.get_product_by_id(payload.source_product_id)

    # 3. Normalize authoritative product into OSPREY schema
    try:
        norm = normalize_cdse_product(raw_product)
    except Exception as exc:
        logger.error("Failed to normalize CDSE product %s: %s", payload.source_product_id, exc)
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Authoritative CDSE product could not be normalized: {exc}",
        ) from None

    # 4. Check for duplicate imports for this investigation
    existing_scenes, _ = SatelliteSceneRepository.list_by_investigation(db, investigation_id)
    for existing in existing_scenes:
        if (
            existing.scene_identifier == norm.name
            or (existing.metadata_json and existing.metadata_json.get("source_product_id") == payload.source_product_id)
            or (existing.source_uri and payload.source_product_id in existing.source_uri)
        ):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Satellite scene '{norm.name}' (CDSE Product ID: {payload.source_product_id}) is already imported into this investigation.",
            )

    # 5. Build persistence payload with METADATA_IMPORTED processing state
    metadata_payload = {
        "source": "copernicus_dataspace",
        "source_product_id": payload.source_product_id,
        "processing_state": "METADATA_IMPORTED",
        "online": norm.online,
        "acquisition_end": norm.acquisition_end.isoformat() if norm.acquisition_end else None,
        "publication_date": norm.publication_date.isoformat() if norm.publication_date else None,
        "content_length": norm.content_length,
        "s3_path": norm.s3_path,
        "operational_mode": norm.operational_mode,
    }

    scene_create = SatelliteSceneCreate(
        scene_identifier=norm.name,
        provider="Copernicus Data Space",
        platform=norm.platform or "Sentinel-1",
        sensor="C-SAR",
        product_type=norm.product_type,
        acquisition_time=norm.acquisition_start,
        orbit_direction=norm.orbit_direction,
        relative_orbit=norm.relative_orbit,
        polarization=norm.polarization,
        cloud_cover=None,
        source_uri=f"{settings.COPERNICUS_CATALOG_URL}({payload.source_product_id})",
        metadata_json=metadata_payload,
        footprint=norm.footprint,
    )

    # 6. Persist to Neon/PostGIS
    try:
        created_scene = SatelliteSceneRepository.create(db, investigation_id, scene_create)
        return SatelliteSceneResponse.model_validate(created_scene)
    except Exception as exc:
        logger.error("Failed to persist imported satellite scene: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to persist satellite scene record to database",
        ) from None


@router.post(
    "/satellite-scenes/{scene_id}/download",
    response_model=Sentinel1DownloadResponse,
    summary="Download real Sentinel-1 product binary from CDSE, store safely, verify integrity, and transition to READY_FOR_PROCESSING",
)
def download_satellite_scene(
    scene_id: uuid.UUID,
    db: Session = Depends(_require_db),
) -> Sentinel1DownloadResponse:
    # 1. Verify scene exists
    scene = SatelliteSceneRepository.get_by_id(db, scene_id)
    if not scene:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Satellite scene with ID '{scene_id}' not found",
        )

    # 2. Extract trusted CDSE source product ID
    meta = scene.metadata_json or {}
    source_product_id = meta.get("source_product_id")
    if not source_product_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Scene does not have an associated CDSE source_product_id.",
        )

    investigation_id = scene.investigation_id
    investigation = InvestigationRepository.get_by_id(db, investigation_id)
    if not investigation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Parent investigation with ID '{investigation_id}' not found",
        )

    # 3. Revalidate authoritative product against CDSE
    client = CopernicusCatalogClient()
    raw_product = client.get_product_by_id(source_product_id)

    # Confirm UUID matches
    if str(raw_product.get("Id", "")).strip() != str(source_product_id).strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Authoritative CDSE product UUID mismatch.",
        )

    # Confirm collection is SENTINEL-1
    collection = (
        raw_product.get("CollectionName")
        or (raw_product.get("Collection", {}).get("Name") if isinstance(raw_product.get("Collection"), dict) else None)
        or ""
    )
    product_name = raw_product.get("Name", scene.scene_identifier)
    if not (collection.upper().startswith("SENTINEL-1") or product_name.upper().startswith("S1")):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Authoritative CDSE product collection is '{collection}', expected SENTINEL-1.",
        )

    # Determine filename (Sentinel-1 products are zipped packages containing .SAFE)
    filename = f"{product_name}.zip" if not product_name.endswith(".zip") else product_name

    # Extract expected checksum & content length if available
    expected_content_length = raw_product.get("ContentLength")
    expected_checksum = None
    checksum_algo = None

    for att in raw_product.get("Attributes", []):
        if isinstance(att, dict) and "checksum" in str(att.get("Name", "")).lower():
            expected_checksum = str(att.get("Value", ""))
            checksum_algo = att.get("Name")

    # 4. Idempotency check: if file already downloaded and verified, return existing state
    if storage_service.file_exists(str(investigation_id), str(source_product_id), filename):
        current_state = meta.get("processing_state")
        if current_state in ["READY_FOR_PROCESSING", "VERIFIED"]:
            return Sentinel1DownloadResponse(
                scene_id=scene.id,
                source_product_id=source_product_id,
                processing_state=current_state,
                verification_status=meta.get("verification_status", "VERIFIED"),
                verification_method=meta.get("verification_method", "EXISTING_VERIFIED"),
                content_length=storage_service.get_file_size(str(investigation_id), str(source_product_id), filename),
                downloaded_filename=filename,
                download_started_at=datetime.fromisoformat(meta["download_started_at"]) if meta.get("download_started_at") else None,
                download_completed_at=datetime.fromisoformat(meta["download_completed_at"]) if meta.get("download_completed_at") else None,
                local_sha256=meta.get("local_sha256"),
                error_message=None,
            )

    # 5. Obtain authenticated access token
    access_token = auth_service.get_access_token()

    # 6. Stream download into storage abstraction
    temp_path = storage_service.get_temp_path(str(investigation_id), str(source_product_id), filename)
    final_path = storage_service.get_final_path(str(investigation_id), str(source_product_id), filename)

    # Update state in DB to DOWNLOADING
    started_at = datetime.now(timezone.utc)
    SatelliteSceneRepository.update_metadata(
        db,
        scene,
        {
            "processing_state": "DOWNLOADING",
            "download_status": "DOWNLOADING",
            "download_started_at": started_at.isoformat(),
        },
    )

    try:
        download_result = client.download_product_stream(
            source_product_id=source_product_id,
            destination_temp_path=temp_path,
            access_token=access_token,
            expected_checksum=expected_checksum,
            checksum_algorithm=checksum_algo,
            expected_content_length=expected_content_length,
            max_retries=3,
        )

        # Atomic rename to final product path
        storage_service.atomic_commit(temp_path, final_path)
        completed_at = datetime.now(timezone.utc)

        # Update database with verified state and metadata
        metadata_updates = {
            "processing_state": "READY_FOR_PROCESSING",
            "download_status": "COMPLETED",
            "storage_path": f"sentinel1/{investigation_id}/{source_product_id}/{filename}",
            "downloaded_filename": filename,
            "content_length": download_result["bytes_downloaded"],
            "local_sha256": download_result["local_sha256"],
            "authoritative_checksum": download_result["authoritative_checksum"],
            "authoritative_checksum_algorithm": download_result["authoritative_checksum_algorithm"],
            "verification_status": download_result["verification_status"],
            "verification_method": download_result["verification_method"],
            "download_started_at": started_at.isoformat(),
            "download_completed_at": completed_at.isoformat(),
            "download_error": None,
        }
        SatelliteSceneRepository.update_metadata(db, scene, metadata_updates)

        return Sentinel1DownloadResponse(
            scene_id=scene.id,
            source_product_id=source_product_id,
            processing_state="READY_FOR_PROCESSING",
            verification_status=download_result["verification_status"],
            verification_method=download_result["verification_method"],
            content_length=download_result["bytes_downloaded"],
            downloaded_filename=filename,
            download_started_at=started_at,
            download_completed_at=completed_at,
            local_sha256=download_result["local_sha256"],
            error_message=None,
        )

    except Exception as exc:
        storage_service.cleanup_temp(temp_path)
        error_msg = str(exc)
        logger.error("Download failed for scene %s: %s", scene_id, error_msg)

        SatelliteSceneRepository.update_metadata(
            db,
            scene,
            {
                "processing_state": "DOWNLOAD_FAILED",
                "download_status": "FAILED",
                "download_error": error_msg,
            },
        )
        if isinstance(exc, HTTPException):
            raise
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Sentinel-1 download or integrity check failed: {error_msg}",
        ) from None


@router.get(
    "/investigations/{investigation_id}/satellite-scenes",
    response_model=SatelliteSceneListResponse,
    summary="List all satellite scenes acquired for an investigation",
)
def list_satellite_scenes(
    investigation_id: uuid.UUID,
    db: Session = Depends(_require_db),
) -> SatelliteSceneListResponse:
    try:
        # 1. Verify parent investigation exists
        investigation = InvestigationRepository.get_by_id(db, investigation_id)
        if not investigation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Investigation with ID '{investigation_id}' not found",
            )

        # 2. Query scenes
        items, total = SatelliteSceneRepository.list_by_investigation(
            db, investigation_id
        )
        return SatelliteSceneListResponse(
            items=[SatelliteSceneResponse.model_validate(item) for item in items],
            total=total,
        )
    except HTTPException:
        raise
    except Exception as exc:
        logger.error("Failed to list satellite scenes: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve satellite scenes",
        ) from None


@router.get(
    "/satellite-scenes/{scene_id}",
    response_model=SatelliteSceneResponse,
    summary="Get a satellite scene by ID",
)
def get_satellite_scene(
    scene_id: uuid.UUID,
    db: Session = Depends(_require_db),
) -> SatelliteSceneResponse:
    try:
        scene = SatelliteSceneRepository.get_by_id(db, scene_id)
        if not scene:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Satellite scene with ID '{scene_id}' not found",
            )
        return SatelliteSceneResponse.model_validate(scene)
    except HTTPException:
        raise
    except Exception as exc:
        logger.error("Failed to get satellite scene %s: %s", scene_id, exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve satellite scene",
        ) from None
