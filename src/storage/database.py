"""
SQLite-backed storage for competitors, battle cards, snapshots, changelogs,
monitoring events, and the review queue.

All data is stored as JSON blobs keyed by competitor ID for simplicity.
A production deployment could swap this for Postgres without changing the
interface.
"""

from __future__ import annotations

import json
import sqlite3
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

from ..models import (
    BattleCard,
    ChangeLogEntry,
    Competitor,
    MonitoringEvent,
    ReviewQueueItem,
    WeeklyDigest,
)


class Database:
    def __init__(self, db_path: str | Path = "data/competitive_intel.db"):
        self.db_path = Path(db_path)
        self.db_path.parent.mkdir(parents=True, exist_ok=True)
        self.conn = sqlite3.connect(str(self.db_path))
        self.conn.row_factory = sqlite3.Row
        self._init_tables()

    def _init_tables(self) -> None:
        cur = self.conn.cursor()
        cur.executescript("""
            CREATE TABLE IF NOT EXISTS competitors (
                id TEXT PRIMARY KEY,
                slug TEXT UNIQUE NOT NULL,
                name TEXT NOT NULL,
                data JSON NOT NULL,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS battle_cards (
                id TEXT PRIMARY KEY,
                competitor_id TEXT NOT NULL REFERENCES competitors(id),
                data JSON NOT NULL,
                version INTEGER NOT NULL DEFAULT 1,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS monitoring_events (
                id TEXT PRIMARY KEY,
                competitor_id TEXT NOT NULL,
                url TEXT NOT NULL,
                content_hash TEXT NOT NULL,
                previous_hash TEXT,
                has_changed INTEGER NOT NULL DEFAULT 0,
                diff_summary TEXT,
                snapshot_path TEXT,
                timestamp TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS changelog (
                id TEXT PRIMARY KEY,
                competitor_id TEXT NOT NULL,
                timestamp TEXT NOT NULL,
                change_type TEXT NOT NULL,
                section TEXT NOT NULL,
                field TEXT NOT NULL,
                old_value TEXT,
                new_value TEXT,
                source JSON,
                confidence TEXT,
                auto_applied INTEGER NOT NULL DEFAULT 1,
                notes TEXT
            );

            CREATE TABLE IF NOT EXISTS review_queue (
                id TEXT PRIMARY KEY,
                competitor_id TEXT NOT NULL,
                competitor_name TEXT NOT NULL,
                timestamp TEXT NOT NULL,
                section TEXT NOT NULL,
                field TEXT NOT NULL,
                proposed_value TEXT NOT NULL,
                current_value TEXT,
                confidence TEXT NOT NULL,
                sources JSON,
                reason TEXT NOT NULL,
                status TEXT NOT NULL DEFAULT 'pending',
                reviewer_notes TEXT
            );

            CREATE TABLE IF NOT EXISTS snapshots (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                competitor_id TEXT NOT NULL,
                url TEXT NOT NULL,
                content_hash TEXT NOT NULL,
                content TEXT NOT NULL,
                timestamp TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS digests (
                id TEXT PRIMARY KEY,
                period_start TEXT NOT NULL,
                period_end TEXT NOT NULL,
                generated_at TEXT NOT NULL,
                data JSON NOT NULL
            );

            CREATE INDEX IF NOT EXISTS idx_monitoring_competitor
                ON monitoring_events(competitor_id, timestamp);
            CREATE INDEX IF NOT EXISTS idx_changelog_competitor
                ON changelog(competitor_id, timestamp);
            CREATE INDEX IF NOT EXISTS idx_review_status
                ON review_queue(status);
            CREATE INDEX IF NOT EXISTS idx_snapshots_competitor_url
                ON snapshots(competitor_id, url, timestamp);
        """)
        self.conn.commit()

    # -- Competitors --------------------------------------------------------

    def upsert_competitor(self, competitor: Competitor) -> None:
        now = datetime.now(timezone.utc).isoformat()
        self.conn.execute(
            """INSERT INTO competitors (id, slug, name, data, created_at, updated_at)
               VALUES (?, ?, ?, ?, ?, ?)
               ON CONFLICT(id) DO UPDATE SET
                   data = excluded.data,
                   updated_at = excluded.updated_at""",
            (competitor.id, competitor.slug, competitor.name,
             competitor.model_dump_json(), now, now),
        )
        self.conn.commit()

    def get_competitor(self, competitor_id: str) -> Optional[Competitor]:
        row = self.conn.execute(
            "SELECT data FROM competitors WHERE id = ?", (competitor_id,)
        ).fetchone()
        if row:
            return Competitor.model_validate_json(row["data"])
        return None

    def get_competitor_by_slug(self, slug: str) -> Optional[Competitor]:
        row = self.conn.execute(
            "SELECT data FROM competitors WHERE slug = ?", (slug,)
        ).fetchone()
        if row:
            return Competitor.model_validate_json(row["data"])
        return None

    def list_competitors(self) -> list[Competitor]:
        rows = self.conn.execute("SELECT data FROM competitors ORDER BY name").fetchall()
        return [Competitor.model_validate_json(r["data"]) for r in rows]

    # -- Battle Cards -------------------------------------------------------

    def upsert_battle_card(self, card: BattleCard) -> None:
        now = datetime.now(timezone.utc).isoformat()
        self.conn.execute(
            """INSERT INTO battle_cards (id, competitor_id, data, version, created_at, updated_at)
               VALUES (?, ?, ?, ?, ?, ?)
               ON CONFLICT(id) DO UPDATE SET
                   data = excluded.data,
                   version = excluded.version,
                   updated_at = excluded.updated_at""",
            (card.id, card.competitor_id, card.model_dump_json(),
             card.version, now, now),
        )
        self.conn.commit()

    def get_battle_card(self, competitor_id: str) -> Optional[BattleCard]:
        row = self.conn.execute(
            "SELECT data FROM battle_cards WHERE competitor_id = ? ORDER BY version DESC LIMIT 1",
            (competitor_id,),
        ).fetchone()
        if row:
            return BattleCard.model_validate_json(row["data"])
        return None

    # -- Monitoring Events --------------------------------------------------

    def add_monitoring_event(self, event: MonitoringEvent) -> None:
        self.conn.execute(
            """INSERT INTO monitoring_events
               (id, competitor_id, url, content_hash, previous_hash,
                has_changed, diff_summary, snapshot_path, timestamp)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (event.id, event.competitor_id, event.url, event.content_hash,
             event.previous_hash, int(event.has_changed), event.diff_summary,
             event.snapshot_path, event.timestamp.isoformat()),
        )
        self.conn.commit()

    def get_latest_hash(self, competitor_id: str, url: str) -> Optional[str]:
        row = self.conn.execute(
            """SELECT content_hash FROM monitoring_events
               WHERE competitor_id = ? AND url = ?
               ORDER BY timestamp DESC LIMIT 1""",
            (competitor_id, url),
        ).fetchone()
        return row["content_hash"] if row else None

    # -- Snapshots ----------------------------------------------------------

    def save_snapshot(self, competitor_id: str, url: str,
                      content_hash: str, content: str) -> None:
        now = datetime.now(timezone.utc).isoformat()
        self.conn.execute(
            """INSERT INTO snapshots (competitor_id, url, content_hash, content, timestamp)
               VALUES (?, ?, ?, ?, ?)""",
            (competitor_id, url, content_hash, content, now),
        )
        self.conn.commit()

    def get_previous_snapshot(self, competitor_id: str, url: str) -> Optional[str]:
        row = self.conn.execute(
            """SELECT content FROM snapshots
               WHERE competitor_id = ? AND url = ?
               ORDER BY timestamp DESC LIMIT 1""",
            (competitor_id, url),
        ).fetchone()
        return row["content"] if row else None

    # -- Changelog ----------------------------------------------------------

    def add_changelog_entry(self, entry: ChangeLogEntry) -> None:
        self.conn.execute(
            """INSERT INTO changelog
               (id, competitor_id, timestamp, change_type, section, field,
                old_value, new_value, source, confidence, auto_applied, notes)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (entry.id, entry.competitor_id, entry.timestamp.isoformat(),
             entry.change_type.value, entry.section, entry.field,
             entry.old_value, entry.new_value,
             entry.source.model_dump_json() if entry.source else None,
             entry.confidence.value, int(entry.auto_applied), entry.notes),
        )
        self.conn.commit()

    def get_changelog(self, competitor_id: str,
                      since: Optional[datetime] = None) -> list[ChangeLogEntry]:
        if since:
            rows = self.conn.execute(
                """SELECT * FROM changelog
                   WHERE competitor_id = ? AND timestamp >= ?
                   ORDER BY timestamp DESC""",
                (competitor_id, since.isoformat()),
            ).fetchall()
        else:
            rows = self.conn.execute(
                """SELECT * FROM changelog WHERE competitor_id = ?
                   ORDER BY timestamp DESC""",
                (competitor_id,),
            ).fetchall()
        return [self._row_to_changelog_entry(r) for r in rows]

    def _row_to_changelog_entry(self, row: sqlite3.Row) -> ChangeLogEntry:
        from ..models.schema import ChangeType, SourceEvidence
        source = None
        if row["source"]:
            source = SourceEvidence.model_validate_json(row["source"])
        return ChangeLogEntry(
            id=row["id"],
            competitor_id=row["competitor_id"],
            timestamp=datetime.fromisoformat(row["timestamp"]),
            change_type=ChangeType(row["change_type"]),
            section=row["section"],
            field=row["field"],
            old_value=row["old_value"],
            new_value=row["new_value"],
            source=source,
            confidence=row["confidence"],
            auto_applied=bool(row["auto_applied"]),
            notes=row["notes"],
        )

    # -- Review Queue -------------------------------------------------------

    def add_review_item(self, item: ReviewQueueItem) -> None:
        self.conn.execute(
            """INSERT INTO review_queue
               (id, competitor_id, competitor_name, timestamp, section, field,
                proposed_value, current_value, confidence, sources, reason,
                status, reviewer_notes)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (item.id, item.competitor_id, item.competitor_name,
             item.timestamp.isoformat(), item.section, item.field,
             item.proposed_value, item.current_value, item.confidence.value,
             json.dumps([s.model_dump() for s in item.sources], default=str),
             item.reason, item.status.value, item.reviewer_notes),
        )
        self.conn.commit()

    def get_pending_reviews(self) -> list[ReviewQueueItem]:
        rows = self.conn.execute(
            "SELECT * FROM review_queue WHERE status = 'pending' ORDER BY timestamp DESC"
        ).fetchall()
        results = []
        for row in rows:
            sources_raw = json.loads(row["sources"]) if row["sources"] else []
            from ..models.schema import SourceEvidence
            sources = [SourceEvidence.model_validate(s) for s in sources_raw]
            results.append(ReviewQueueItem(
                id=row["id"],
                competitor_id=row["competitor_id"],
                competitor_name=row["competitor_name"],
                timestamp=datetime.fromisoformat(row["timestamp"]),
                section=row["section"],
                field=row["field"],
                proposed_value=row["proposed_value"],
                current_value=row["current_value"],
                confidence=row["confidence"],
                sources=sources,
                reason=row["reason"],
                status=row["status"],
                reviewer_notes=row["reviewer_notes"],
            ))
        return results

    def update_review_status(self, review_id: str, status: str,
                             notes: Optional[str] = None) -> None:
        self.conn.execute(
            "UPDATE review_queue SET status = ?, reviewer_notes = ? WHERE id = ?",
            (status, notes, review_id),
        )
        self.conn.commit()

    # -- Digests ------------------------------------------------------------

    def save_digest(self, digest: WeeklyDigest) -> None:
        self.conn.execute(
            """INSERT INTO digests (id, period_start, period_end, generated_at, data)
               VALUES (?, ?, ?, ?, ?)""",
            (digest.id, digest.period_start.isoformat(),
             digest.period_end.isoformat(), digest.generated_at.isoformat(),
             digest.model_dump_json()),
        )
        self.conn.commit()

    def close(self) -> None:
        self.conn.close()
