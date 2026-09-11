from typing import Optional
from fastapi import APIRouter, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from app.db.session import check_database_health

router = APIRouter()


class HealthResponse(BaseModel):
    status: str
    service: str


class DatabaseHealthResponse(BaseModel):
    status: str
    service: str
    database: str
    postgis: Optional[str] = None
    message: Optional[str] = None


@router.get("/health", response_model=HealthResponse)
async def get_health() -> HealthResponse:
    """
    Basic service health check endpoint.
    Returns HTTP 200 and operational status of the OSPREY backend service.
    """
    return HealthResponse(
        status="ok",
        service="osprey-backend",
    )


@router.get(
    "/health/db",
    response_model=DatabaseHealthResponse,
    responses={
        200: {"description": "Database and PostGIS operational"},
        503: {"description": "Database unconfigured or connection unavailable"},
    },
)
async def get_database_health():
    """
    Database & PostGIS health check endpoint.
    Verifies real Neon PostgreSQL connectivity and PostGIS extension status.
    Returns HTTP 503 if unconfigured or unreachable.
    """
    db_status = check_database_health()

    if not db_status["configured"]:
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={
                "status": "error",
                "service": "osprey-backend",
                "database": "not_configured",
                "message": "Database configuration is missing.",
            },
        )

    if not db_status["connected"]:
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={
                "status": "error",
                "service": "osprey-backend",
                "database": "disconnected",
                "message": "Database connection unavailable.",
            },
        )

    return DatabaseHealthResponse(
        status="ok",
        service="osprey-backend",
        database="connected",
        postgis="available" if db_status["postgis_available"] else "unavailable",
    )
