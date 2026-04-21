#!/usr/bin/env python3
"""
Inject battle card JSON data into index.html.

After the pipeline generates fresh JSON files in data/battlecards/json/,
this script reads them and replaces the `const competitors = {}` block
in index.html so the static SPA has current data without a build server.

Run manually: python scripts/inject_battlecards.py
Run in CI:   Automatically called by .github/workflows/competitive-intel.yml
"""

import json
import re
from pathlib import Path


def inject_battlecards() -> None:
    json_dir = Path("data/battlecards/json")
    index_path = Path("index.html")

    if not index_path.exists():
        print("index.html not found — run from the project root")
        return

    cards: dict = {}
    if json_dir.exists():
        for json_file in sorted(json_dir.glob("*.json")):
            slug = json_file.stem
            if slug == ".gitkeep":
                continue
            try:
                with open(json_file, encoding="utf-8") as f:
                    raw = json.load(f)
                cards[slug] = _transform_battlecard(raw, slug)
                print(f"  Loaded: {slug}")
            except Exception as exc:
                print(f"  Warning: could not load {json_file.name}: {exc}")

    if not cards:
        print("No battle card JSON files found — keeping existing seed data in index.html")
        return

    # Build the new JS block
    js_lines = ["const competitors = {};"]
    for slug, data in cards.items():
        js_lines.append(f"\n// {data.get('name', slug)}")
        js_lines.append(
            f"competitors[{json.dumps(slug)}] = {json.dumps(data, indent=2, ensure_ascii=False)};"
        )
    new_js_block = "\n".join(js_lines)

    html = index_path.read_text(encoding="utf-8")

    pattern = (
        r"(// -- DATA \(loaded from JSON files at build time.*?\n)"
        r"(const competitors = \{\};.*?)"
        r"(// -- RENDERING --)"
    )
    new_html, count = re.subn(pattern, rf"\1{new_js_block}\n\n\3", html, flags=re.DOTALL)

    if count == 0:
        print("Warning: could not find data block sentinels in index.html — no injection performed")
        return

    index_path.write_text(new_html, encoding="utf-8")
    print(f"Injected {len(cards)} battle card(s) into index.html")


def _transform_battlecard(raw: dict, slug: str) -> dict:
    """Transform the pipeline's BattleCard Pydantic output into the flat UI format."""
    profile = raw.get("company_profile", {})
    positioning = raw.get("positioning", {})
    analysis = raw.get("analysis", {})
    launches = raw.get("feature_launches", [])
    sources = raw.get("all_sources", [])

    def val(obj):
        if obj is None:
            return None
        if isinstance(obj, dict):
            return obj.get("value")
        return str(obj)

    def conf(obj):
        if obj is None:
            return "medium"
        if isinstance(obj, dict):
            return obj.get("confidence", "medium")
        return "medium"

    def list_vals(lst):
        return [val(item) for item in (lst or []) if val(item)]

    return {
        "name": profile.get("name", slug),
        "slug": slug,
        "website": profile.get("website", ""),
        "risk": analysis.get("territory_risk", "medium"),
        "category": val(positioning.get("primary_category")) or "Headless CMS",
        "secondary_category": val(positioning.get("secondary_category")) or "",
        "hq": val(profile.get("hq_location")) or "Unknown",
        "founded": val(profile.get("founding_year")) or "Unknown",
        "employees": {
            "value": val(profile.get("employee_count")) or "Unknown",
            "estimated": profile.get("employee_count", {}).get("is_estimated", True)
            if isinstance(profile.get("employee_count"), dict) else True,
            "confidence": conf(profile.get("employee_count")),
        },
        "revenue": {
            "value": val(profile.get("estimated_revenue")) or "Not disclosed",
            "estimated": True,
            "confidence": conf(profile.get("estimated_revenue")),
        },
        "status": val(profile.get("public_private")) or "Private",
        "ticker": profile.get("ticker_symbol"),
        "funding": val(profile.get("funding_stage")),
        "key_customers": [],
        "description": val(profile.get("description")) or "",
        "positioning": val(positioning.get("positioning_statement")) or "",
        "value_prop": val(positioning.get("core_value_proposition")) or "",
        "segment_focus": val(positioning.get("market_segment_focus")) or "",
        "pricing": val(positioning.get("pricing_model_notes")) or "",
        "key_products": list_vals(profile.get("key_products", [])),
        "target_customers": val(profile.get("target_customers")) or "",
        "geography": val(profile.get("geography_focus")) or "",
        "messaging_themes": list_vals(positioning.get("key_messaging_themes", [])),
        "differentiators": list_vals(positioning.get("claimed_differentiators", [])),
        "feature_launches": [
            {
                "name": fl.get("feature_name", ""),
                "date": (fl.get("launch_date") or fl.get("announcement_date") or "")[:10],
                "summary": fl.get("summary", ""),
                "category": fl.get("category", ""),
                "importance": fl.get("strategic_importance", "medium"),
                "confidence": fl.get("confidence", "medium"),
                "source": fl.get("source_url", ""),
                "persona": fl.get("affected_persona", ""),
            }
            for fl in launches
        ],
        "why_buy": list_vals(analysis.get("why_customers_buy", [])),
        "strengths": list_vals(analysis.get("likely_strengths", [])),
        "weaknesses": list_vals(analysis.get("likely_weaknesses", [])),
        "where_we_win": analysis.get("where_we_win", []),
        "where_we_lose": analysis.get("where_we_lose", []),
        "objections": [
            {"q": o.get("objection", ""), "a": o.get("response", "")}
            for o in analysis.get("objection_handling", [])
        ],
        "positioning_angles": analysis.get("competitive_positioning_angles", []),
        "risk_notes": analysis.get("territory_risk_notes", ""),
        "sources": [
            {
                "title": s.get("title", s.get("url", "")),
                "url": s.get("url", ""),
                "type": s.get("source_type", "official_website"),
                "confidence": s.get("confidence", "medium"),
            }
            for s in sources
        ],
    }


if __name__ == "__main__":
    inject_battlecards()
