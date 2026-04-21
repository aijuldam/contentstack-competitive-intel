"""Tests for the SQLite storage layer."""

import tempfile
from datetime import datetime, timezone
from pathlib import Path

import pytest

from src.models import (
    BattleCard,
    ChangeLogEntry,
    CompanyProfile,
    Competitor,
    ConfidenceLevel,
    MonitoringEvent,
    Positioning,
    ReviewQueueItem,
    SourceEvidence,
    SourceType,
)
from src.models.schema import ChangeType, TrackedUrls
from src.storage import Database


@pytest.fixture
def db(tmp_path):
    database = Database(tmp_path / "test.db")
    yield database
    database.close()


@pytest.fixture
def sample_competitor():
    return Competitor(
        name="TestCorp",
        slug="testcorp",
        website="https://testcorp.com",
        tracked_urls=TrackedUrls(homepage="https://testcorp.com"),
        is_priority=True,
    )


@pytest.fixture
def sample_card(sample_competitor):
    return BattleCard(
        competitor_id=sample_competitor.id,
        company_profile=CompanyProfile(
            name="TestCorp",
            website="https://testcorp.com",
        ),
        positioning=Positioning(),
    )


class TestCompetitorCRUD:
    def test_upsert_and_get(self, db, sample_competitor):
        db.upsert_competitor(sample_competitor)
        fetched = db.get_competitor(sample_competitor.id)
        assert fetched is not None
        assert fetched.name == "TestCorp"
        assert fetched.is_priority is True

    def test_get_by_slug(self, db, sample_competitor):
        db.upsert_competitor(sample_competitor)
        fetched = db.get_competitor_by_slug("testcorp")
        assert fetched is not None
        assert fetched.name == "TestCorp"

    def test_list_competitors(self, db):
        for i in range(3):
            c = Competitor(name=f"Company{i}", slug=f"company{i}", website=f"https://c{i}.com")
            db.upsert_competitor(c)
        result = db.list_competitors()
        assert len(result) == 3

    def test_update_competitor(self, db, sample_competitor):
        db.upsert_competitor(sample_competitor)
        sample_competitor.is_priority = False
        db.upsert_competitor(sample_competitor)
        fetched = db.get_competitor(sample_competitor.id)
        assert fetched.is_priority is False

    def test_get_nonexistent(self, db):
        assert db.get_competitor("nonexistent") is None


class TestBattleCardCRUD:
    def test_upsert_and_get(self, db, sample_competitor, sample_card):
        db.upsert_competitor(sample_competitor)
        db.upsert_battle_card(sample_card)
        fetched = db.get_battle_card(sample_competitor.id)
        assert fetched is not None
        assert fetched.company_profile.name == "TestCorp"

    def test_version_update(self, db, sample_competitor, sample_card):
        db.upsert_competitor(sample_competitor)
        db.upsert_battle_card(sample_card)
        sample_card.version = 2
        db.upsert_battle_card(sample_card)
        fetched = db.get_battle_card(sample_competitor.id)
        assert fetched.version == 2


class TestMonitoringEvents:
    def test_add_and_get_hash(self, db, sample_competitor):
        db.upsert_competitor(sample_competitor)
        event = MonitoringEvent(
            competitor_id=sample_competitor.id,
            url="https://testcorp.com",
            content_hash="abc123",
            has_changed=True,
        )
        db.add_monitoring_event(event)
        latest = db.get_latest_hash(sample_competitor.id, "https://testcorp.com")
        assert latest == "abc123"

    def test_no_previous_hash(self, db):
        assert db.get_latest_hash("none", "https://x.com") is None


class TestSnapshots:
    def test_save_and_get(self, db, sample_competitor):
        db.upsert_competitor(sample_competitor)
        db.save_snapshot(sample_competitor.id, "https://testcorp.com", "hash1", "content here")
        content = db.get_previous_snapshot(sample_competitor.id, "https://testcorp.com")
        assert content == "content here"


class TestChangelog:
    def test_add_and_get(self, db, sample_competitor):
        db.upsert_competitor(sample_competitor)
        entry = ChangeLogEntry(
            competitor_id=sample_competitor.id,
            change_type=ChangeType.UPDATED,
            section="company_profile",
            field="employee_count",
            old_value="5000",
            new_value="5500",
            confidence=ConfidenceLevel.HIGH,
        )
        db.add_changelog_entry(entry)
        entries = db.get_changelog(sample_competitor.id)
        assert len(entries) == 1
        assert entries[0].new_value == "5500"

    def test_get_since(self, db, sample_competitor):
        db.upsert_competitor(sample_competitor)
        entry = ChangeLogEntry(
            competitor_id=sample_competitor.id,
            change_type=ChangeType.ADDED,
            section="positioning",
            field="value_proposition",
            new_value="Best API",
            confidence=ConfidenceLevel.MEDIUM,
        )
        db.add_changelog_entry(entry)
        # Future date — should return nothing
        future = datetime(2099, 1, 1, tzinfo=timezone.utc)
        entries = db.get_changelog(sample_competitor.id, since=future)
        assert len(entries) == 0


class TestReviewQueue:
    def test_add_and_get_pending(self, db, sample_competitor):
        db.upsert_competitor(sample_competitor)
        item = ReviewQueueItem(
            competitor_id=sample_competitor.id,
            competitor_name="TestCorp",
            section="company_profile",
            field="revenue",
            proposed_value="$100M",
            confidence=ConfidenceLevel.LOW,
            reason="Low confidence estimate",
        )
        db.add_review_item(item)
        pending = db.get_pending_reviews()
        assert len(pending) == 1
        assert pending[0].proposed_value == "$100M"

    def test_update_review_status(self, db, sample_competitor):
        db.upsert_competitor(sample_competitor)
        item = ReviewQueueItem(
            competitor_id=sample_competitor.id,
            competitor_name="TestCorp",
            section="company_profile",
            field="revenue",
            proposed_value="$100M",
            confidence=ConfidenceLevel.LOW,
            reason="Test",
        )
        db.add_review_item(item)
        db.update_review_status(item.id, "approved", "Looks correct")
        pending = db.get_pending_reviews()
        assert len(pending) == 0
