"""
Weekly digest generator.

Produces a summary of all meaningful changes across competitors
for the past week.
"""

from __future__ import annotations

from datetime import datetime, timedelta, timezone
from pathlib import Path

from ..models import (
    ChangeLogEntry,
    DigestEntry,
    FeatureLaunch,
    WeeklyDigest,
)
from ..storage.database import Database


class DigestWriter:
    def __init__(self, db: Database, output_dir: str = "data/reports"):
        self.db = db
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)

    def generate(self, period_days: int = 7) -> WeeklyDigest:
        """Generate a weekly digest of changes."""
        now = datetime.now(timezone.utc)
        period_start = now - timedelta(days=period_days)
        competitors = self.db.list_competitors()

        entries: list[DigestEntry] = []
        total_changes = 0
        total_launches = 0

        for comp in competitors:
            changes = self.db.get_changelog(comp.id, since=period_start)
            card = self.db.get_battle_card(comp.id)

            new_launches: list[FeatureLaunch] = []
            if card:
                new_launches = [
                    fl for fl in card.feature_launches
                    if fl.announcement_date and fl.announcement_date >= period_start
                ]

            if not changes and not new_launches:
                continue

            highlights: list[str] = []
            for change in changes[:5]:
                highlights.append(
                    f"{change.change_type.value}: {change.section}.{change.field} "
                    f"→ {change.new_value or '(removed)'}"
                )
            for launch in new_launches[:3]:
                highlights.append(
                    f"New feature: {launch.feature_name} "
                    f"({launch.strategic_importance.value} importance)"
                )

            entries.append(DigestEntry(
                competitor_name=comp.name,
                competitor_id=comp.id,
                changes=changes,
                new_launches=new_launches,
                highlights=highlights,
            ))
            total_changes += len(changes)
            total_launches += len(new_launches)

        pending_reviews = len(self.db.get_pending_reviews())

        digest = WeeklyDigest(
            period_start=period_start,
            period_end=now,
            entries=entries,
            summary=(
                f"{total_changes} changes and {total_launches} new feature launches "
                f"detected across {len(entries)} competitors."
            ),
            action_items=self._generate_action_items(entries),
            pending_reviews_count=pending_reviews,
        )

        self.db.save_digest(digest)
        return digest

    def render_markdown(self, digest: WeeklyDigest) -> str:
        """Render the digest as a markdown document."""
        lines: list[str] = []

        lines.append("# Weekly Competitive Intelligence Digest")
        lines.append(
            f"*{digest.period_start.strftime('%Y-%m-%d')} to "
            f"{digest.period_end.strftime('%Y-%m-%d')}*\n"
        )

        if digest.summary:
            lines.append(f"**Summary:** {digest.summary}\n")

        if digest.pending_reviews_count:
            lines.append(
                f"> {digest.pending_reviews_count} items pending human review\n"
            )

        for entry in digest.entries:
            lines.append(f"## {entry.competitor_name}\n")

            if entry.highlights:
                for hl in entry.highlights:
                    lines.append(f"- {hl}")
                lines.append("")

            if entry.new_launches:
                lines.append("### New Feature Launches")
                for launch in entry.new_launches:
                    date = launch.launch_date or launch.announcement_date
                    date_str = date.strftime("%Y-%m-%d") if date else "Unknown"
                    lines.append(
                        f"- **{launch.feature_name}** ({date_str}) — "
                        f"{launch.summary} "
                        f"[{launch.strategic_importance.value} importance]"
                    )
                lines.append("")

            if entry.changes:
                lines.append("### Changes")
                lines.append("| Section | Field | Change | New Value |")
                lines.append("|---------|-------|--------|-----------|")
                for change in entry.changes[:15]:
                    lines.append(
                        f"| {change.section} | {change.field} "
                        f"| {change.change_type.value} "
                        f"| {(change.new_value or '')[:60]} |"
                    )
                lines.append("")

        if digest.action_items:
            lines.append("## Action Items\n")
            for item in digest.action_items:
                lines.append(f"- [ ] {item}")
            lines.append("")

        lines.append("---")
        lines.append(
            f"*Generated: {digest.generated_at.strftime('%Y-%m-%d %H:%M UTC')}*"
        )
        return "\n".join(lines)

    def write_markdown(self, digest: WeeklyDigest) -> Path:
        md = self.render_markdown(digest)
        filename = f"digest_{digest.period_start.strftime('%Y%m%d')}_{digest.period_end.strftime('%Y%m%d')}.md"
        path = self.output_dir / filename
        with open(path, "w") as f:
            f.write(md)
        return path

    def _generate_action_items(self, entries: list[DigestEntry]) -> list[str]:
        items: list[str] = []
        for entry in entries:
            critical_launches = [
                l for l in entry.new_launches
                if l.strategic_importance.value in ("high", "critical")
            ]
            for launch in critical_launches:
                items.append(
                    f"Review {entry.competitor_name}'s launch of "
                    f"'{launch.feature_name}' — {launch.strategic_importance.value} importance"
                )

            risk_changes = [
                c for c in entry.changes
                if c.field == "territory_risk"
            ]
            for change in risk_changes:
                items.append(
                    f"{entry.competitor_name} territory risk changed to {change.new_value}"
                )

        return items
