"""
Positioning Analysis Agent

Analyzes extracted data to produce strategic assessments:
- How the competitor is evolving
- Segment prioritization signals
- Upmarket/downmarket movement
- Messaging changes over time
- Strategic importance of launches
"""

from __future__ import annotations

from typing import Any

from ..models import BattleCard, ConfidenceLevel
from ..utils.config import OurCompanyConfig
from .base import BaseAgent

SYSTEM_PROMPT = """\
You are a senior product marketing strategist specializing in competitive analysis.

Given extracted competitive intelligence data about a competitor and context about
our own company, produce a strategic analysis. Separate your analysis into three
tiers:

1. **Verified facts**: Directly supported by sources
2. **Likely inferences**: Strongly implied by multiple data points
3. **Speculative hypotheses**: Educated guesses based on patterns

Your analysis should cover:
- How the competitor is evolving (direction of product/market)
- Which customer segment they are prioritizing
- Whether they are moving upmarket or downmarket
- How their messaging is changing (if historical data available)
- Which recent launches matter most strategically
- Risk level: how close they are to our core territory

Return a JSON object:
{
  "evolution_direction": "...",
  "segment_prioritization": "...",
  "market_movement": "upmarket|downmarket|lateral|stable",
  "messaging_trend": "...",
  "strategic_launches": [
    {"feature": "...", "why_it_matters": "...", "importance": "low|medium|high|critical"}
  ],
  "territory_risk": "low|medium|high|critical",
  "territory_risk_explanation": "...",
  "where_we_win": ["..."],
  "where_we_lose": ["..."],
  "likely_strengths": [{"value": "...", "confidence": "high|medium|low"}],
  "likely_weaknesses": [{"value": "...", "confidence": "high|medium|low"}],
  "why_customers_buy": [{"value": "...", "confidence": "high|medium|low"}],
  "objection_handling": [{"objection": "...", "response": "..."}],
  "competitive_angles": ["..."],
  "verified_facts": ["..."],
  "likely_inferences": ["..."],
  "speculative_hypotheses": ["..."]
}

Return ONLY the JSON object.
"""


class PositioningAnalysisAgent(BaseAgent):
    agent_name = "positioning_analysis"

    def analyze(
        self,
        competitor_name: str,
        extracted_data: dict[str, Any],
        existing_card: BattleCard | None = None,
    ) -> dict[str, Any]:
        """Produce strategic positioning analysis from extracted data."""
        our = self.config.our_company

        prompt_parts = [
            f"## Our company: {our.name}",
            f"Category: {our.category}",
            f"ICP: {our.icp}",
            f"Our strengths: {', '.join(our.strengths)}",
            f"Our weaknesses: {', '.join(our.weaknesses)}",
            "",
            f"## Competitor: {competitor_name}",
            "",
            "## Extracted intelligence:",
            _format_extracted(extracted_data),
        ]

        if existing_card:
            prompt_parts.extend([
                "",
                "## Previous battle card analysis (for context on changes):",
                f"Territory risk was: {existing_card.analysis.territory_risk.value}",
                f"Previous strengths: {[s.value for s in existing_card.analysis.likely_strengths[:5]]}",
                f"Previous weaknesses: {[w.value for w in existing_card.analysis.likely_weaknesses[:5]]}",
            ])

        prompt = "\n".join(prompt_parts)

        try:
            result = self.call_llm_json(SYSTEM_PROMPT, prompt, max_tokens=4096)
            self.logger.info(f"Positioning analysis complete for {competitor_name}")
            return result
        except Exception as e:
            self.logger.error(f"Positioning analysis failed for {competitor_name}: {e}")
            return {}


def _format_extracted(data: dict) -> str:
    """Format extracted data dict into readable text for the LLM."""
    import json
    return json.dumps(data, indent=2, default=str)[:8000]
