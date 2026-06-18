# Post-Launch Feedback & Iteration Operating System
# Go-to-Market Taste

---

## 1. Recommended Operating Model

### Signal sources by priority

| Source | Signal type | Volume (launch month) | Review cadence |
|---|---|---|---|
| Email replies (lifecycle + outreach) | Qual: confusion, friction, delight | Low–medium | Daily |
| Direct messages (LinkedIn, Slack) | Qual: intent, objections | Low | Daily |
| Founder conversations / user interviews | Qual: deep context | Very low (3–5/week) | Weekly synthesis |
| Analytics funnel (when PostHog live) | Quant: drop-off, conversion | Medium | Weekly |
| In-product error logs / Supabase | Quant: errors, failures | Low–medium | Daily |
| Lifecycle message replies | Qual: intent, friction | Low | Daily |
| Internal QA / dogfooding | Quant + qual: bugs, UX | Ongoing | As found |

### What to expect in the first four weeks

**Week 1 — Signal is sparse and high-signal.** Every signup is reachable. Every response matters. Prioritize reading, replying, and interviewing over building.

**Week 2 — Patterns start emerging.** You'll see the same confusion 3–5 times. That's the signal to act on. Single one-off complaints are noise until repeated.

**Week 3–4 — Funnel data becomes meaningful.** With 50+ signups you can start reading drop-off rates by stage. Before that, trust qualitative more than percentages.

### Leanest useful system

- One triage log (`docs/ops/triage-log.md` or a shared Notion page)
- Daily 10-minute read of new feedback + P0 check
- Weekly 30-minute review (see cadence doc)
- Reply to every user message within 24h
- Tag every item before closing

---

## 2. Feedback Taxonomy

Every piece of feedback belongs to exactly one primary category. Tag it when you log it.

### Categories

| Tag | Description | Funnel stage |
|---|---|---|
| `bug` | Something is broken or produces an error | Any |
| `confusion` | User doesn't understand what to do next, or a label/copy is misleading | Onboarding / activation |
| `friction` | User understands but finds the step hard, slow, or frustrating | Onboarding / activation |
| `missing-capability` | User wants to do something the product can't do | Activation / retention |
| `pricing-objection` | User finds the price too high, unclear, or mismatched to value | Conversion |
| `upgrade-friction` | User is willing to pay but can't complete the upgrade | Conversion |
| `generation-quality` | Foundation or asset output is wrong, generic, or misses the point | Activation |
| `asset-usefulness` | Output is technically correct but not useful in practice | Activation / retention |
| `onboarding-friction` | User struggled with signup, workspace setup, or first project creation | Onboarding |
| `positive` | Praise, delight, strong positive reaction — capture verbatim | Any |

### Severity metadata (log alongside category)

| Field | Values |
|---|---|
| `severity` | `p0` / `p1` / `p2` / `p3` (bugs only — see Section 5) |
| `funnel_stage` | `acquisition` / `onboarding` / `activation` / `conversion` / `retention` |
| `frequency` | `unique` / `recurring` / `pattern` (3+ instances) |
| `plan` | `free` / `paid` / `unknown` |
| `source` | `email` / `dm` / `interview` / `analytics` / `internal` / `lifecycle-reply` |

### Connecting feedback to product analytics

When a `confusion` or `friction` item maps to a known funnel stage, check whether the corresponding analytics event shows a drop. Example: three users say the Foundation narrative page is confusing → check `messaging_foundation_reviewed` → `messaging_foundation_approved` conversion in PostHog.

---

## 3. Feedback Capture Model

### Single source of truth

Use `docs/ops/triage-log.md` (or a Notion page if the team prefers). One row per item. Never let feedback live only in an email thread or a mental note.

### Minimum fields per item

```
ID        Auto-increment: FB-001, FB-002, ...
Date      YYYY-MM-DD
Source    email / dm / interview / analytics / internal / lifecycle-reply
Category  (from taxonomy above)
Severity  p0–p3 (bugs) or blank (non-bugs)
Plan      free / paid / unknown
Summary   One sentence: what the user said or what was observed
Quote     Verbatim if available — exact words matter
Stage     Funnel stage where this was encountered
Status    new / triaged / in-progress / done / wont-fix / deferred
Owner     Name or blank
Notes     Resolution, links, follow-up context
```

### What to capture and what to skip

**Always log:**
- Any message where a user expresses confusion, frustration, or asks "how do I…"
- Any bug reproduction, even a one-off
- Any positive feedback with a specific, quotable reason
- Any mention of a competitor or alternative the user considered

**Skip:**
- Vague "great product!" without substance (log as `positive` only if there's a specific reason)
- Pure spam or off-topic messages
- Internal speculation without a user signal ("I think users might find X confusing")

### Where to capture from each source

| Source | Capture action |
|---|---|
| Email reply | Copy quote → add row to triage log |
| DM | Screenshot or paste quote → add row |
| User interview | Add 3–5 items per interview during synthesis |
| Analytics drop | Add row with `source: analytics`, describe the observed drop |
| Internal QA | Add row with `source: internal` |
| Lifecycle message reply | Forward to triage log immediately; reply within 2h |

---

## 4. Post-Launch Triage Workflow

### Flow overview

```
Feedback received
    ↓
Log it (within 24h)
    ↓
Categorize + tag
    ↓
Severity check (bugs only)
    ↓
  P0/P1? → Immediate action
  P2/P3 / non-bug? → Weekly review queue
    ↓
Weekly review: deduplicate + pattern-check
    ↓
Decision: fix / defer / won't fix / experiment
    ↓
Assign + schedule
    ↓
Ship
    ↓
Close the loop with user (when applicable)
```

### Status definitions

| Status | Meaning |
|---|---|
| `new` | Logged but not yet reviewed |
| `triaged` | Categorized, severity set, queued for weekly review |
| `in-progress` | Being actively worked on |
| `done` | Shipped or resolved |
| `wont-fix` | Deliberate decision not to address — reason logged in Notes |
| `deferred` | Valid but not a current priority — add to backlog |
| `pattern` | Merged with 2+ identical items; only one item tracked going forward |

### Handling urgent vs normal feedback

**Urgent (P0/P1 bugs — act immediately):**
1. Reproduce the issue
2. Assess customer impact (how many users? which stage?)
3. Fix and deploy or apply a temporary workaround
4. Notify affected users if data was affected or workflow was blocked
5. Post-mortem if it recurred or was caused by a systemic issue

**Normal feedback (P2/P3 + all non-bug categories):**
1. Log the same day
2. Tag category and funnel stage
3. Add to weekly review queue
4. At weekly review: look for patterns, decide action

### Deduplication

Before the weekly review, scan for items with the same root cause. Merge them into one row, note the count (e.g., "3 users"), and mark the duplicates as `pattern`. Track the merged item.

### Owner assignment

For a small team, default to founder/PM as owner of all feedback decisions. Engineering is assigned only when a fix is decided. No issue goes unowned after triage.

### User follow-up

Every user who reported something actionable should receive a follow-up within 2 weeks when their item ships or is decided. See Section 10 for close-the-loop templates.

---

## 5. Bug Severity Model

### Severity levels

**P0 — Critical**
Production is broken for one or more users in a way that blocks core value delivery.

Examples:
- Foundation generation fails for all users (or silently returns empty)
- Auth is broken — users cannot log in or are logged out mid-session
- Project creation action throws an unhandled error
- Asset generation produces an error page
- Billing checkout throws an error, payment cannot complete
- Data loss: intake content or generated output is deleted unexpectedly

**Response:** Fix immediately. Do not wait for weekly review. If fix takes > 2h, add a temporary workaround or in-app message. Notify affected users if their data or session was impacted.

---

**P1 — Major**
Core workflow is significantly degraded but a workaround exists, or impact is limited to a subset of users.

Examples:
- Foundation generation produces garbled/truncated output consistently
- Asset page shows wrong content (different project's data)
- Paywall is blocking paid users from their entitled features
- Export fails for all users of a given format
- Settings save fails silently
- Login works but onboarding skips workspace creation

**Response:** Fix within 24–48h. Can wait until next working session but not next weekly review.

---

**P2 — Moderate**
Something is broken or wrong but doesn't block the core workflow and affects a minority of users.

Examples:
- A specific intake field doesn't save its value correctly
- Progress steps render in wrong order
- Copy mismatch between page title and breadcrumb
- Badge variant shows wrong color
- Email template link is broken or goes to 404

**Response:** Add to weekly review queue. Fix in next sprint.

---

**P3 — Minor**
Cosmetic or low-impact issues. Doesn't affect user outcome.

Examples:
- Typo in a non-critical UI label
- Misaligned padding on mobile
- Placeholder text incorrect
- A log statement leaks to console in production

**Response:** Batch with other P3s. Fix when convenient or when passing through that area of code.

---

### Escalation rule

If a P2 is reported by 3+ users in the same week, escalate to P1 and fix before next weekly review.
If a P3 is reported by 5+ users, escalate to P2 and schedule for next sprint.

---

## 6. Weekly Iteration Cadence

### When

Every Monday morning (or end-of-Friday for next-week planning). 30 minutes maximum.

### Preparation (5 minutes before)

- Pull all `new` and `triaged` items from the triage log
- Group by category and frequency
- Note any experiment results or variant data available

### Review agenda (30 minutes)

**Block 1 — Bugs (10 min)**
- Any new P0/P1 opened since last week? (Should already be resolved — confirm)
- Review P2s: are any escalated to P1 by frequency?
- Assign P2 fixes

**Block 2 — Funnel and activation (10 min)**
- Signups this week vs last week
- Funnel step pass-through rates (when PostHog live):
  - signup → project_created
  - project_created → messaging_foundation_generated
  - messaging_foundation_generated → messaging_foundation_approved
  - messaging_foundation_approved → asset_opened
- Any step below 50% pass-through → flag for investigation
- Experiments: any variant showing ≥ 5pp difference? Continue/conclude/kill decision?

**Block 3 — Feedback themes (10 min)**
- What are the top 3 recurring themes from user feedback this week?
- Map each theme to a funnel stage and category
- Decide: fix, defer, or experiment?

### Outputs

Every weekly review ends with at least one item in each bucket:

| Bucket | Description |
|---|---|
| **Ship this week** | Bug fixes and copy/UX changes small enough to deploy immediately |
| **Experiment queue** | Hypotheses that should be tested before committing to a product change |
| **Backlog** | Valid ideas not yet prioritized |
| **Won't do** | Items explicitly decided against — log the reason |
| **Open questions** | Things that need more signal before deciding |

### What "good" looks like

A weekly review produces 1–3 concrete actions, not a list of 20 things to consider. If every item ends up in "backlog," the review isn't working.

---

## 7. Prioritization Framework

Use this when deciding which post-launch improvements to work on next. Score each candidate item quickly — no spreadsheet required for small teams.

### RICE-lite (simplified for MVP teams)

Score each item across four dimensions on a 1–3 scale:

| Dimension | 1 | 2 | 3 |
|---|---|---|---|
| **Impact** | Nice to have | Improves activation or conversion | Fixes a blocker or removes major friction |
| **Frequency** | Unique report | 2–4 users | 5+ users or persistent funnel drop |
| **Effort** | > 1 week | Half a day to 2 days | < 2 hours |
| **Strategic fit** | Off-path | Adjacent | Directly on activation or conversion path |

**Score = Impact × Frequency × Effort × Strategic fit**

Items scoring 16–81 are strong. Items scoring < 9 should be deferred unless trivially easy (Effort = 3).

### Tiebreaker questions

When two items score similarly, ask:
1. Which one removes a blocker for a paying user?
2. Which one produces learnings that help other decisions?
3. Which one is faster to ship?
4. Which one is reversible if it turns out to be wrong?

### Anti-patterns to avoid

- **Don't fix the loudest voice.** One founder with a strong opinion is not a pattern.
- **Don't optimize vanity.** Reordering navigation before fixing a generation bug is wrong prioritization.
- **Don't defer trivial fixes.** A 10-minute copy fix that reduces confusion should ship immediately, not wait for a sprint.
- **Don't build unvalidated features.** If only one user requested it and it's not on the activation path, defer.

---

## 8. Close-the-Loop System

### Why it matters

Users who report an issue and receive a follow-up when it ships are significantly more likely to reactivate and upgrade. For a small product, this is a competitive advantage — large products never do it.

### When to close the loop

Close the loop when:
- A bug the user reported is fixed and deployed
- A confusing part of the product is improved (copy, UX, flow)
- A feature or improvement the user requested ships
- Feedback led to a product change, even if not exactly what they asked for

You do not need to close the loop for:
- Items logged as `wont-fix` unless the user explicitly followed up
- `P3` bugs fixed as part of larger work
- Internal observations with no associated user

### Channels

| Situation | Channel |
|---|---|
| User emailed directly | Reply to the same thread |
| User sent a DM | Reply to the same DM thread |
| User discovered via lifecycle message reply | Reply to their message |
| User mentioned publicly (e.g. LinkedIn comment) | Reply publicly + optionally DM |
| Improvement affects many users | Release note or brief email to user list |

### Close-the-loop message templates

**Bug fixed:**
> "Just wanted to let you know — the issue you mentioned [brief description] is fixed as of [date/today]. Thanks for flagging it."

**Confusion addressed (copy/UX improved):**
> "We updated [the part you found confusing] based on your feedback. It should be clearer now — [one sentence describing the change]. Thanks for the input."

**Feature shipped:**
> "You mentioned [X] a few weeks ago. We shipped a version of that today — [one sentence of what it does]. Give it a try and let us know what you think."

**Feedback heard, not yet shipped:**
> "We logged your feedback on [X]. It's on our list — I'll follow up when it ships."

### Batch close-the-loops

When multiple users reported the same thing and it's now fixed, send a short email to all of them at once. Keep it under 3 sentences. No marketing — just the update.

---

## 9. Reporting Templates

See `docs/ops/weekly-review-template.md` for the fill-in weekly health summary.

The weekly report should take < 15 minutes to write. If it takes longer, it's too detailed.

---

## 10. Recommended Feedback Infrastructure (No-Code First)

### Launch phase (weeks 1–4)

| Need | Tool |
|---|---|
| Triage log | `docs/ops/triage-log.md` or Notion table |
| User conversations | Email threads, LinkedIn DMs |
| Error monitoring | Supabase logs + browser console |
| Analytics | PostHog (activate when ready) |
| Interview scheduling | Calendly or manual |

### Phase 2 (weeks 4–8, if volume justifies)

| Need | Tool |
|---|---|
| In-app feedback widget | Tally embed, Canny widget, or custom |
| NPS | Single-question email survey (manual at first) |
| Error tracking | Sentry (add to Next.js app) |
| Feature voting | Canny or Linear Requests |

### What to avoid at launch

- Multi-tier support ticketing (Zendesk, Intercom) — overkill for < 500 users
- Automated NPS surveys before activation — survey users after they've seen value
- Feature voting boards before you have patterns — individual votes don't reveal frequency

---

## 11. First 30 Days Operating Rhythm

### Days 1–3 (first 72 hours)

**Intensity: High. Every signal matters.**

Daily:
- [ ] Check Supabase for auth errors, action failures, generation errors
- [ ] Read every email reply and DM received
- [ ] Log every piece of feedback in triage log
- [ ] Reply to every user message within 2h
- [ ] Check signups, project creation count, and activation count manually
- [ ] Fix any P0/P1 bugs immediately

Watch specifically for:
- Foundation generation failing or returning empty/garbled output
- Auth edge cases (magic link expired, workspace creation skipped)
- Onboarding completing but project creation blocked
- Intake form submission failing

### Week 1 (days 4–7)

**Intensity: High. You're still in learning mode.**

Daily:
- [ ] Same P0/P1 check as above
- [ ] Read all new feedback, log it
- [ ] Reply within 24h to every message
- [ ] Triage all items logged this week

End of week 1:
- [ ] Run first weekly review (30 min)
- [ ] Identify the single biggest funnel drop-off point
- [ ] Schedule at least 3 user interviews for next week
- [ ] Ship any P2 bug fixes queued this week
- [ ] Note the top 3 feedback themes

### Weeks 2–4

**Intensity: Medium. Patterns are forming.**

Weekly ritual:
- [ ] Monday: weekly review (30 min)
- [ ] Ongoing: log feedback daily, but batch triage to weekly
- [ ] Ship P0/P1 immediately; P2 within the week; P3 batched
- [ ] Run 2–3 user interviews per week while volume is low enough to be personal
- [ ] Check experiment data: any EXP-001/EXP-002 variants showing meaningful difference?

End of week 4:
- [ ] Review full funnel against week 1 KPIs (signups, activation rate, conversion)
- [ ] Identify 3 highest-frequency feedback themes
- [ ] Identify the biggest gap between expected and actual behavior
- [ ] Make a concrete decision about Stripe/PostHog activation (based on funnel readiness)
- [ ] Review which lifecycle messages to activate based on observed funnel drops
- [ ] Update experiment registry with any concluded experiments

### Signal stability check

By week 4, you should be able to answer:
1. What is the biggest drop-off point in the activation funnel?
2. What is the #1 source of confusion for new users?
3. What is the most common reason free users haven't upgraded?
4. What has been the highest-ROI product change so far?

If you cannot answer these four questions, you don't yet have enough signal. Continue qualitative interviews. Don't invest in tooling yet.

---

## 12. Connecting Feedback to Lifecycle and Experiments

### Feedback → lifecycle activation

When a consistent funnel drop is observed at a specific stage, activate the corresponding lifecycle message:

| Observed drop | Lifecycle message to activate |
|---|---|
| signups → project_created low | `project_nudge` (24h fallback) |
| project_created → foundation_generated low | `foundation_nudge` (24h fallback) |
| foundation_generated → asset_opened low | `asset_nudge` (24h fallback) |
| paywall_viewed → upgrade low | `upgrade_paywall_hit` + `upgrade_engaged_free` |
| D14 low return rate | `re_engagement` |

### Feedback → experiment ideas

When a recurring `confusion` or `friction` item maps to the intake or foundation flow, create an experiment spec in `docs/activation/experiment-backlog.md` before building anything. The feedback is the hypothesis — the experiment is the test.

### Feedback → copy changes

`confusion` items are often fixable in < 1 hour with a copy change. Before building a new feature, ask: would a clearer label, shorter hint, or better placeholder fix this? Copy changes ship fast and can be tested immediately.
