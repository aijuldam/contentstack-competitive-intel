"""
Source Discovery Agent

Discovers additional URLs worth monitoring for a given competitor.
Uses the LLM to suggest relevant pages based on the competitor's
website and known URLs.
"""

from __future__ import annotations

from ..models import Competitor, SourceEvidence, SourceType, ConfidenceLevel
from .base import BaseAgent


SYSTEM_PROMPT = """\
You are a competitive intelligence analyst. Given a competitor's name, website,
and any known tracked URLs, suggest additional URLs that would be valuable to
monitor for competitive intelligence purposes.

Focus on pages that reveal:
- Product updates and feature launches
- Pricing changes
- Positioning and messaging changes
- Company growth signals (hiring, funding, partnerships)
- Strategic direction

Return a JSON array of objects, each with:
- "url": the full URL
- "source_type": one of (official_website, pricing_page, product_page, blog_post,
  press_release, docs, changelog, careers_page, investor_relations, social_media,
  review_site)
- "reason": why this page is worth monitoring
- "priority": "high", "medium", or "low"

Only suggest URLs that are very likely to exist. Do not guess or hallucinate URLs.
Return only the JSON array, no other text.
"""


class SourceDiscoveryAgent(BaseAgent):
    agent_name = "source_discovery"

    def discover_sources(self, competitor: Competitor) -> list[dict]:
        """Discover additional URLs to monitor for a competitor."""
        known_urls = []
        urls = competitor.tracked_urls
        for field in ["homepage", "pricing", "product", "docs", "blog",
                       "investor_relations", "careers", "changelog"]:
            val = getattr(urls, field, None)
            if val:
                known_urls.append(f"{field}: {val}")
        for url in urls.social_profiles:
            known_urls.append(f"social: {url}")

        prompt = f"""Competitor: {competitor.name}
Website: {competitor.website}

Currently tracked URLs:
{chr(10).join(known_urls) if known_urls else "None yet"}

Suggest additional pages to monitor. Be practical — only suggest URLs
that are very likely to exist based on the website domain."""

        try:
            suggestions = self.call_llm_json(SYSTEM_PROMPT, prompt)
            self.logger.info(
                f"Discovered {len(suggestions)} source suggestions for {competitor.name}"
            )
            return suggestions
        except Exception as e:
            self.logger.error(f"Source discovery failed for {competitor.name}: {e}")
            return []

    def build_source_evidence(self, url: str, title: str,
                               source_type_str: str) -> SourceEvidence:
        """Create a SourceEvidence from a discovered URL."""
        try:
            st = SourceType(source_type_str)
        except ValueError:
            st = SourceType.OFFICIAL_WEBSITE
        return SourceEvidence(
            url=url,
            title=title,
            source_type=st,
            confidence=ConfidenceLevel.MEDIUM,
        )
