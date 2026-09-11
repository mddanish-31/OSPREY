from fastapi import APIRouter
from app.api.v1.health import router as health_router
from app.api.v1.investigations import router as investigations_router
from app.api.v1.satellite_scenes import router as satellite_scenes_router

api_v1_router = APIRouter()
api_v1_router.include_router(health_router, tags=["health"])
api_v1_router.include_router(investigations_router)
api_v1_router.include_router(satellite_scenes_router)
