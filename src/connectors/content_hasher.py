"""Content hashing for change detection."""

from __future__ import annotations

import hashlib
import re
from typing import Optional


class ContentHasher:
    @staticmethod
    def hash_text(text: str) -> str:
        normalized = ContentHasher.normalize(text)
        return hashlib.sha256(normalized.encode("utf-8")).hexdigest()

    @staticmethod
    def normalize(text: str) -> str:
        """Normalize text to reduce noise from whitespace / dynamic content."""
        text = re.sub(r"\s+", " ", text).strip().lower()
        # Strip common dynamic fragments (timestamps, session IDs)
        text = re.sub(r"\b\d{10,13}\b", "", text)  # unix timestamps
        text = re.sub(r"[0-9a-f]{32,}", "", text)   # hashes / session IDs
        return text

    @staticmethod
    def has_changed(old_hash: Optional[str], new_hash: str) -> bool:
        if old_hash is None:
            return True
        return old_hash != new_hash
