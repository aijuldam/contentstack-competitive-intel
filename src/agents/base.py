"""
Base agent class. All agents share access to the database, config,
an LLM client, and a logger.
"""

from __future__ import annotations

import json
import os
from typing import Any, Optional

import anthropic

from ..storage.database import Database
from ..utils.config import Config
from ..utils.logging import get_logger


class BaseAgent:
    agent_name: str = "base"

    def __init__(self, config: Config, db: Database):
        self.config = config
        self.db = db
        self.logger = get_logger(f"agents.{self.agent_name}")
        self._client: Optional[anthropic.Anthropic] = None

    @property
    def llm(self) -> anthropic.Anthropic:
        if self._client is None:
            self._client = anthropic.Anthropic()
        return self._client

    def call_llm(
        self,
        system: str,
        prompt: str,
        max_tokens: Optional[int] = None,
        temperature: Optional[float] = None,
    ) -> str:
        """Call the LLM and return the text response."""
        resp = self.llm.messages.create(
            model=self.config.llm.model,
            max_tokens=max_tokens or self.config.llm.max_tokens,
            temperature=temperature if temperature is not None else self.config.llm.temperature,
            system=system,
            messages=[{"role": "user", "content": prompt}],
        )
        return resp.content[0].text

    def call_llm_json(
        self,
        system: str,
        prompt: str,
        max_tokens: Optional[int] = None,
    ) -> Any:
        """Call the LLM and parse the response as JSON."""
        raw = self.call_llm(system, prompt, max_tokens)
        # Strip markdown fences if present
        text = raw.strip()
        if text.startswith("```"):
            lines = text.splitlines()
            # Remove first and last fence lines
            if lines[0].startswith("```"):
                lines = lines[1:]
            if lines and lines[-1].strip() == "```":
                lines = lines[:-1]
            text = "\n".join(lines)
        return json.loads(text)
