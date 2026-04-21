"""
Web Monitor Agent

Fetches tracked URLs, detects content changes via hashing,
saves snapshots, and produces structured diffs for downstream agents.
"""

from __future__ import annotations

import asyncio
from datetime import datetime, timezone

from ..connectors import ContentHasher, DiffEngine, WebFetcher
from ..models import Competitor, MonitoringEvent
from ..utils.config import MonitoringConfig
from .base import BaseAgent


class ChangeDetection:
    """Result of monitoring one URL."""
    def __init__(
        self,
        url: str,
        has_changed: bool,
        event: MonitoringEvent,
        diff_summary: str | None = None,
        added_lines: list[str] | None = None,
        removed_lines: list[str] | None = None,
        current_text: str = "",
        previous_text: str | None = None,
        page_title: str = "",
        meta_description: str = "",
    ):
        self.url = url
        self.has_changed = has_changed
        self.event = event
        self.diff_summary = diff_summary
        self.added_lines = added_lines or []
        self.removed_lines = removed_lines or []
        self.current_text = current_text
        self.previous_text = previous_text
        self.page_title = page_title
        self.meta_description = meta_description


class WebMonitorAgent(BaseAgent):
    agent_name = "web_monitor"

    def __init__(self, config, db):
        super().__init__(config, db)
        mon: MonitoringConfig = config.monitoring
        self.fetcher = WebFetcher(
            user_agent=mon.user_agent,
            timeout=mon.request_timeout_seconds,
            delay=mon.request_delay_seconds,
            respect_robots=mon.respect_robots_txt,
        )
        self.hasher = ContentHasher()
        self.differ = DiffEngine()

    def check_competitor(self, competitor: Competitor) -> list[ChangeDetection]:
        """Check all tracked URLs for a competitor. Returns list of changes."""
        urls = self._collect_urls(competitor)
        if not urls:
            self.logger.warning(f"No URLs to monitor for {competitor.name}")
            return []

        self.logger.info(f"Checking {len(urls)} URLs for {competitor.name}")
        results = asyncio.run(self.fetcher.fetch_many(
            urls, max_concurrent=self.config.monitoring.max_concurrent_requests
        ))

        detections: list[ChangeDetection] = []
        for result in results:
            if not result.ok:
                self.logger.warning(f"Failed to fetch {result.url}: {result.error or result.status_code}")
                continue

            detection = self._process_result(competitor.id, result)
            detections.append(detection)

        # Update last_checked
        competitor.last_checked = datetime.now(timezone.utc)
        self.db.upsert_competitor(competitor)

        changed = sum(1 for d in detections if d.has_changed)
        self.logger.info(
            f"{competitor.name}: {changed}/{len(detections)} URLs changed"
        )
        return detections

    def _process_result(self, competitor_id: str, result) -> ChangeDetection:
        """Hash content, compare with previous, save snapshot if changed."""
        content_hash = self.hasher.hash_text(result.extracted_text)
        previous_hash = self.db.get_latest_hash(competitor_id, result.url)
        has_changed = self.hasher.has_changed(previous_hash, content_hash)

        diff_summary = None
        added_lines: list[str] = []
        removed_lines: list[str] = []
        previous_text = None

        if has_changed and previous_hash is not None:
            previous_text = self.db.get_previous_snapshot(competitor_id, result.url)
            if previous_text:
                diff = self.differ.diff_text(previous_text, result.extracted_text)
                diff_summary = diff.summary
                added_lines = diff.added_lines
                removed_lines = diff.removed_lines

        # Save snapshot
        self.db.save_snapshot(competitor_id, result.url, content_hash, result.extracted_text)

        # Record monitoring event
        event = MonitoringEvent(
            competitor_id=competitor_id,
            url=result.url,
            content_hash=content_hash,
            previous_hash=previous_hash,
            has_changed=has_changed,
            diff_summary=diff_summary,
        )
        self.db.add_monitoring_event(event)

        return ChangeDetection(
            url=result.url,
            has_changed=has_changed,
            event=event,
            diff_summary=diff_summary,
            added_lines=added_lines,
            removed_lines=removed_lines,
            current_text=result.extracted_text,
            previous_text=previous_text,
            page_title=result.title,
            meta_description=result.meta_description,
        )

    @staticmethod
    def _collect_urls(competitor: Competitor) -> list[str]:
        urls: list[str] = []
        tracked = competitor.tracked_urls
        for field in ["homepage", "pricing", "product", "docs", "blog",
                       "investor_relations", "careers", "changelog"]:
            val = getattr(tracked, field, None)
            if val:
                urls.append(val)
        urls.extend(tracked.social_profiles)
        urls.extend(tracked.custom.values())
        return urls
