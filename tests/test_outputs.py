"""Tests for output writers."""

import json
from datetime import datetime, timezone

import pytest

from src.models import (
    BattleCard,
    CompanyProfile,
    ConfidenceAssessment,
    ConfidenceLevel,
    FeatureLaunch,
    Positioning,
    SourceEvidence,
    SourceType,
)
from src.models.schema import BattleCardAnalysis, RiskLevel, StrategicImportance
from src.outputs.markdown_output import MarkdownOutputWriter


@pytest.fixture
def sample_card():
    return BattleCard(
        competitor_id="test-123",
        company_profile=CompanyProfile(
            name="TestCorp",
            website="https://testcorp.com",
            hq_location=ConfidenceAssessment(
                value="San Francisco, CA",
                confidence=ConfidenceLevel.HIGH,
            ),
            employee_count=ConfidenceAssessment(
                value="~500",
                confidence=ConfidenceLevel.MEDIUM,
                is_estimated=True,
                estimation_basis="LinkedIn data",
            ),
        ),
        positioning=Positioning(
            primary_category=ConfidenceAssessment(
                value="CPaaS",
                confidence=ConfidenceLevel.HIGH,
            ),
            core_value_proposition=ConfidenceAssessment(
                value="Simple APIs for complex communications",
                confidence=ConfidenceLevel.HIGH,
            ),
        ),
        feature_launches=[
            FeatureLaunch(
                feature_name="AI Chatbot Builder",
                summary="No-code chatbot creation tool",
                source_url="https://testcorp.com/blog/ai-chatbot",
                strategic_importance=StrategicImportance.HIGH,
            ),
        ],
        analysis=BattleCardAnalysis(
            territory_risk=RiskLevel.MEDIUM,
            where_we_win=["API design", "Global coverage"],
            where_we_lose=["Brand recognition"],
        ),
        all_sources=[
            SourceEvidence(
                url="https://testcorp.com",
                title="TestCorp Homepage",
                source_type=SourceType.OFFICIAL_WEBSITE,
            ),
        ],
    )


class TestMarkdownOutput:
    def test_render_contains_name(self, sample_card):
        writer = MarkdownOutputWriter()
        md = writer.render(sample_card)
        assert "TestCorp" in md

    def test_render_contains_sections(self, sample_card):
        writer = MarkdownOutputWriter()
        md = writer.render(sample_card)
        assert "## Company Overview" in md
        assert "## Category & Positioning" in md
        assert "## Battle Card" in md
        assert "## Sources" in md

    def test_render_shows_confidence(self, sample_card):
        writer = MarkdownOutputWriter()
        md = writer.render(sample_card)
        assert "estimated" in md.lower()

    def test_render_shows_launches(self, sample_card):
        writer = MarkdownOutputWriter()
        md = writer.render(sample_card)
        assert "AI Chatbot Builder" in md

    def test_write_to_file(self, sample_card, tmp_path):
        writer = MarkdownOutputWriter(output_dir=str(tmp_path))
        path = writer.write("testcorp", sample_card)
        assert path.exists()
        content = path.read_text()
        assert "TestCorp" in content
