"""
Extraction Agent

Given raw page text and change diffs, uses the LLM to extract structured
competitive intelligence facts with source links and confidence scores.
"""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

from ..models import (
    ConfidenceAssessment,
    ConfidenceLevel,
    FeatureLaunch,
    SourceEvidence,
    SourceType,
    StrategicImportance,
)
from .base import BaseAgent

SYSTEM_PROMPT = """\
You are a structured data extraction agent for competitive intelligence.

Given the text content of a competitor's web page and context about what changed,
extract structured facts. Be precise and conservative — only extract facts that
are clearly stated or strongly implied by the text.

For each fact, assess confidence:
- "high": directly stated on the page
- "medium": strongly implied or from a reputable secondary source
- "low": weakly implied, single source
- "speculative": inference without strong evidence

Return a JSON object with these sections (include only sections where you found data):

{
  "company_facts": [
    {
      "field": "employee_count|revenue|hq_location|founding_year|...",
      "value": "...",
      "confidence": "high|medium|low|speculative",
      "is_estimated": true/false,
      "estimation_basis": "if estimated, explain basis",
      "source_snippet": "exact text from page supporting this"
    }
  ],
  "positioning": [
    {
      "field": "positioning_statement|value_proposition|differentiator|use_case|messaging_theme|market_segment|pricing_model",
      "value": "...",
      "confidence": "high|medium|low|speculative",
      "source_snippet": "exact text from page"
    }
  ],
  "feature_launches": [
    {
      "feature_name": "...",
      "summary": "...",
      "launch_date": "YYYY-MM-DD or null",
      "category": "...",
      "affected_persona": "...",
      "affected_use_case": "...",
      "strategic_importance": "low|medium|high|critical",
      "confidence": "high|medium|low",
      "source_snippet": "exact text"
    }
  ],
  "key_products": [
    {
      "name": "...",
      "description": "...",
      "confidence": "high|medium|low"
    }
  ],
  "target_customers": {
    "value": "...",
    "confidence": "high|medium|low",
    "source_snippet": "..."
  },
  "geography_focus": {
    "value": "...",
    "confidence": "high|medium|low"
  }
}

If a section has no data, omit it. Return ONLY the JSON object.
"""


class ExtractionAgent(BaseAgent):
    agent_name = "extraction"

    def extract_from_page(
        self,
        competitor_name: str,
        url: str,
        page_text: str,
        page_title: str = "",
        diff_context: str | None = None,
    ) -> dict[str, Any]:
        """Extract structured facts from a page's text content."""
        context_parts = [
            f"Competitor: {competitor_name}",
            f"URL: {url}",
            f"Page title: {page_title}" if page_title else "",
        ]
        if diff_context:
            context_parts.append(f"\n--- Changes detected ---\n{diff_context}")

        # Truncate very long pages to fit context
        max_text = 12000
        if len(page_text) > max_text:
            page_text = page_text[:max_text] + "\n\n[... truncated ...]"

        prompt = "\n".join(context_parts) + f"\n\n--- Page content ---\n{page_text}"

        try:
            result = self.call_llm_json(SYSTEM_PROMPT, prompt, max_tokens=4096)
            self.logger.info(
                f"Extracted data from {url} for {competitor_name}: "
                f"{sum(len(v) if isinstance(v, list) else 1 for v in result.values())} facts"
            )
            return result
        except Exception as e:
            self.logger.error(f"Extraction failed for {url}: {e}")
            return {}

    def to_confidence_assessment(
        self, fact: dict, url: str, page_title: str
    ) -> ConfidenceAssessment:
        """Convert a raw extracted fact to a ConfidenceAssessment with source."""
        source = SourceEvidence(
            url=url,
            title=page_title or url,
            source_type=self._infer_source_type(url),
            snippet=fact.get("source_snippet"),
            confidence=ConfidenceLevel(fact.get("confidence", "medium")),
        )
        return ConfidenceAssessment(
            value=fact.get("value", fact.get("name", "")),
            confidence=ConfidenceLevel(fact.get("confidence", "medium")),
            sources=[source],
            is_estimated=fact.get("is_estimated", False),
            estimation_basis=fact.get("estimation_basis"),
            last_verified=datetime.now(timezone.utc),
        )

    def to_feature_launch(
        self, raw: dict, url: str, page_title: str
    ) -> FeatureLaunch:
        """Convert a raw feature launch extraction to a FeatureLaunch model."""
        source = SourceEvidence(
            url=url,
            title=page_title or url,
            source_type=self._infer_source_type(url),
            snippet=raw.get("source_snippet"),
            confidence=ConfidenceLevel(raw.get("confidence", "medium")),
        )
        launch_date = None
        if raw.get("launch_date"):
            try:
                launch_date = datetime.fromisoformat(raw["launch_date"])
            except (ValueError, TypeError):
                pass

        return FeatureLaunch(
            feature_name=raw["feature_name"],
            summary=raw.get("summary", ""),
            launch_date=launch_date,
            announcement_date=datetime.now(timezone.utc),
            source_url=url,
            category=raw.get("category"),
            affected_persona=raw.get("affected_persona"),
            affected_use_case=raw.get("affected_use_case"),
            strategic_importance=StrategicImportance(
                raw.get("strategic_importance", "medium")
            ),
            confidence=ConfidenceLevel(raw.get("confidence", "medium")),
            sources=[source],
        )

    @staticmethod
    def _infer_source_type(url: str) -> SourceType:
        url_lower = url.lower()
        if "/pricing" in url_lower:
            return SourceType.PRICING_PAGE
        if "/blog" in url_lower or "/news" in url_lower:
            return SourceType.BLOG_POST
        if "/docs" in url_lower or "/developer" in url_lower:
            return SourceType.DOCS
        if "/changelog" in url_lower or "/release" in url_lower:
            return SourceType.CHANGELOG
        if "/careers" in url_lower or "/jobs" in url_lower:
            return SourceType.CAREERS_PAGE
        if "/investor" in url_lower or "/ir" in url_lower:
            return SourceType.INVESTOR_RELATIONS
        if "/product" in url_lower:
            return SourceType.PRODUCT_PAGE
        return SourceType.OFFICIAL_WEBSITE
