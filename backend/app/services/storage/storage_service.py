import logging
import os
import re
from pathlib import Path
from typing import Optional

from app.core.config import settings

logger = logging.getLogger(__name__)


class LocalStorageService:
    """
    Local filesystem storage abstraction for downloaded Sentinel-1 products.
    Enforces strict path sanitization to prevent directory traversal and provides
    atomic file finalization (.part -> final product).
    """

    def __init__(self, root_dir: Optional[str] = None):
        self.root_path = Path(root_dir or settings.OSPREY_DATA_ROOT).resolve()
        self.root_path.mkdir(parents=True, exist_ok=True)

    def _sanitize_path_component(self, name: str) -> str:
        """Sanitizes a path segment to ensure it contains no directory separators or traversal tokens."""
        if not name or not isinstance(name, str):
            raise ValueError("Path component must be a non-empty string")
        clean = name.strip()
        if "/" in clean or "\\" in clean or ".." in clean or clean in [".", "", "\0"]:
            raise ValueError(f"Invalid path component containing traversal or separator characters: '{name}'")
        clean = re.sub(r'[/\\:\0]', '_', clean)
        return clean

    def _verify_safe_path(self, target: Path) -> Path:
        """Verifies that resolved path stays strictly within root_path."""
        resolved = target.resolve()
        try:
            resolved.relative_to(self.root_path)
        except ValueError:
            raise ValueError(f"Security error: Path '{target}' attempts directory traversal outside storage root")
        return resolved

    def get_scene_dir(self, investigation_id: str, source_product_id: str) -> Path:
        """Returns and ensures creation of the directory for a specific scene's raw data."""
        safe_inv = self._sanitize_path_component(str(investigation_id))
        safe_prod = self._sanitize_path_component(str(source_product_id))

        scene_dir = self.root_path / "sentinel1" / safe_inv / safe_prod
        verified = self._verify_safe_path(scene_dir)
        verified.mkdir(parents=True, exist_ok=True)
        return verified

    def get_final_path(self, investigation_id: str, source_product_id: str, filename: str) -> Path:
        """Returns the final destination file path for a downloaded Sentinel-1 product."""
        scene_dir = self.get_scene_dir(investigation_id, source_product_id)
        safe_file = self._sanitize_path_component(filename)
        return self._verify_safe_path(scene_dir / safe_file)

    def get_temp_path(self, investigation_id: str, source_product_id: str, filename: str) -> Path:
        """Returns the temporary (.part) file path used during streaming download."""
        scene_dir = self.get_scene_dir(investigation_id, source_product_id)
        safe_file = self._sanitize_path_component(f"{filename}.part")
        return self._verify_safe_path(scene_dir / safe_file)

    def atomic_commit(self, temp_path: Path, final_path: Path) -> Path:
        """
        Atomically commits the verified temporary file by replacing/renaming to the final destination.
        """
        self._verify_safe_path(temp_path)
        self._verify_safe_path(final_path)

        if not temp_path.exists():
            raise FileNotFoundError(f"Temporary file '{temp_path}' does not exist for atomic commit")

        # Atomic replace on POSIX and Windows (Python 3.3+)
        temp_path.replace(final_path)
        return final_path

    def cleanup_temp(self, temp_path: Path) -> None:
        """Safely cleans up temporary (.part) file if it exists."""
        try:
            self._verify_safe_path(temp_path)
            if temp_path.exists():
                temp_path.unlink()
        except Exception as exc:
            logger.warning("Failed to cleanup temporary file %s: %s", temp_path, exc)

    def file_exists(self, investigation_id: str, source_product_id: str, filename: str) -> bool:
        """Checks if the final product file exists and has non-zero size."""
        try:
            path = self.get_final_path(investigation_id, source_product_id, filename)
            return path.is_file() and path.stat().st_size > 0
        except Exception:
            return False

    def get_file_size(self, investigation_id: str, source_product_id: str, filename: str) -> Optional[int]:
        """Returns file size in bytes if file exists."""
        try:
            path = self.get_final_path(investigation_id, source_product_id, filename)
            if path.is_file():
                return path.stat().st_size
        except Exception:
            pass
        return None


# Global storage service instance
storage_service = LocalStorageService()
