import logging
from typing import Any, Dict, Generator, Optional
from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session, sessionmaker
from app.core.config import settings

logger = logging.getLogger(__name__)

engine = None
SessionLocal = None

if settings.DATABASE_URL:
    engine = create_engine(
        settings.DATABASE_URL,
        pool_pre_ping=True,
        pool_recycle=300,
        connect_args={"connect_timeout": 5},
    )
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Generator[Optional[Session], None, None]:
    """
    FastAPI dependency yielding a SQLAlchemy database session.
    Yields None when DATABASE_URL is unconfigured.
    """
    if SessionLocal is None:
        yield None
        return

    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def check_database_health() -> Dict[str, Any]:
    """
    Safely verifies PostgreSQL connectivity and PostGIS extension presence
    without exposing credentials, connection strings, or internal details.

    Returns:
        Dict with keys:
            configured (bool): Whether DATABASE_URL is provided
            connected (bool): Whether PostgreSQL connection succeeded
            postgis_available (bool): Whether PostGIS extension was queried
            postgis_version (Optional[str]): PostGIS version string if available
            error (Optional[str]): Sanitized non-secret error description
    """
    if not settings.DATABASE_URL or engine is None:
        return {
            "configured": False,
            "connected": False,
            "postgis_available": False,
            "postgis_version": None,
            "error": "Database configuration is missing",
        }

    try:
        with engine.connect() as conn:
            # 1. PostgreSQL connectivity check
            conn.execute(text("SELECT 1"))

            # 2. PostGIS extension & version verification
            postgis_version = None
            postgis_available = False
            try:
                res = conn.execute(text("SELECT PostGIS_Version()")).scalar()
                if res:
                    postgis_available = True
                    postgis_version = str(res).strip()
            except Exception:
                postgis_available = False

            return {
                "configured": True,
                "connected": True,
                "postgis_available": postgis_available,
                "postgis_version": postgis_version,
                "error": None,
            }
    except Exception as exc:
        logger.warning("Database health check failed: %s", type(exc).__name__)
        return {
            "configured": True,
            "connected": False,
            "postgis_available": False,
            "postgis_version": None,
            "error": "Failed to connect to database",
        }
