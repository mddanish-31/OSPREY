"""
Storage abstraction package for OSPREY satellite products and pipeline artifacts.
"""

from app.services.storage.storage_service import LocalStorageService, storage_service

__all__ = ["LocalStorageService", "storage_service"]
