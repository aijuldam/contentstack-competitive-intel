"""JSON output writer for battle cards."""

from __future__ import annotations

import json
from pathlib import Path

from ..models import BattleCard


class JSONOutputWriter:
    def __init__(self, output_dir: str = "data/battlecards/json"):
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)

    def write(self, slug: str, card: BattleCard) -> Path:
        path = self.output_dir / f"{slug}.json"
        data = json.loads(card.model_dump_json())
        with open(path, "w") as f:
            json.dump(data, f, indent=2, default=str)
        return path

    def write_all(self, cards: dict[str, BattleCard]) -> list[Path]:
        return [self.write(slug, card) for slug, card in cards.items()]
