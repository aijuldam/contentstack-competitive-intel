"""
Configuration loader.

Reads config/config.yaml and exposes typed settings used by all agents
and connectors.
"""

from __future__ import annotations

from pathlib import Path
from typing import Optional

import yaml
from pydantic import BaseModel, Field


# ---------------------------------------------------------------------------
# Config sub-models
# ---------------------------------------------------------------------------

class OurCompanyConfig(BaseModel):
    name: str
    description: str = ""
    category: str = ""
    icp: str = ""
    strengths: list[str] = Field(default_factory=list)
    weaknesses: list[str] = Field(default_factory=list)


class MonitoringConfig(BaseModel):
    default_check_interval_hours: int = 24
    priority_check_interval_hours: int = 12
    staleness_threshold_days: int = 30
    max_concurrent_requests: int = 5
    request_delay_seconds: float = 2.0
    request_timeout_seconds: int = 30
    respect_robots_txt: bool = True
    user_agent: str = "CompetitiveIntelBot/0.1"


class LLMConfig(BaseModel):
    provider: str = "anthropic"
    model: str = "claude-sonnet-4-20250514"
    max_tokens: int = 4096
    temperature: float = 0.2


class StorageConfig(BaseModel):
    database_path: str = "data/competitive_intel.db"
    snapshots_dir: str = "data/snapshots"
    battlecards_dir: str = "data/battlecards"
    changelogs_dir: str = "data/changelogs"
    reports_dir: str = "data/reports"


class OutputConfig(BaseModel):
    json_dir: str = "data/battlecards/json"
    markdown_dir: str = "data/battlecards/markdown"
    digest_dir: str = "data/reports"


class ScheduleConfig(BaseModel):
    full_refresh_cron: str = "0 6 * * 1"
    priority_check_cron: str = "0 */12 * * *"
    weekly_digest_cron: str = "0 8 * * 1"
    staleness_check_cron: str = "0 7 * * *"


class TrackedUrlsConfig(BaseModel):
    homepage: Optional[str] = None
    pricing: Optional[str] = None
    product: Optional[str] = None
    docs: Optional[str] = None
    blog: Optional[str] = None
    investor_relations: Optional[str] = None
    careers: Optional[str] = None
    changelog: Optional[str] = None
    social_profiles: list[str] = Field(default_factory=list)
    custom: dict[str, str] = Field(default_factory=dict)


class CompetitorConfig(BaseModel):
    name: str
    slug: str
    website: str
    is_priority: bool = False
    tracked_urls: TrackedUrlsConfig = Field(default_factory=TrackedUrlsConfig)


class Config(BaseModel):
    our_company: OurCompanyConfig
    monitoring: MonitoringConfig = Field(default_factory=MonitoringConfig)
    llm: LLMConfig = Field(default_factory=LLMConfig)
    storage: StorageConfig = Field(default_factory=StorageConfig)
    output: OutputConfig = Field(default_factory=OutputConfig)
    schedule: ScheduleConfig = Field(default_factory=ScheduleConfig)
    competitors: list[CompetitorConfig] = Field(default_factory=list)


# ---------------------------------------------------------------------------
# Loader
# ---------------------------------------------------------------------------

def load_config(path: str | Path = "config/config.yaml") -> Config:
    path = Path(path)
    if not path.exists():
        raise FileNotFoundError(f"Config file not found: {path}")
    with open(path) as f:
        raw = yaml.safe_load(f)
    return Config.model_validate(raw)
