"""Tests for content hashing and diff engine."""

from src.connectors import ContentHasher, DiffEngine


class TestContentHasher:
    def test_hash_deterministic(self):
        h1 = ContentHasher.hash_text("hello world")
        h2 = ContentHasher.hash_text("hello world")
        assert h1 == h2

    def test_hash_differs(self):
        h1 = ContentHasher.hash_text("hello world")
        h2 = ContentHasher.hash_text("hello world changed")
        assert h1 != h2

    def test_normalize_whitespace(self):
        h1 = ContentHasher.hash_text("hello   world")
        h2 = ContentHasher.hash_text("hello world")
        assert h1 == h2

    def test_normalize_case(self):
        h1 = ContentHasher.hash_text("Hello World")
        h2 = ContentHasher.hash_text("hello world")
        assert h1 == h2

    def test_has_changed_none(self):
        assert ContentHasher.has_changed(None, "abc") is True

    def test_has_changed_same(self):
        assert ContentHasher.has_changed("abc", "abc") is False

    def test_has_changed_different(self):
        assert ContentHasher.has_changed("abc", "def") is True


class TestDiffEngine:
    def test_no_change(self):
        result = DiffEngine.diff_text("hello\nworld", "hello\nworld")
        assert not result.has_meaningful_change
        assert result.change_ratio == 0.0

    def test_addition(self):
        result = DiffEngine.diff_text("line1\nline2", "line1\nline2\nline3\nline4\nline5")
        assert result.has_meaningful_change
        assert len(result.added_lines) == 3

    def test_removal(self):
        result = DiffEngine.diff_text("line1\nline2\nline3\nline4", "line1")
        assert result.has_meaningful_change
        assert len(result.removed_lines) == 3

    def test_replacement(self):
        result = DiffEngine.diff_text("old line", "new line")
        assert result.has_meaningful_change

    def test_extract_key_changes(self):
        result = DiffEngine.diff_text("old", "new content\nadded line")
        summary = DiffEngine.extract_key_changes(result)
        assert "ADDED" in summary or "REMOVED" in summary

    def test_summary_format(self):
        result = DiffEngine.diff_text("a\nb\nc", "a\nb\nc\nd\ne\nf")
        assert "added" in result.summary.lower()
