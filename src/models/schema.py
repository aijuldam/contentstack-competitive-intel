"""
Core data models for the Competitive Intelligence system.

Every model includes timestamps, provenance, and freshness metadata.
Confidence scores and source evidence are attached at the field level
where it matters (company facts, positioning claims, feature launches).
"""

from __future__ import annotations

import uuid
from datetime import datetime, timezone
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


# ---------------------------------------------------------------------------
# Enums
# ---------------------------------------------------------------------------

class ConfidenceLevel(str, Enum):
    HIGH = "high"           # Direct, authoritative source (earnings, official page)
    MEDIUM = "medium"       # Reputable secondary source
    LOW = "low"             # Inferred or single weak source
    SPECULATIVE = "speculative"  # Hypothesis, no hard evidence


class SourceType(str, Enum):
    OFFICIAL_WEBSITE = "official_website"
    PRICING_PAGE = "pricing_page"
    PRODUCT_PAGE = "product_page"
    BLOG_POST = "blog_post"
    PRESS_RELEASE = "press_release"
    EARNINGS_REPORT = "earnings_report"
    SEC_FILING = "sec_filing"
    NEWS_ARTICLE = "news_article"
    JOB_POSTING = "job_posting"
    SOCIAL_MEDIA = "social_media"
    REVIEW_SITE = "review_site"
    ANALYST_REPORT = "analyst_report"
    DOCS = "docs"
    CHANGELOG = "changelog"
    CAREERS_PAGE = "careers_page"
    INVESTOR_RELATIONS = "investor_relations"
    THIRD_PARTY_DATA = "third_party_data"
    INFERRED = "inferred"


class ChangeType(str, Enum):
    ADDED = "added"
    UPDATED = "updated"
    REMOVED = "removed"
    STALE_REFRESH = "stale_refresh"
    CONFIDENCE_CHANGE = "confidence_change"


class RiskLevel(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class ReviewStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    NEEDS_MORE_INFO = "needs_more_info"


class StrategicImportance(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


# ---------------------------------------------------------------------------
# Source & Confidence
# ---------------------------------------------------------------------------

class SourceEvidence(BaseModel):
    """Every material fact must carry at least one source."""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    url: str
    title: str
    source_type: SourceType
    date_found: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    date_published: Optional[datetime] = None
    snippet: Optional[str] = None
    confidence: ConfidenceLevel = ConfidenceLevel.MEDIUM

    def is_authoritative(self) -> bool:
        return self.source_type in {
            SourceType.EARNINGS_REPORT,
            SourceType.SEC_FILING,
            SourceType.INVESTOR_RELATIONS,
            SourceType.OFFICIAL_WEBSITE,
        }


class ConfidenceAssessment(BaseModel):
    """Wraps a value with confidence metadata."""
    value: str
    confidence: ConfidenceLevel
    sources: list[SourceEvidence] = Field(default_factory=list)
    is_estimated: bool = False
    estimation_basis: Optional[str] = None
    last_verified: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    notes: Optional[str] = None


class FieldFreshness(BaseModel):
    """Track when each field was last confirmed."""
    field_name: str
    last_updated: datetime
    last_confirmed: datetime
    staleness_threshold_days: int = 30
    is_stale: bool = False

    def check_staleness(self) -> bool:
        age = (datetime.now(timezone.utc) - self.last_confirmed).days
        self.is_stale = age > self.staleness_threshold_days
        return self.is_stale


# ---------------------------------------------------------------------------
# Company Profile
# ---------------------------------------------------------------------------

class CompanyProfile(BaseModel):
    name: str
    website: str
    hq_location: Optional[ConfidenceAssessment] = None
    founding_year: Optional[ConfidenceAssessment] = None
    employee_count: Optional[ConfidenceAssessment] = None
    estimated_revenue: Optional[ConfidenceAssessment] = None
    public_private: Optional[ConfidenceAssessment] = None
    funding_stage: Optional[ConfidenceAssessment] = None
    ticker_symbol: Optional[str] = None
    investor_relations_url: Optional[str] = None
    description: Optional[ConfidenceAssessment] = None
    key_products: list[ConfidenceAssessment] = Field(default_factory=list)
    target_customers: Optional[ConfidenceAssessment] = None
    icp: Optional[ConfidenceAssessment] = None
    geography_focus: Optional[ConfidenceAssessment] = None


# ---------------------------------------------------------------------------
# Positioning
# ---------------------------------------------------------------------------

class Positioning(BaseModel):
    primary_category: Optional[ConfidenceAssessment] = None
    secondary_category: Optional[ConfidenceAssessment] = None
    positioning_statement: Optional[ConfidenceAssessment] = None
    key_messaging_themes: list[ConfidenceAssessment] = Field(default_factory=list)
    core_value_proposition: Optional[ConfidenceAssessment] = None
    main_use_cases: list[ConfidenceAssessment] = Field(default_factory=list)
    claimed_differentiators: list[ConfidenceAssessment] = Field(default_factory=list)
    market_segment_focus: Optional[ConfidenceAssessment] = None  # enterprise/mid-market/SMB
    pricing_model_notes: Optional[ConfidenceAssessment] = None


# ---------------------------------------------------------------------------
# Feature Launches
# ---------------------------------------------------------------------------

class FeatureLaunch(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    feature_name: str
    launch_date: Optional[datetime] = None
    announcement_date: Optional[datetime] = None
    summary: str
    source_url: str
    category: Optional[str] = None
    affected_persona: Optional[str] = None
    affected_use_case: Optional[str] = None
    strategic_importance: StrategicImportance = StrategicImportance.MEDIUM
    confidence: ConfidenceLevel = ConfidenceLevel.MEDIUM
    sources: list[SourceEvidence] = Field(default_factory=list)


# ---------------------------------------------------------------------------
# Battle Card
# ---------------------------------------------------------------------------

class BattleCardAnalysis(BaseModel):
    why_customers_buy: list[ConfidenceAssessment] = Field(default_factory=list)
    likely_strengths: list[ConfidenceAssessment] = Field(default_factory=list)
    likely_weaknesses: list[ConfidenceAssessment] = Field(default_factory=list)
    where_we_win: list[str] = Field(default_factory=list)
    where_we_lose: list[str] = Field(default_factory=list)
    objection_handling: list[dict[str, str]] = Field(default_factory=list)  # objection -> response
    competitive_positioning_angles: list[str] = Field(default_factory=list)
    territory_risk: RiskLevel = RiskLevel.MEDIUM
    territory_risk_notes: Optional[str] = None


class BattleCard(BaseModel):
    """The full battle card for one competitor."""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    competitor_id: str
    company_profile: CompanyProfile
    positioning: Positioning
    feature_launches: list[FeatureLaunch] = Field(default_factory=list)
    analysis: BattleCardAnalysis = Field(default_factory=BattleCardAnalysis)
    all_sources: list[SourceEvidence] = Field(default_factory=list)
    field_freshness: list[FieldFreshness] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    version: int = 1


# ---------------------------------------------------------------------------
# Competitor (top-level entity)
# ---------------------------------------------------------------------------

class TrackedUrls(BaseModel):
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


class Competitor(BaseModel):
    """Top-level competitor entity with tracking config."""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    slug: str  # filesystem-safe identifier
    website: str
    tracked_urls: TrackedUrls = Field(default_factory=TrackedUrls)
    is_priority: bool = False
    monitoring_enabled: bool = True
    check_interval_hours: int = 24
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    last_checked: Optional[datetime] = None
    battle_card: Optional[BattleCard] = None


# ---------------------------------------------------------------------------
# Monitoring & Change Tracking
# ---------------------------------------------------------------------------

class MonitoringEvent(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    competitor_id: str
    url: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    content_hash: str
    previous_hash: Optional[str] = None
    has_changed: bool = False
    diff_summary: Optional[str] = None
    snapshot_path: Optional[str] = None


class ChangeLogEntry(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    competitor_id: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    change_type: ChangeType
    section: str  # e.g. "company_profile.employee_count"
    field: str
    old_value: Optional[str] = None
    new_value: Optional[str] = None
    source: Optional[SourceEvidence] = None
    confidence: ConfidenceLevel = ConfidenceLevel.MEDIUM
    auto_applied: bool = True
    notes: Optional[str] = None


# ---------------------------------------------------------------------------
# Review Queue
# ---------------------------------------------------------------------------

class ReviewQueueItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    competitor_id: str
    competitor_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    section: str
    field: str
    proposed_value: str
    current_value: Optional[str] = None
    confidence: ConfidenceLevel
    sources: list[SourceEvidence] = Field(default_factory=list)
    reason: str  # why flagged for review
    status: ReviewStatus = ReviewStatus.PENDING
    reviewer_notes: Optional[str] = None


# ---------------------------------------------------------------------------
# Weekly Digest
# ---------------------------------------------------------------------------

class DigestEntry(BaseModel):
    competitor_name: str
    competitor_id: str
    changes: list[ChangeLogEntry] = Field(default_factory=list)
    new_launches: list[FeatureLaunch] = Field(default_factory=list)
    risk_level_change: Optional[str] = None
    highlights: list[str] = Field(default_factory=list)


class WeeklyDigest(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    period_start: datetime
    period_end: datetime
    generated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    entries: list[DigestEntry] = Field(default_factory=list)
    summary: Optional[str] = None
    action_items: list[str] = Field(default_factory=list)
    stale_fields_count: int = 0
    pending_reviews_count: int = 0
