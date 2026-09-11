import logging
import uuid
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.repositories.investigation import InvestigationRepository
from app.schemas.investigation import (
    InvestigationCreate,
    InvestigationListResponse,
    InvestigationResponse,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/investigations", tags=["Investigations"])


def _require_db(db: Optional[Session] = Depends(get_db)) -> Session:
    if db is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database service is currently unavailable or not configured",
        )
    return db


@router.post(
    "",
    response_model=InvestigationResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new Investigation",
)
def create_investigation(
    payload: InvestigationCreate,
    db: Session = Depends(_require_db),
) -> InvestigationResponse:
    try:
        investigation = InvestigationRepository.create(db, payload)
        return InvestigationResponse.model_validate(investigation)
    except HTTPException:
        raise
    except Exception as exc:
        logger.error("Failed to create investigation: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create investigation",
        ) from None


@router.get(
    "",
    response_model=InvestigationListResponse,
    summary="List investigations with pagination",
)
def list_investigations(
    page: int = Query(1, ge=1, description="Page number starting from 1"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page (max 100)"),
    db: Session = Depends(_require_db),
) -> InvestigationListResponse:
    try:
        items, total = InvestigationRepository.get_list(
            db, page=page, page_size=page_size
        )
        return InvestigationListResponse(
            items=[InvestigationResponse.model_validate(item) for item in items],
            total=total,
        )
    except HTTPException:
        raise
    except Exception as exc:
        logger.error("Failed to list investigations: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve investigations",
        ) from None


@router.get(
    "/{investigation_id}",
    response_model=InvestigationResponse,
    summary="Get investigation by ID",
)
def get_investigation(
    investigation_id: uuid.UUID,
    db: Session = Depends(_require_db),
) -> InvestigationResponse:
    try:
        investigation = InvestigationRepository.get_by_id(db, investigation_id)
        if not investigation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Investigation with ID '{investigation_id}' not found",
            )
        return InvestigationResponse.model_validate(investigation)
    except HTTPException:
        raise
    except Exception as exc:
        logger.error("Failed to get investigation %s: %s", investigation_id, exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve investigation",
        ) from None
