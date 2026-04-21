"""
Orchestrator

Coordinates all agents to process a single competitor or run a full cycle.

Pipeline per competitor:
1. Web Monitor → fetch URLs, detect changes
2. Extraction Agent → extract structured facts from changed pages
3. Company Intel Agent → enrich company profile
4. Positioning Analysis Agent → produce strategic assessment
5. Battle Card Writer → assemble/update the battle card
6. QA Agent → review for quality issues
7. Output Writers → produce JSON + Markdown

The orchestrator handles delta detection: only pages that changed
trigger extraction and downstream processing.
"""

from __future__ import annotations

from datetime import datetime, timezone
from pathlib import Path

from .agents import (
    BattleCardWriterAgent,
    CompanyIntelAgent,
    ExtractionAgent,
    PositioningAnalysisAgent,
    QAAgent,
    SourceDiscoveryAgent,
    WebMonitorAgent,
)
from .agents.web_monitor import ChangeDetection
from .connectors import DiffEngine
from .models import (
    BattleCard,
    ChangeLogEntry,
    Competitor,
    FeatureLaunch,
    SourceEvidence,
    TrackedUrls,
)
from .outputs import DigestWriter, JSONOutputWriter, MarkdownOutputWriter
from .storage.database import Database
from .utils.config import Config, CompetitorConfig
from .utils.logging import get_logger

logger = get_logger("orchestrator")


class Orchestrator:
    def __init__(self, config: Config):
        self.config = config
        self.db = Database(config.storage.database_path)

        # Initialize agents
        self.source_discovery = SourceDiscoveryAgent(config, self.db)
        self.web_monitor = WebMonitorAgent(config, self.db)
        self.extraction = ExtractionAgent(config, self.db)
        self.company_intel = CompanyIntelAgent(config, self.db)
        self.positioning = PositioningAnalysisAgent(config, self.db)
        self.card_writer = BattleCardWriterAgent(config, self.db)
        self.qa = QAAgent(config, self.db)

        # Initialize outputs
        self.json_writer = JSONOutputWriter(config.output.json_dir)
        self.md_writer = MarkdownOutputWriter(config.output.markdown_dir)
        self.digest_writer = DigestWriter(self.db, config.output.digest_dir)

    def seed_competitors(self) -> None:
        """Load competitors from config into the database."""
        for cc in self.config.competitors:
            existing = self.db.get_competitor_by_slug(cc.slug)
            if existing:
                logger.info(f"Competitor '{cc.name}' already exists, skipping seed")
                continue

            tracked = TrackedUrls(
                homepage=cc.tracked_urls.homepage,
                pricing=cc.tracked_urls.pricing,
                product=cc.tracked_urls.product,
                docs=cc.tracked_urls.docs,
                blog=cc.tracked_urls.blog,
                investor_relations=cc.tracked_urls.investor_relations,
                careers=cc.tracked_urls.careers,
                changelog=cc.tracked_urls.changelog,
                social_profiles=cc.tracked_urls.social_profiles,
                custom=cc.tracked_urls.custom,
            )

            comp = Competitor(
                name=cc.name,
                slug=cc.slug,
                website=cc.website,
                tracked_urls=tracked,
                is_priority=cc.is_priority,
            )
            self.db.upsert_competitor(comp)
            logger.info(f"Seeded competitor: {cc.name} ({cc.slug})")

    def process_competitor(self, competitor: Competitor, force: bool = False) -> BattleCard | None:
        """
        Run the full pipeline for a single competitor.
        If force=False, only processes pages that changed.
        Returns the updated battle card or None if nothing to process.
        """
        logger.info(f"{'='*60}")
        logger.info(f"Processing: {competitor.name}")
        logger.info(f"{'='*60}")

        # Step 1: Web monitoring — detect changes
        detections = self.web_monitor.check_competitor(competitor)

        changed = [d for d in detections if d.has_changed or force]
        if not changed and not force:
            logger.info(f"No changes detected for {competitor.name}, skipping")
            return self.db.get_battle_card(competitor.id)

        # Step 2: Extract facts from changed pages
        all_extracted: dict[str, dict] = {}
        all_sources: list[SourceEvidence] = []
        all_launches: list[FeatureLaunch] = []

        for detection in (changed if changed else detections):
            diff_context = None
            if detection.diff_summary and detection.added_lines:
                diff_context = DiffEngine.extract_key_changes(
                    type("D", (), {
                        "added_lines": detection.added_lines,
                        "removed_lines": detection.removed_lines,
                    })()
                )

            extracted = self.extraction.extract_from_page(
                competitor_name=competitor.name,
                url=detection.url,
                page_text=detection.current_text,
                page_title=detection.page_title,
                diff_context=diff_context,
            )

            if extracted:
                all_extracted[detection.url] = extracted

                # Collect feature launches
                for raw_launch in extracted.get("feature_launches", []):
                    launch = self.extraction.to_feature_launch(
                        raw_launch, detection.url, detection.page_title
                    )
                    all_launches.append(launch)

                # Build source evidence
                all_sources.append(SourceEvidence(
                    url=detection.url,
                    title=detection.page_title or detection.url,
                    source_type=self.extraction._infer_source_type(detection.url),
                ))

        # Merge extracted data across all pages
        merged = self._merge_extractions(all_extracted)

        # Step 3: Enrich company profile
        existing_card = self.db.get_battle_card(competitor.id)
        existing_profile = existing_card.company_profile if existing_card else None

        profile, profile_changes, review_items = self.company_intel.enrich_profile(
            competitor_name=competitor.name,
            website=competitor.website,
            existing_profile=existing_profile,
            extracted_data=merged,
        )

        # Step 4: Positioning analysis
        analysis = self.positioning.analyze(
            competitor_name=competitor.name,
            extracted_data=merged,
            existing_card=existing_card,
        )

        # Step 5: Assemble battle card
        card, card_changes = self.card_writer.create_or_update(
            competitor_id=competitor.id,
            profile=profile,
            extracted_data=merged,
            analysis=analysis,
            new_launches=all_launches,
            new_sources=all_sources,
            existing_card=existing_card,
        )

        # Step 6: QA review
        qa_issues, qa_reviews = self.qa.review_card(card)
        for issue in qa_issues:
            logger.info(f"  QA: {issue}")

        # Persist everything
        all_changes = profile_changes + card_changes
        for change in all_changes:
            change.competitor_id = competitor.id
            self.db.add_changelog_entry(change)

        for review in review_items + qa_reviews:
            review.competitor_id = competitor.id
            self.db.add_review_item(review)

        self.db.upsert_battle_card(card)
        competitor.battle_card = card
        self.db.upsert_competitor(competitor)

        # Step 7: Write outputs
        self.json_writer.write(competitor.slug, card)
        self.md_writer.write(competitor.slug, card)

        logger.info(
            f"Completed {competitor.name}: "
            f"{len(all_changes)} changes, "
            f"{len(all_launches)} launches, "
            f"{len(qa_issues)} QA issues"
        )
        return card

    def run_full_cycle(self, priority_only: bool = False, force: bool = False) -> None:
        """Run the pipeline for all competitors."""
        self.seed_competitors()
        competitors = self.db.list_competitors()

        if priority_only:
            competitors = [c for c in competitors if c.is_priority]

        logger.info(f"Starting full cycle for {len(competitors)} competitors")

        for comp in competitors:
            if not comp.monitoring_enabled:
                logger.info(f"Monitoring disabled for {comp.name}, skipping")
                continue
            try:
                self.process_competitor(comp, force=force)
            except Exception as e:
                logger.error(f"Failed to process {comp.name}: {e}", exc_info=True)

        logger.info("Full cycle complete")

    def generate_digest(self, period_days: int = 7) -> Path:
        """Generate and write the weekly digest."""
        digest = self.digest_writer.generate(period_days=period_days)
        path = self.digest_writer.write_markdown(digest)
        logger.info(f"Weekly digest written to {path}")
        return path

    def check_staleness(self) -> list[str]:
        """Check all battle cards for stale fields."""
        stale_fields: list[str] = []
        for comp in self.db.list_competitors():
            card = self.db.get_battle_card(comp.id)
            if not card:
                continue
            for freshness in card.field_freshness:
                if freshness.check_staleness():
                    msg = (
                        f"{comp.name}: {freshness.field_name} is stale "
                        f"(last confirmed {freshness.last_confirmed.strftime('%Y-%m-%d')})"
                    )
                    stale_fields.append(msg)
                    logger.warning(msg)
        return stale_fields

    @staticmethod
    def _merge_extractions(extractions: dict[str, dict]) -> dict:
        """Merge extracted data from multiple pages into one dict."""
        merged: dict = {
            "company_facts": [],
            "positioning": [],
            "feature_launches": [],
            "key_products": [],
        }

        for url, data in extractions.items():
            for key in ["company_facts", "positioning", "feature_launches", "key_products"]:
                items = data.get(key, [])
                if isinstance(items, list):
                    merged[key].extend(items)

            # Singular fields — take first non-empty
            for key in ["target_customers", "geography_focus"]:
                if key in data and key not in merged:
                    merged[key] = data[key]

        return merged

    def close(self) -> None:
        self.db.close()
