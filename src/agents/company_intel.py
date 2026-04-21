"""
Company Intelligence Agent

Builds and enriches the CompanyProfile portion of a battle card.
Uses extraction results + LLM to fill in gaps such as founding year,
HQ, employee count, revenue estimates, etc.

Applies the confidence hierarchy:
- Authoritative sources (earnings, SEC, official) > secondary > inferred
- Never overwrites a high-confidence value with a lower one
"""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Optional

from ..models import (
    ChangeLogEntry,
    ChangeType,
    CompanyProfile,
    ConfidenceAssessment,
    ConfidenceLevel,
    ReviewQueueItem,
    SourceEvidence,
    SourceType,
)
from .base import BaseAgent

CONFIDENCE_RANK = {
    ConfidenceLevel.HIGH: 3,
    ConfidenceLevel.MEDIUM: 2,
    ConfidenceLevel.LOW: 1,
    ConfidenceLevel.SPECULATIVE: 0,
}

SYSTEM_PROMPT = """\
You are a company research analyst. Given partial information about a company,
fill in missing fields if you have high confidence in the answer.

For each field you fill in, indicate:
- confidence: high, medium, low, or speculative
- is_estimated: true/false
- estimation_basis: explain how you arrived at the value if estimated
- source_note: what kind of source would confirm this

Fields to fill:
- hq_location
- founding_year
- employee_count (approximate is fine, mark as estimated)
- estimated_revenue (mark as estimated with basis)
- public_private (public or private)
- funding_stage (if private: seed, series_a, series_b, etc.)
- ticker_symbol (if public)
- description (1-2 sentence company description)
- target_customers
- geography_focus

Return a JSON object with only the fields you can fill. Omit fields where you
have no reasonable basis. Return ONLY the JSON object.

Example:
{
  "hq_location": {"value": "San Francisco, CA", "confidence": "high", "is_estimated": false},
  "founding_year": {"value": "2008", "confidence": "high", "is_estimated": false},
  "employee_count": {"value": "~8000", "confidence": "medium", "is_estimated": true, "estimation_basis": "Based on LinkedIn data and recent layoff reports"},
  "public_private": {"value": "public", "confidence": "high", "is_estimated": false},
  "ticker_symbol": {"value": "TWLO", "confidence": "high", "is_estimated": false}
}
"""


class CompanyIntelAgent(BaseAgent):
    agent_name = "company_intel"

    def enrich_profile(
        self,
        competitor_name: str,
        website: str,
        existing_profile: Optional[CompanyProfile],
        extracted_data: dict[str, Any],
    ) -> tuple[CompanyProfile, list[ChangeLogEntry], list[ReviewQueueItem]]:
        """
        Enrich or create a company profile.

        Returns:
          - Updated CompanyProfile
          - List of changelog entries for changes made
          - List of review queue items for low-confidence updates
        """
        changes: list[ChangeLogEntry] = []
        reviews: list[ReviewQueueItem] = []

        profile = existing_profile or CompanyProfile(name=competitor_name, website=website)

        # Apply extracted company facts first
        extracted_facts = extracted_data.get("company_facts", [])
        for fact in extracted_facts:
            field = fact.get("field", "")
            self._apply_fact(profile, field, fact, competitor_name, changes, reviews)

        # Use LLM to fill gaps
        gaps = self._identify_gaps(profile)
        if gaps:
            llm_data = self._fill_gaps_with_llm(competitor_name, website, profile, gaps)
            for field, val in llm_data.items():
                fact = {
                    "field": field,
                    "value": val.get("value", ""),
                    "confidence": val.get("confidence", "medium"),
                    "is_estimated": val.get("is_estimated", False),
                    "estimation_basis": val.get("estimation_basis"),
                }
                self._apply_fact(profile, field, fact, competitor_name, changes, reviews)

        # Apply target_customers and geography from extraction
        if "target_customers" in extracted_data and not profile.target_customers:
            tc = extracted_data["target_customers"]
            profile.target_customers = ConfidenceAssessment(
                value=tc["value"],
                confidence=ConfidenceLevel(tc.get("confidence", "medium")),
            )

        if "geography_focus" in extracted_data and not profile.geography_focus:
            gf = extracted_data["geography_focus"]
            profile.geography_focus = ConfidenceAssessment(
                value=gf["value"],
                confidence=ConfidenceLevel(gf.get("confidence", "medium")),
            )

        # Apply key products
        if "key_products" in extracted_data and not profile.key_products:
            for prod in extracted_data["key_products"]:
                profile.key_products.append(ConfidenceAssessment(
                    value=f"{prod['name']}: {prod.get('description', '')}",
                    confidence=ConfidenceLevel(prod.get("confidence", "medium")),
                ))

        return profile, changes, reviews

    def _apply_fact(
        self,
        profile: CompanyProfile,
        field: str,
        fact: dict,
        competitor_name: str,
        changes: list[ChangeLogEntry],
        reviews: list[ReviewQueueItem],
    ) -> None:
        """Apply a single fact to the profile, respecting confidence hierarchy."""
        field_map = {
            "hq_location": "hq_location",
            "founding_year": "founding_year",
            "employee_count": "employee_count",
            "revenue": "estimated_revenue",
            "estimated_revenue": "estimated_revenue",
            "public_private": "public_private",
            "funding_stage": "funding_stage",
            "description": "description",
        }

        attr = field_map.get(field)
        if not attr:
            return

        new_confidence = ConfidenceLevel(fact.get("confidence", "medium"))
        new_value = fact.get("value", "")
        if not new_value:
            return

        existing: Optional[ConfidenceAssessment] = getattr(profile, attr, None)

        # Never overwrite higher confidence with lower
        if existing and CONFIDENCE_RANK[existing.confidence] > CONFIDENCE_RANK[new_confidence]:
            self.logger.debug(
                f"Skipping {field} update: existing confidence "
                f"{existing.confidence.value} > new {new_confidence.value}"
            )
            return

        # Flag low-confidence updates for review
        if new_confidence in (ConfidenceLevel.LOW, ConfidenceLevel.SPECULATIVE):
            reviews.append(ReviewQueueItem(
                competitor_id="",  # filled by caller
                competitor_name=competitor_name,
                section="company_profile",
                field=field,
                proposed_value=new_value,
                current_value=existing.value if existing else None,
                confidence=new_confidence,
                reason=f"Low confidence ({new_confidence.value}) update for {field}",
            ))
            return

        # Record change
        old_value = existing.value if existing else None
        if old_value != new_value:
            changes.append(ChangeLogEntry(
                competitor_id="",  # filled by caller
                change_type=ChangeType.UPDATED if old_value else ChangeType.ADDED,
                section="company_profile",
                field=field,
                old_value=old_value,
                new_value=new_value,
                confidence=new_confidence,
            ))

        # Apply
        new_assessment = ConfidenceAssessment(
            value=new_value,
            confidence=new_confidence,
            is_estimated=fact.get("is_estimated", False),
            estimation_basis=fact.get("estimation_basis"),
            last_verified=datetime.now(timezone.utc),
        )
        setattr(profile, attr, new_assessment)

    def _identify_gaps(self, profile: CompanyProfile) -> list[str]:
        gaps = []
        for field in ["hq_location", "founding_year", "employee_count",
                       "estimated_revenue", "public_private", "description"]:
            if getattr(profile, field) is None:
                gaps.append(field)
        return gaps

    def _fill_gaps_with_llm(
        self,
        name: str,
        website: str,
        profile: CompanyProfile,
        gaps: list[str],
    ) -> dict:
        known = {}
        for field in ["hq_location", "founding_year", "employee_count",
                       "estimated_revenue", "public_private", "funding_stage",
                       "description"]:
            val = getattr(profile, field)
            if val:
                known[field] = val.value

        prompt = f"""Company: {name}
Website: {website}

Known information:
{known if known else "None yet"}

Fields still missing: {gaps}

Fill in what you can with reasonable confidence. Be conservative."""

        try:
            return self.call_llm_json(SYSTEM_PROMPT, prompt)
        except Exception as e:
            self.logger.error(f"LLM gap-fill failed for {name}: {e}")
            return {}
