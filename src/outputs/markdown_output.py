"""
Markdown battle card renderer.

Produces a human-readable, sales-team-friendly battle card document.
"""

from __future__ import annotations

from datetime import datetime
from pathlib import Path

from ..models import BattleCard, ConfidenceAssessment, ConfidenceLevel


def _conf_badge(level: ConfidenceLevel) -> str:
    badges = {
        ConfidenceLevel.HIGH: "",
        ConfidenceLevel.MEDIUM: " *(medium confidence)*",
        ConfidenceLevel.LOW: " **[LOW CONFIDENCE]**",
        ConfidenceLevel.SPECULATIVE: " **[SPECULATIVE]**",
    }
    return badges.get(level, "")


def _ca_str(ca: ConfidenceAssessment | None) -> str:
    if ca is None:
        return "*Not available*"
    suffix = _conf_badge(ca.confidence)
    est = " *(estimated)*" if ca.is_estimated else ""
    return f"{ca.value}{est}{suffix}"


class MarkdownOutputWriter:
    def __init__(self, output_dir: str = "data/battlecards/markdown"):
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)

    def write(self, slug: str, card: BattleCard) -> Path:
        path = self.output_dir / f"{slug}.md"
        md = self.render(card)
        with open(path, "w") as f:
            f.write(md)
        return path

    def render(self, card: BattleCard) -> str:
        p = card.company_profile
        pos = card.positioning
        a = card.analysis
        lines: list[str] = []

        # Header
        lines.append(f"# Battle Card: {p.name}")
        lines.append(f"*Last updated: {card.updated_at.strftime('%Y-%m-%d %H:%M UTC')} "
                      f"| Version {card.version}*\n")

        # ── Company Overview ──
        lines.append("## Company Overview\n")
        lines.append(f"| Field | Value |")
        lines.append(f"|-------|-------|")
        lines.append(f"| **Website** | {p.website} |")
        lines.append(f"| **HQ Location** | {_ca_str(p.hq_location)} |")
        lines.append(f"| **Founded** | {_ca_str(p.founding_year)} |")
        lines.append(f"| **Employees** | {_ca_str(p.employee_count)} |")
        lines.append(f"| **Revenue** | {_ca_str(p.estimated_revenue)} |")
        lines.append(f"| **Status** | {_ca_str(p.public_private)} |")
        if p.funding_stage:
            lines.append(f"| **Funding Stage** | {_ca_str(p.funding_stage)} |")
        if p.ticker_symbol:
            lines.append(f"| **Ticker** | {p.ticker_symbol} |")
        if p.investor_relations_url:
            lines.append(f"| **Investor Relations** | [{p.investor_relations_url}]({p.investor_relations_url}) |")
        lines.append("")

        if p.description:
            lines.append(f"**Description:** {_ca_str(p.description)}\n")

        if p.key_products:
            lines.append("**Key Products:**")
            for prod in p.key_products:
                lines.append(f"- {prod.value}{_conf_badge(prod.confidence)}")
            lines.append("")

        lines.append(f"**Target Customers:** {_ca_str(p.target_customers)}\n")
        lines.append(f"**Geography Focus:** {_ca_str(p.geography_focus)}\n")

        # ── Category & Positioning ──
        lines.append("## Category & Positioning\n")
        if pos.primary_category:
            lines.append(f"**Primary Category:** {_ca_str(pos.primary_category)}\n")
        if pos.secondary_category:
            lines.append(f"**Secondary Category:** {_ca_str(pos.secondary_category)}\n")
        if pos.positioning_statement:
            lines.append(f"**Positioning:** {_ca_str(pos.positioning_statement)}\n")
        if pos.core_value_proposition:
            lines.append(f"**Value Proposition:** {_ca_str(pos.core_value_proposition)}\n")
        if pos.market_segment_focus:
            lines.append(f"**Segment Focus:** {_ca_str(pos.market_segment_focus)}\n")
        if pos.pricing_model_notes:
            lines.append(f"**Pricing Model:** {_ca_str(pos.pricing_model_notes)}\n")

        if pos.key_messaging_themes:
            lines.append("**Key Messaging Themes:**")
            for theme in pos.key_messaging_themes:
                lines.append(f"- {theme.value}{_conf_badge(theme.confidence)}")
            lines.append("")

        if pos.main_use_cases:
            lines.append("**Main Use Cases:**")
            for uc in pos.main_use_cases:
                lines.append(f"- {uc.value}{_conf_badge(uc.confidence)}")
            lines.append("")

        if pos.claimed_differentiators:
            lines.append("**Claimed Differentiators:**")
            for d in pos.claimed_differentiators:
                lines.append(f"- {d.value}{_conf_badge(d.confidence)}")
            lines.append("")

        # ── Product & Launch Intelligence ──
        if card.feature_launches:
            lines.append("## Product & Launch Intelligence\n")
            for fl in sorted(card.feature_launches,
                             key=lambda x: x.announcement_date or x.launch_date or datetime.min,
                             reverse=True):
                date_str = ""
                if fl.launch_date:
                    date_str = fl.launch_date.strftime("%Y-%m-%d")
                elif fl.announcement_date:
                    date_str = fl.announcement_date.strftime("%Y-%m-%d")

                importance = f" | **{fl.strategic_importance.value.upper()}**" if fl.strategic_importance else ""
                lines.append(f"### {fl.feature_name}{importance}")
                lines.append(f"- **Date:** {date_str}")
                lines.append(f"- **Summary:** {fl.summary}")
                if fl.category:
                    lines.append(f"- **Category:** {fl.category}")
                if fl.affected_persona:
                    lines.append(f"- **Affected Persona:** {fl.affected_persona}")
                if fl.affected_use_case:
                    lines.append(f"- **Use Case Impact:** {fl.affected_use_case}")
                lines.append(f"- **Source:** [{fl.source_url}]({fl.source_url})")
                lines.append(f"- **Confidence:** {fl.confidence.value}")
                lines.append("")

        # ── Battle Card Analysis ──
        lines.append("## Battle Card\n")

        # Risk
        risk_emoji = {"low": "LOW", "medium": "MEDIUM", "high": "HIGH", "critical": "CRITICAL"}
        lines.append(f"**Territory Risk Level:** **{risk_emoji.get(a.territory_risk.value, a.territory_risk.value)}**")
        if a.territory_risk_notes:
            lines.append(f"> {a.territory_risk_notes}")
        lines.append("")

        if a.why_customers_buy:
            lines.append("### Why Customers Buy Them")
            for item in a.why_customers_buy:
                lines.append(f"- {item.value}{_conf_badge(item.confidence)}")
            lines.append("")

        if a.likely_strengths:
            lines.append("### Likely Strengths")
            for item in a.likely_strengths:
                lines.append(f"- {item.value}{_conf_badge(item.confidence)}")
            lines.append("")

        if a.likely_weaknesses:
            lines.append("### Likely Weaknesses / Gaps")
            for item in a.likely_weaknesses:
                lines.append(f"- {item.value}{_conf_badge(item.confidence)}")
            lines.append("")

        if a.where_we_win:
            lines.append("### Where We Win")
            for item in a.where_we_win:
                lines.append(f"- {item}")
            lines.append("")

        if a.where_we_lose:
            lines.append("### Where We Lose")
            for item in a.where_we_lose:
                lines.append(f"- {item}")
            lines.append("")

        if a.objection_handling:
            lines.append("### Objection Handling")
            for obj in a.objection_handling:
                lines.append(f"**Objection:** *\"{obj.get('objection', '')}\"*")
                lines.append(f"**Response:** {obj.get('response', '')}\n")

        if a.competitive_positioning_angles:
            lines.append("### Competitive Positioning Angles")
            for angle in a.competitive_positioning_angles:
                lines.append(f"- {angle}")
            lines.append("")

        # ── Sources ──
        if card.all_sources:
            lines.append("## Sources\n")
            lines.append("| Source | Type | Confidence | Date Found |")
            lines.append("|--------|------|------------|------------|")
            for src in card.all_sources[:30]:
                lines.append(
                    f"| [{src.title}]({src.url}) "
                    f"| {src.source_type.value} "
                    f"| {src.confidence.value} "
                    f"| {src.date_found.strftime('%Y-%m-%d')} |"
                )
            lines.append("")

        # ── Freshness ──
        stale = [f for f in card.field_freshness if f.is_stale]
        if stale:
            lines.append("## Stale Fields\n")
            for f in stale:
                days = (datetime.now() - f.last_confirmed.replace(tzinfo=None)).days
                lines.append(f"- **{f.field_name}**: {days} days since last confirmation")
            lines.append("")

        lines.append("---")
        lines.append(f"*Generated by Competitive Intelligence Agent | {card.updated_at.strftime('%Y-%m-%d')}*")

        return "\n".join(lines)
