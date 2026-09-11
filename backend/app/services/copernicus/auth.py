import logging
import time
from typing import Optional
import httpx
from fastapi import HTTPException, status

from app.core.config import settings

logger = logging.getLogger(__name__)


class CopernicusAuthService:
    """
    Authentication service for official Copernicus Data Space Ecosystem (CDSE) Keycloak identity provider.
    Manages OAuth2 / OpenID Connect token acquisition, runtime memory caching, and expiry refresh.
    Credentials and tokens are strictly kept in backend runtime memory — NEVER persisted to disk or DB.
    """

    def __init__(self, timeout_seconds: float = 15.0):
        self.token_url = settings.CDSE_TOKEN_URL
        self.client_id = settings.CDSE_CLIENT_ID
        self.timeout = timeout_seconds

        # In-memory runtime token cache
        self._access_token: Optional[str] = None
        self._expires_at: Optional[float] = None
        self._refresh_token: Optional[str] = None
        self._refresh_expires_at: Optional[float] = None

    def is_configured(self) -> bool:
        """Returns whether CDSE credentials are configured in backend environment."""
        return bool(settings.CDSE_USERNAME and settings.CDSE_PASSWORD)

    def get_access_token(self, force_refresh: bool = False) -> str:
        """
        Retrieves a valid CDSE access token.
        Uses in-memory cached token if valid (with 60-second expiration safety buffer).
        Refreshes or re-authenticates as needed.
        """
        now = time.time()
        # Return cached token if still valid and not forced to refresh
        if (
            not force_refresh
            and self._access_token
            and self._expires_at
            and now < (self._expires_at - 60)
        ):
            return self._access_token

        if not self.is_configured():
            logger.warning("CDSE authentication requested but CDSE_USERNAME or CDSE_PASSWORD is not configured.")
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="CDSE authentication is not configured. Set CDSE_USERNAME and CDSE_PASSWORD in backend environment.",
            )

        # Attempt token refresh if available and valid
        if (
            self._refresh_token
            and self._refresh_expires_at
            and now < (self._refresh_expires_at - 30)
            and not force_refresh
        ):
            try:
                return self._request_token(
                    grant_type="refresh_token",
                    refresh_token=self._refresh_token,
                )
            except Exception as exc:
                logger.info("CDSE refresh token failed, falling back to password grant: %s", type(exc).__name__)

        # Request new token via password grant
        return self._request_token(
            grant_type="password",
            username=settings.CDSE_USERNAME,
            password=settings.CDSE_PASSWORD,
        )

    def _request_token(self, grant_type: str, **kwargs) -> str:
        """Executes token endpoint request against CDSE Keycloak service."""
        payload = {
            "client_id": self.client_id,
            "grant_type": grant_type,
            **kwargs,
        }

        try:
            with httpx.Client(timeout=self.timeout) as client:
                response = client.post(self.token_url, data=payload)

                if response.status_code in [400, 401, 403]:
                    logger.warning("CDSE Keycloak authentication rejected: HTTP %s", response.status_code)
                    self._invalidate_cache()
                    raise HTTPException(
                        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                        detail="CDSE authentication failed. Invalid credentials or unauthorized client.",
                    )

                if response.status_code >= 500:
                    logger.warning("CDSE Keycloak identity service error: HTTP %s", response.status_code)
                    raise HTTPException(
                        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                        detail="CDSE identity authentication provider is currently unavailable.",
                    )

                response.raise_for_status()
                data = response.json()

        except httpx.TimeoutException:
            logger.warning("CDSE authentication request timed out")
            raise HTTPException(
                status_code=status.HTTP_504_GATEWAY_TIMEOUT,
                detail="Connection to CDSE identity authentication provider timed out.",
            ) from None
        except httpx.RequestError as exc:
            logger.warning("CDSE authentication network error: %s", type(exc).__name__)
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Unable to connect to CDSE identity authentication provider.",
            ) from None
        except HTTPException:
            raise
        except Exception as exc:
            logger.error("Failed to parse CDSE authentication response: %s", type(exc).__name__)
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Received invalid response from CDSE identity service.",
            ) from None

        access_token = data.get("access_token")
        if not access_token:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="CDSE identity response missing access_token",
            )

        expires_in = int(data.get("expires_in", 300))
        refresh_expires_in = int(data.get("refresh_expires_in", 1800))
        now = time.time()

        # Update in-memory cache
        self._access_token = access_token
        self._expires_at = now + expires_in
        self._refresh_token = data.get("refresh_token")
        self._refresh_expires_at = now + refresh_expires_in

        return access_token

    def _invalidate_cache(self) -> None:
        """Clears cached tokens."""
        self._access_token = None
        self._expires_at = None
        self._refresh_token = None
        self._refresh_expires_at = None


# Singleton instance for runtime authentication
auth_service = CopernicusAuthService()
