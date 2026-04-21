"""
Battle Card Writer Agent

Assembles all intelligence into a coherent BattleCard model.
Handles incremental updates — merges new data with existing cards
rather than recreating from scratch.
"""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

from ..models import (
    BattleCard,
    BattleCardAnalysis,
    ChangeLogEntry,
    ChangeType,
    CompanyProfile,
    ConfidenceAssessment,
    ConfidenceLevel,
    FeatureLaunch,
    FieldFreshness,
    Positioning,
    RiskLevel,
    SourceEvidence,
)
from .base import BaseAgent


class BattleCardWriterAgent(BaseAgent):
    agent_name = "battlecard_writer"

    def create_or_update(
        self,
        competitor_id: str,
        profile: CompanyProfile,
        extracted_data: dict[str, Any],
        analysis: dict[str, Any],
        new_launches: list[FeatureLaunch],
        new_sources: list[SourceEvidence],
        existing_card: BattleCard | None = None,
    ) -> tuple[BattleCard, list[ChangeLogEntry]]:
        """
        Create a new battle card or incrementally update an existing one.

        Returns the updated card and a list of changes made.
        """
        changes: list[ChangeLogEntry] = []
        now = datetime.now(timezone.utc)

        if existing_card:
            card = existing_card
            card.version += 1
            card.updated_at = now
            self.logger.info(
                f"Updating battle card v{card.version} for {profile.name}"
            )
        else:
            card = BattleCard(
                competitor_id=competitor_id,
                company_profile=profile,
                positioning=Positioning(),
                created_at=now,
                updated_at=now,
            )
            self.logger.info(f"Creating new battle card for {profile.name}")

        # Update profile
        card.company_profile = profile

        # Update positioning
        self._update_positioning(card, extracted_data, changes, competitor_id)

        # Merge feature launches (dedup by name)
        self._merge_launches(card, new_launches, changes, competitor_id)

        # Update analysis
        self._update_analysis(card, analysis, changes, competitor_id)

        # Merge sources
        existing_urls = {s.url for s in card.all_sources}
        for source in new_sources:
            if source.url not in existing_urls:
                card.all_sources.append(source)
                existing_urls.add(source.url)

        # Update freshness
        self._update_freshness(card)

        return card, changes

    def _update_positioning(
        self,
        card: BattleCard,
        extracted: dict[str, Any],
        changes: list[ChangeLogEntry],
        competitor_id: str,
    ) -> None:
        positioning_facts = extracted.get("positioning", [])
        for fact in positioning_facts:
            field = fact.get("field", "")
            value = fact.get("value", "")
            confidence = ConfidenceLevel(fact.get("confidence", "medium"))
            assessment = ConfidenceAssessment(value=value, confidence=confidence)

            field_map = {
                "positioning_statement": "positioning_statement",
                "value_proposition": "core_value_proposition",
                "market_segment": "market_segment_focus",
                "pricing_model": "pricing_model_notes",
            }
            list_fields = {
                "messaging_theme": "key_messaging_themes",
                "use_case": "main_use_cases",
                "differentiator": "claimed_differentiators",
            }

            if field in field_map:
                attr = field_map[field]
                old = getattr(card.positioning, attr)
                if old is None or old.value != value:
                    changes.append(ChangeLogEntry(
                        competitor_id=competitor_id,
                        change_type=ChangeType.UPDATED if old else ChangeType.ADDED,
                        section="positioning",
                        field=attr,
                        old_value=old.value if old else None,
                        new_value=value,
                        confidence=confidence,
                    ))
                    setattr(card.positioning, attr, assessment)

            elif field in list_fields:
                attr = list_fields[field]
                existing_vals = [a.value for a in getattr(card.positioning, attr)]
                if value not in existing_vals:
                    getattr(card.positioning, attr).append(assessment)
                    changes.append(ChangeLogEntry(
                        competitor_id=competitor_id,
                        change_type=ChangeType.ADDED,
                        section="positioning",
                        field=f"{attr}[]",
                        new_value=value,
                        confidence=confidence,
                    ))

    def _merge_launches(
        self,
        card: BattleCard,
        new_launches: list[FeatureLaunch],
        changes: list[ChangeLogEntry],
        competitor_id: str,
    ) -> None:
        existing_names = {fl.feature_name.lower() for fl in card.feature_launches}
        for launch in new_launches:
            if launch.feature_name.lower() not in existing_names:
                card.feature_launches.append(launch)
                existing_names.add(launch.feature_name.lower())
                changes.append(ChangeLogEntry(
                    competitor_id=competitor_id,
                    change_type=ChangeType.ADDED,
                    section="feature_launches",
                    field=launch.feature_name,
                    new_value=launch.summary,
                    confidence=launch.confidence,
                ))

    def _update_analysis(
        self,
        card: BattleCard,
        analysis: dict[str, Any],
        changes: list[ChangeLogEntry],
        competitor_id: str,
    ) -> None:
        if not analysis:
            return

        a = card.analysis

        # Update territory risk
        new_risk = analysis.get("territory_risk", "medium")
        try:
            new_risk_level = RiskLevel(new_risk)
        except ValueError:
            new_risk_level = RiskLevel.MEDIUM

        if a.territory_risk != new_risk_level:
            changes.append(ChangeLogEntry(
                competitor_id=competitor_id,
                change_type=ChangeType.UPDATED,
                section="analysis",
                field="territory_risk",
                old_value=a.territory_risk.value,
                new_value=new_risk_level.value,
                confidence=ConfidenceLevel.MEDIUM,
            ))
            a.territory_risk = new_risk_level
        a.territory_risk_notes = analysis.get("territory_risk_explanation")

        # Update where_we_win / where_we_lose
        a.where_we_win = analysis.get("where_we_win", a.where_we_win)
        a.where_we_lose = analysis.get("where_we_lose", a.where_we_lose)

        # Update competitive angles
        a.competitive_positioning_angles = analysis.get(
            "competitive_angles", a.competitive_positioning_angles
        )

        # Update objection handling
        objections = analysis.get("objection_handling", [])
        if objections:
            a.objection_handling = [
                {"objection": o["objection"], "response": o["response"]}
                for o in objections
            ]

        # Update strengths / weaknesses / why_customers_buy
        for key, attr in [
            ("likely_strengths", "likely_strengths"),
            ("likely_weaknesses", "likely_weaknesses"),
            ("why_customers_buy", "why_customers_buy"),
        ]:
            items = analysis.get(key, [])
            if items:
                assessments = []
                for item in items:
                    if isinstance(item, dict):
                        assessments.append(ConfidenceAssessment(
                            value=item["value"],
                            confidence=ConfidenceLevel(item.get("confidence", "medium")),
                        ))
                    else:
                        assessments.append(ConfidenceAssessment(
                            value=str(item),
                            confidence=ConfidenceLevel.MEDIUM,
                        ))
                setattr(a, attr, assessments)

    def _update_freshness(self, card: BattleCard) -> None:
        now = datetime.now(timezone.utc)
        freshness_map: dict[str, FieldFreshness] = {
            f.field_name: f for f in card.field_freshness
        }

        sections = [
            "company_profile", "positioning", "analysis",
            "feature_launches", "all_sources",
        ]
        for section in sections:
            if section in freshness_map:
                freshness_map[section].last_confirmed = now
                freshness_map[section].check_staleness()
            else:
                card.field_freshness.append(FieldFreshness(
                    field_name=section,
                    last_updated=now,
                    last_confirmed=now,
                    staleness_threshold_days=self.config.monitoring.staleness_threshold_days,
                ))
