"""
QA / Fact-Checking Agent

Reviews a battle card for:
- Unsupported claims (facts without sources)
- Stale fields past threshold
- Conflicting information
- Low-confidence items that should be flagged for review
- Missing required sections
"""

from __future__ import annotations

from datetime import datetime, timezone

from ..models import (
    BattleCard,
    ConfidenceLevel,
    ReviewQueueItem,
)
from .base import BaseAgent


class QAIssue:
    def __init__(self, severity: str, section: str, field: str, message: str):
        self.severity = severity  # error, warning, info
        self.section = section
        self.field = field
        self.message = message

    def __repr__(self) -> str:
        return f"[{self.severity.upper()}] {self.section}.{self.field}: {self.message}"


class QAAgent(BaseAgent):
    agent_name = "qa"

    def review_card(self, card: BattleCard) -> tuple[list[QAIssue], list[ReviewQueueItem]]:
        """
        Review a battle card for quality issues.
        Returns issues found and items to add to the review queue.
        """
        issues: list[QAIssue] = []
        reviews: list[ReviewQueueItem] = []

        self._check_required_fields(card, issues)
        self._check_source_coverage(card, issues)
        self._check_staleness(card, issues)
        self._check_confidence_levels(card, issues, reviews)
        self._check_consistency(card, issues)

        self.logger.info(
            f"QA review for {card.company_profile.name}: "
            f"{len(issues)} issues, {len(reviews)} review items"
        )
        return issues, reviews

    def _check_required_fields(self, card: BattleCard, issues: list[QAIssue]) -> None:
        """Check that essential fields are populated."""
        profile = card.company_profile

        required = {
            "description": profile.description,
            "hq_location": profile.hq_location,
            "employee_count": profile.employee_count,
            "public_private": profile.public_private,
        }
        for field, val in required.items():
            if val is None:
                issues.append(QAIssue(
                    "warning", "company_profile", field,
                    f"Required field '{field}' is missing"
                ))

        if not card.positioning.positioning_statement:
            issues.append(QAIssue(
                "warning", "positioning", "positioning_statement",
                "No positioning statement captured"
            ))

        if not card.analysis.where_we_win:
            issues.append(QAIssue(
                "info", "analysis", "where_we_win",
                "No 'where we win' items defined"
            ))

    def _check_source_coverage(self, card: BattleCard, issues: list[QAIssue]) -> None:
        """Check that important claims have at least one source."""
        # Check profile fields with ConfidenceAssessment
        for field_name in ["description", "employee_count", "estimated_revenue",
                           "hq_location", "founding_year"]:
            val = getattr(card.company_profile, field_name, None)
            if val and not val.sources:
                issues.append(QAIssue(
                    "warning", "company_profile", field_name,
                    f"No source evidence attached to '{field_name}'"
                ))

        # Check that feature launches have sources
        for launch in card.feature_launches:
            if not launch.sources:
                issues.append(QAIssue(
                    "warning", "feature_launches", launch.feature_name,
                    f"Feature launch '{launch.feature_name}' has no source evidence"
                ))

    def _check_staleness(self, card: BattleCard, issues: list[QAIssue]) -> None:
        """Flag fields that haven't been confirmed recently."""
        for freshness in card.field_freshness:
            if freshness.check_staleness():
                days_stale = (datetime.now(timezone.utc) - freshness.last_confirmed).days
                issues.append(QAIssue(
                    "warning", freshness.field_name, "freshness",
                    f"Section '{freshness.field_name}' is stale "
                    f"({days_stale} days since last confirmation, "
                    f"threshold: {freshness.staleness_threshold_days} days)"
                ))

    def _check_confidence_levels(
        self,
        card: BattleCard,
        issues: list[QAIssue],
        reviews: list[ReviewQueueItem],
    ) -> None:
        """Flag low-confidence and speculative items for human review."""
        low_conf_fields = []

        for field_name in ["description", "employee_count", "estimated_revenue",
                           "hq_location", "founding_year", "public_private"]:
            val = getattr(card.company_profile, field_name, None)
            if val and val.confidence in (ConfidenceLevel.LOW, ConfidenceLevel.SPECULATIVE):
                low_conf_fields.append(("company_profile", field_name, val))

        for field_name, val in low_conf_fields:
            issues.append(QAIssue(
                "info", field_name, val.value,
                f"Low confidence ({val.confidence.value}) — needs verification"
            ))
            reviews.append(ReviewQueueItem(
                competitor_id=card.competitor_id,
                competitor_name=card.company_profile.name,
                section="company_profile",
                field=field_name,
                proposed_value=val.value,
                confidence=val.confidence,
                reason=f"Automatically flagged: {val.confidence.value} confidence",
            ))

    def _check_consistency(self, card: BattleCard, issues: list[QAIssue]) -> None:
        """Check for internal consistency issues."""
        profile = card.company_profile

        # If public, should have ticker
        if profile.public_private and "public" in profile.public_private.value.lower():
            if not profile.ticker_symbol:
                issues.append(QAIssue(
                    "info", "company_profile", "ticker_symbol",
                    "Company marked as public but no ticker symbol recorded"
                ))

        # If private, funding stage is useful
        if profile.public_private and "private" in profile.public_private.value.lower():
            if not profile.funding_stage:
                issues.append(QAIssue(
                    "info", "company_profile", "funding_stage",
                    "Company marked as private but no funding stage recorded"
                ))
