#!/usr/bin/env python3
"""
Contentstack Competitive Intelligence Agent — CLI entry point.

Usage:
    python main.py run                     # Full cycle, all competitors
    python main.py run --priority          # Priority competitors only
    python main.py run --force             # Force re-process even if no changes
    python main.py run --competitor twilio  # Single competitor by slug
    python main.py digest                  # Generate weekly digest
    python main.py digest --days 14        # Custom period
    python main.py staleness               # Check for stale fields
    python main.py seed                    # Seed competitors from config
    python main.py review                  # Show pending review queue
    python main.py schedule                # Run on schedule (blocking)
"""

import argparse
import sys
import time

from src.orchestrator import Orchestrator
from src.utils.config import load_config
from src.utils.logging import setup_logging, get_logger

logger = get_logger("main")


def cmd_run(args: argparse.Namespace) -> None:
    config = load_config(args.config)
    orch = Orchestrator(config)

    try:
        if args.competitor:
            orch.seed_competitors()
            comp = orch.db.get_competitor_by_slug(args.competitor)
            if not comp:
                logger.error(f"Competitor '{args.competitor}' not found")
                sys.exit(1)
            orch.process_competitor(comp, force=args.force)
        else:
            orch.run_full_cycle(priority_only=args.priority, force=args.force)
    finally:
        orch.close()


def cmd_digest(args: argparse.Namespace) -> None:
    config = load_config(args.config)
    orch = Orchestrator(config)
    try:
        path = orch.generate_digest(period_days=args.days)
        print(f"Digest written to: {path}")
    finally:
        orch.close()


def cmd_staleness(args: argparse.Namespace) -> None:
    config = load_config(args.config)
    orch = Orchestrator(config)
    try:
        stale = orch.check_staleness()
        if stale:
            print(f"\n{len(stale)} stale field(s) found:")
            for s in stale:
                print(f"  - {s}")
        else:
            print("All fields are fresh.")
    finally:
        orch.close()


def cmd_seed(args: argparse.Namespace) -> None:
    config = load_config(args.config)
    orch = Orchestrator(config)
    try:
        orch.seed_competitors()
        competitors = orch.db.list_competitors()
        print(f"Seeded {len(competitors)} competitor(s):")
        for c in competitors:
            priority = " [PRIORITY]" if c.is_priority else ""
            print(f"  - {c.name} ({c.slug}){priority}")
    finally:
        orch.close()


def cmd_review(args: argparse.Namespace) -> None:
    config = load_config(args.config)
    orch = Orchestrator(config)
    try:
        items = orch.db.get_pending_reviews()
        if not items:
            print("No pending review items.")
            return

        print(f"\n{len(items)} pending review item(s):\n")
        for item in items:
            print(f"  [{item.confidence.value.upper()}] {item.competitor_name}")
            print(f"    Section: {item.section}.{item.field}")
            print(f"    Proposed: {item.proposed_value}")
            if item.current_value:
                print(f"    Current:  {item.current_value}")
            print(f"    Reason:   {item.reason}")
            print()
    finally:
        orch.close()


def cmd_schedule(args: argparse.Namespace) -> None:
    """Simple polling scheduler. For production, use cron or a proper scheduler."""
    config = load_config(args.config)
    interval = args.interval * 3600  # hours to seconds

    logger.info(f"Starting scheduler with {args.interval}h interval")
    while True:
        try:
            orch = Orchestrator(config)
            orch.run_full_cycle(priority_only=args.priority)
            orch.close()
        except Exception as e:
            logger.error(f"Scheduled run failed: {e}", exc_info=True)

        logger.info(f"Sleeping for {args.interval} hour(s)...")
        time.sleep(interval)


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Competitive Intelligence Agent",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument(
        "--config", default="config/config.yaml",
        help="Path to config file (default: config/config.yaml)",
    )
    parser.add_argument(
        "--log-level", default="INFO",
        choices=["DEBUG", "INFO", "WARNING", "ERROR"],
    )

    sub = parser.add_subparsers(dest="command", required=True)

    # run
    p_run = sub.add_parser("run", help="Run competitive intelligence pipeline")
    p_run.add_argument("--priority", action="store_true", help="Priority competitors only")
    p_run.add_argument("--force", action="store_true", help="Force re-process")
    p_run.add_argument("--competitor", type=str, help="Single competitor slug")

    # digest
    p_digest = sub.add_parser("digest", help="Generate weekly digest")
    p_digest.add_argument("--days", type=int, default=7, help="Period in days")

    # staleness
    sub.add_parser("staleness", help="Check for stale fields")

    # seed
    sub.add_parser("seed", help="Seed competitors from config")

    # review
    sub.add_parser("review", help="Show pending review queue")

    # schedule
    p_sched = sub.add_parser("schedule", help="Run on schedule")
    p_sched.add_argument("--interval", type=float, default=24, help="Hours between runs")
    p_sched.add_argument("--priority", action="store_true")

    args = parser.parse_args()
    setup_logging(args.log_level)

    commands = {
        "run": cmd_run,
        "digest": cmd_digest,
        "staleness": cmd_staleness,
        "seed": cmd_seed,
        "review": cmd_review,
        "schedule": cmd_schedule,
    }
    commands[args.command](args)


if __name__ == "__main__":
    main()
