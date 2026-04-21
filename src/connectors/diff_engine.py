"""
Diff engine for detecting meaningful changes between page snapshots.

Produces a structured summary of what changed, not a raw unified diff.
"""

from __future__ import annotations

import difflib


class DiffResult:
    def __init__(
        self,
        added_lines: list[str],
        removed_lines: list[str],
        change_ratio: float,
        summary: str,
    ):
        self.added_lines = added_lines
        self.removed_lines = removed_lines
        self.change_ratio = change_ratio
        self.summary = summary

    @property
    def has_meaningful_change(self) -> bool:
        return self.change_ratio > 0.01 or len(self.added_lines) > 2 or len(self.removed_lines) > 2


class DiffEngine:
    @staticmethod
    def diff_text(old: str, new: str) -> DiffResult:
        old_lines = old.splitlines()
        new_lines = new.splitlines()

        matcher = difflib.SequenceMatcher(None, old_lines, new_lines)
        ratio = 1.0 - matcher.ratio()

        added: list[str] = []
        removed: list[str] = []

        for tag, i1, i2, j1, j2 in matcher.get_opcodes():
            if tag == "insert":
                added.extend(new_lines[j1:j2])
            elif tag == "delete":
                removed.extend(old_lines[i1:i2])
            elif tag == "replace":
                removed.extend(old_lines[i1:i2])
                added.extend(new_lines[j1:j2])

        # Build a human-readable summary
        parts: list[str] = []
        if added:
            parts.append(f"{len(added)} lines added")
        if removed:
            parts.append(f"{len(removed)} lines removed")
        parts.append(f"change ratio: {ratio:.1%}")
        summary = "; ".join(parts) if parts else "No changes"

        return DiffResult(
            added_lines=added,
            removed_lines=removed,
            change_ratio=ratio,
            summary=summary,
        )

    @staticmethod
    def extract_key_changes(diff: DiffResult, max_lines: int = 50) -> str:
        """Return a concise text summary of the most important changes."""
        sections: list[str] = []
        if diff.added_lines:
            preview = diff.added_lines[:max_lines]
            sections.append("=== ADDED ===\n" + "\n".join(preview))
            if len(diff.added_lines) > max_lines:
                sections.append(f"... and {len(diff.added_lines) - max_lines} more added lines")
        if diff.removed_lines:
            preview = diff.removed_lines[:max_lines]
            sections.append("=== REMOVED ===\n" + "\n".join(preview))
            if len(diff.removed_lines) > max_lines:
                sections.append(f"... and {len(diff.removed_lines) - max_lines} more removed lines")
        return "\n\n".join(sections) if sections else "No meaningful changes detected."
