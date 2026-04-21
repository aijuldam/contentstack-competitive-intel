"""Tests for data models and schema validation."""

import json
from datetime import datetime, timezone

import pytest

from src.models import (
    BattleCard,
    ChangeLogEntry,
    CompanyProfile,
    Competitor,
    ConfidenceAssessment,
    ConfidenceLevel,
    FeatureLaunch,
    FieldFreshness,
    MonitoringEvent,
    Positioning,
    ReviewQueueItem,
    SourceEvidence,
    SourceType,
    WeeklyDigest,
)
from src.models.schema import (
    BattleCardAnalysis,
    ChangeType,
    RiskLevel,
    StrategicImportance,
    TrackedUrls,
)


class TestSourceEvidence:
    def test_create_source(self):
        s = SourceEvidence(
            url="https://example.com",
            title="Example Page",
            source_type=SourceType.OFFICIAL_WEBSITE,
        )
        assert s.url == "https://example.com"
        assert s.confidence == ConfidenceLevel.MEDIUM
        assert s.id is not None

    def test_authoritative_sources(self):
        for st in [SourceType.EARNINGS_REPORT, SourceType.SEC_FILING,
                    SourceType.INVESTOR_RELATIONS, SourceType.OFFICIAL_WEBSITE]:
            s = SourceEvidence(url="https://x.com", title="t", source_type=st)
            assert s.is_authoritative()

        s = SourceEvidence(url="https://x.com", title="t", source_type=SourceType.BLOG_POST)
        assert not s.is_authoritative()

    def test_serialization_roundtrip(self):
        s = SourceEvidence(
            url="https://example.com",
            title="Test",
            source_type=SourceType.NEWS_ARTICLE,
            confidence=ConfidenceLevel.HIGH,
            snippet="some text",
        )
        data = json.loads(s.model_dump_json())
        s2 = SourceEvidence.model_validate(data)
        assert s2.url == s.url
        assert s2.confidence == s.confidence
        assert s2.snippet == s.snippet


class TestConfidenceAssessment:
    def test_basic_assessment(self):
        ca = ConfidenceAssessment(
            value="~5000",
            confidence=ConfidenceLevel.MEDIUM,
            is_estimated=True,
            estimation_basis="LinkedIn data",
        )
        assert ca.value == "~5000"
        assert ca.is_estimated is True

    def test_with_sources(self):
        source = SourceEvidence(
            url="https://x.com", title="t",
            source_type=SourceType.OFFICIAL_WEBSITE,
        )
        ca = ConfidenceAssessment(
            value="San Francisco",
            confidence=ConfidenceLevel.HIGH,
            sources=[source],
        )
        assert len(ca.sources) == 1


class TestFieldFreshness:
    def test_not_stale(self):
        f = FieldFreshness(
            field_name="company_profile",
            last_updated=datetime.now(timezone.utc),
            last_confirmed=datetime.now(timezone.utc),
            staleness_threshold_days=30,
        )
        assert f.check_staleness() is False
        assert f.is_stale is False

    def test_stale(self):
        old = datetime(2020, 1, 1, tzinfo=timezone.utc)
        f = FieldFreshness(
            field_name="company_profile",
            last_updated=old,
            last_confirmed=old,
            staleness_threshold_days=30,
        )
        assert f.check_staleness() is True
        assert f.is_stale is True


class TestCompetitor:
    def test_create_competitor(self):
        c = Competitor(
            name="Twilio",
            slug="twilio",
            website="https://www.twilio.com",
            is_priority=True,
        )
        assert c.name == "Twilio"
        assert c.slug == "twilio"
        assert c.is_priority is True
        assert c.monitoring_enabled is True

    def test_with_tracked_urls(self):
        c = Competitor(
            name="Test",
            slug="test",
            website="https://test.com",
            tracked_urls=TrackedUrls(
                homepage="https://test.com",
                pricing="https://test.com/pricing",
            ),
        )
        assert c.tracked_urls.homepage == "https://test.com"
        assert c.tracked_urls.pricing == "https://test.com/pricing"
        assert c.tracked_urls.docs is None


class TestBattleCard:
    def test_create_card(self):
        card = BattleCard(
            competitor_id="test-id",
            company_profile=CompanyProfile(
                name="Test Co",
                website="https://test.com",
            ),
            positioning=Positioning(),
        )
        assert card.version == 1
        assert card.competitor_id == "test-id"
        assert card.company_profile.name == "Test Co"

    def test_full_card_serialization(self):
        card = BattleCard(
            competitor_id="test-id",
            company_profile=CompanyProfile(
                name="Test Co",
                website="https://test.com",
                hq_location=ConfidenceAssessment(
                    value="NYC", confidence=ConfidenceLevel.HIGH
                ),
            ),
            positioning=Positioning(
                primary_category=ConfidenceAssessment(
                    value="CPaaS", confidence=ConfidenceLevel.HIGH
                ),
            ),
            feature_launches=[
                FeatureLaunch(
                    feature_name="AI Assistant",
                    summary="New AI-powered assistant",
                    source_url="https://test.com/blog",
                    strategic_importance=StrategicImportance.HIGH,
                )
            ],
            analysis=BattleCardAnalysis(
                territory_risk=RiskLevel.MEDIUM,
                where_we_win=["API simplicity"],
            ),
        )
        data = json.loads(card.model_dump_json())
        card2 = BattleCard.model_validate(data)
        assert card2.company_profile.name == "Test Co"
        assert card2.company_profile.hq_location.value == "NYC"
        assert len(card2.feature_launches) == 1
        assert card2.analysis.where_we_win == ["API simplicity"]


class TestChangeLogEntry:
    def test_create_entry(self):
        entry = ChangeLogEntry(
            competitor_id="test",
            change_type=ChangeType.UPDATED,
            section="company_profile",
            field="employee_count",
            old_value="5000",
            new_value="5500",
            confidence=ConfidenceLevel.MEDIUM,
        )
        assert entry.change_type == ChangeType.UPDATED
        assert entry.auto_applied is True


class TestMonitoringEvent:
    def test_create_event(self):
        event = MonitoringEvent(
            competitor_id="test",
            url="https://example.com",
            content_hash="abc123",
            has_changed=True,
        )
        assert event.has_changed is True
        assert event.previous_hash is None


class TestReviewQueueItem:
    def test_create_review(self):
        item = ReviewQueueItem(
            competitor_id="test",
            competitor_name="Test Co",
            section="company_profile",
            field="revenue",
            proposed_value="$500M",
            confidence=ConfidenceLevel.LOW,
            reason="Low confidence estimate",
        )
        assert item.status.value == "pending"
