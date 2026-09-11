import json
import os
from pathlib import Path
from typing import List, Optional, Union
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

# Resolve path to backend/.env accurately regardless of working directory
_BACKEND_DIR = Path(__file__).resolve().parent.parent.parent
_ENV_FILE = _BACKEND_DIR / ".env"


class Settings(BaseSettings):
    """
    Application Settings configuration using pydantic-settings.
    Loads from environment variables or .env file with non-secret defaults.
    """

    APP_NAME: str = "OSPREY Intelligence API"
    APP_ENV: str = "development"
    API_V1_PREFIX: str = "/api/v1"
    DEBUG: bool = True
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

    # Neon PostgreSQL + PostGIS Connection URL
    DATABASE_URL: Optional[str] = None

    # Copernicus Data Space Ecosystem (CDSE) Catalog & Download URLs
    COPERNICUS_CATALOG_URL: str = "https://catalogue.dataspace.copernicus.eu/odata/v1/Products"
    CDSE_TOKEN_URL: str = "https://identity.dataspace.copernicus.eu/auth/realms/CDSE/protocol/openid-connect/token"
    CDSE_CLIENT_ID: str = "cdse-public"
    CDSE_USERNAME: Optional[str] = None
    CDSE_PASSWORD: Optional[str] = None
    CDSE_DOWNLOAD_URL: str = "https://download.dataspace.copernicus.eu/odata/v1/Products"

    # Local / Object storage root directory for downloaded satellite files
    OSPREY_DATA_ROOT: str = "data"

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",") if i.strip()]
        elif isinstance(v, str) and v.startswith("["):
            return json.loads(v)
        return v

    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def validate_database_url(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return None
        v_stripped = v.strip()
        if not v_stripped:
            return None
        # Normalize postgresql:// or postgres:// to postgresql+psycopg:// for psycopg 3 driver
        if v_stripped.startswith("postgresql://"):
            return v_stripped.replace("postgresql://", "postgresql+psycopg://", 1)
        elif v_stripped.startswith("postgres://"):
            return v_stripped.replace("postgres://", "postgresql+psycopg://", 1)
        return v_stripped

    model_config = SettingsConfigDict(
        env_file=(_ENV_FILE, ".env", "backend/.env"),
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


settings = Settings()
