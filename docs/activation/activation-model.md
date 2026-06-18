# Activation Model — Go-to-Market Taste

## Activation Definition

A user is **activated** when they have completed all three milestones:

1. **Project created** — intake form submitted and saved
2. **Messaging Foundation generated** — AI narrative generation completed
3. **Asset opened** — at least one GTM asset viewed

An activated user has experienced the full value loop. Everything before this is onboarding friction. Everything after is retention.

---

## Funnel Stages

```
Acquisition  →  Onboarding  →  Activation  →  Conversion  →  Retention
```

| Stage | Entry event | Exit event | Drop-off signal |
|---|---|---|---|
| Acquisition | Landing page visit | Signup completed | Bounce on marketing page |
| Onboarding | Signup completed | First project created | No project after 48h |
| Activation | Project created | Asset opened | Foundation generated but no asset opened |
| Conversion | Foundation generated | Paid plan purchased | Paywall hit but no upgrade |
| Retention | First asset opened | Second project created | No return within 14 days |

---

## KPIs

### Primary activation metrics

| Metric | Definition | Target (launch) | Target (month 3) |
|---|---|---|---|
| Activation rate | % of signups who reach asset_opened | — | 40% |
| Time to activate | Median hours from signup to asset_opened | — | < 24h |
| Onboarding completion | % who create a project within 48h of signup | — | 60% |
| Foundation completion | % of project creators who generate a foundation | — | 75% |
| Asset open rate | % of foundation generators who open an asset | — | 80% |

### Conversion metrics

| Metric | Definition |
|---|---|
| Free → paid conversion | % of activated free users who upgrade within 30 days |
| Paywall CTR | % of paywall hits that result in upgrade flow start |
| Upgrade flow completion | % of upgrade flow starts that result in payment |

### Retention metrics

| Metric | Definition |
|---|---|
| D7 retention | % of activated users who return within 7 days |
| D30 retention | % of activated users who return within 30 days |
| Projects per user (30d) | Average number of projects created per activated user |

---

## Friction Hypotheses

These are hypotheses about where and why users drop off. Each maps to one or more experiments in the backlog.

### H1 — Intake form is intimidating without context
**Hypothesis:** Users land on the new project form with no sense of what good input looks like, write low-quality answers or abandon.
**Signal:** High form start → low submit rate; short/thin intake content.
**Experiments:** EXP-002 (sample prefill), EXP-001 (progress steps).

### H2 — Users don't understand what they'll get
**Hypothesis:** The outcome of completing the form (a Messaging Foundation + 3 assets) is not concrete enough before they start.
**Signal:** Low intake form start rate from project list page.
**Experiments:** EXP-003 (outcome preview on intake page — planned).

### H3 — Generation wait creates anxiety
**Hypothesis:** AI generation takes 15–30s. Without clear progress feedback, users reload or abandon.
**Signal:** Foundation generation start → generation complete drop-off.
**Experiments:** EXP-004 (generation progress messaging — planned).

### H4 — Foundation review is a dead end
**Hypothesis:** After generating the foundation, users aren't sure whether to approve it or what approving does.
**Signal:** Foundation generated → foundation approved drop-off.
**Experiments:** EXP-005 (foundation CTA copy — partially implemented via FOUNDATION_CTA_COPY flag).

### H5 — Paywall kills momentum at the wrong moment
**Hypothesis:** Hitting the paywall before experiencing value causes churn, not conversion. Users need to see at least one asset before upgrading.
**Signal:** Upgrade rate for users who hit paywall pre-activation < upgrade rate for activated users.
**Experiments:** Paywall placement strategy (planned).

### H6 — Empty projects page has no pull
**Hypothesis:** New users who click "Projects" and see an empty state don't understand the next step.
**Signal:** Low projects → new project click rate for new users.
**Experiments:** Empty state copy optimization, inline CTA prominence.

### H7 — Users don't return after generating a foundation
**Hypothesis:** Users generate a foundation and leave, intending to return but not finding a reason to.
**Signal:** D7 retention < 40% for users who completed foundation but didn't open an asset.
**Experiments:** Lifecycle nudge emails (welcome, foundation-nudge — implemented in messaging library).

---

## Instrumented Events

These analytics events are tracked and power activation measurement.

| Event | Trigger | Stage |
|---|---|---|
| `project_created` | Intake form submitted | Onboarding → Activation |
| `messaging_foundation_generated` | Foundation generation complete | Activation |
| `messaging_foundation_reviewed` | Foundation narrative page viewed | Activation |
| `messaging_foundation_approved` | Approve action confirmed | Activation |
| `asset_opened` | Asset page viewed | Activation complete |
| `paywall_hit` | Upgrade prompt shown | Conversion |
| `upgrade_started` | Checkout initiated | Conversion |
| `upgrade_completed` | Payment confirmed | Conversion |

---

## Activation Funnel Benchmarks (SaaS)

For reference when setting targets post-launch:

- B2B SaaS median activation rate: 25–40% of signups within 30 days
- Products with strong sample/template flows (Notion, Canva): 50–65%
- Products requiring user input to generate value (our model): 30–45% realistic target
- Time to activate: < 24h is a strong signal; > 72h predicts churn

---

## Review Cadence

| Cadence | Action |
|---|---|
| Weekly (launch month) | Review funnel drop-off by stage; flag any step below 60% pass-through |
| Bi-weekly | Review active experiment results; decide continue/conclude/kill |
| Monthly | Update experiment registry; re-prioritize backlog; update KPI targets |
| Quarterly | Review friction hypotheses; retire ones disproven; add new ones |
