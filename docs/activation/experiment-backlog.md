# Experiment Backlog — Go-to-Market Taste

Prioritized by impact × confidence × effort. Run high-priority experiments first. Complete or abandon each before starting the next in the same funnel stage.

---

## Priority Matrix

| ID | Name | Stage | Priority | Effort | Status |
|---|---|---|---|---|---|
| EXP-001 | Intake progress steps | Onboarding | Medium | Minimal | Running |
| EXP-002 | Sample intake prefill | Onboarding | High | Minimal | Running |
| EXP-003 | Outcome preview on intake | Onboarding | High | Minimal | Planned |
| EXP-004 | Generation progress messaging | Activation | High | Medium | Planned |
| EXP-005 | Foundation CTA copy | Activation | Medium | Minimal | Running |
| EXP-006 | Inputs outcome hint | Onboarding | Low | Minimal | Planned |
| EXP-007 | Paywall early lock test | Conversion | Medium | Minimal | Planned |
| EXP-008 | Asset preview on foundation | Activation | High | Medium | Planned |
| EXP-009 | Empty state CTA prominence | Onboarding | Medium | Minimal | Planned |
| EXP-010 | Inline example toggles | Onboarding | Medium | Medium | Planned |
| EXP-011 | Foundation approval confirmation | Activation | Medium | Minimal | Planned |
| EXP-012 | Post-activation upgrade nudge | Conversion | High | Medium | Planned |
| EXP-013 | Persona-based onboarding | Onboarding | Low | Large | Planned |

---

## Experiment Specs

---

### EXP-001 — Intake Progress Steps
**Flag:** `INTAKE_PROGRESS_STEPS`
**Stage:** Onboarding
**Priority:** Medium
**Effort:** Minimal (implemented)
**Status:** Running (flag off by default — enable via `NEXT_PUBLIC_EXP_INTAKE_PROGRESS_STEPS=true`)

**Hypothesis:** Showing a 4-step workflow progress indicator (Intake → Foundation → Review → Assets) at the top of the intake form increases form completion by making the outcome concrete and reducing perceived complexity.

**Target metric:** Intake form submission rate (project_created / intake_form_viewed)
**Guardrail:** Time on intake page should not decrease (we don't want people rushing)

**Control:** No progress indicator (current default)
**Variant A:** 4-step progress indicator above the form

**Implementation:** `WorkflowProgressSteps` component, `isEnabled("INTAKE_PROGRESS_STEPS")` gate in new project page.

**Minimum runtime:** 2 weeks or 50 form views per variant, whichever is longer.
**Decision criteria:** ≥ 5pp lift in submission rate, no regression in foundation quality.

---

### EXP-002 — Sample Intake Prefill
**Flag:** `INTAKE_SAMPLE_PREFILL`
**Stage:** Onboarding
**Priority:** High
**Effort:** Minimal (implemented)
**Status:** Running (flag off by default — enable via `NEXT_PUBLIC_EXP_INTAKE_SAMPLE_PREFILL=true`)

**Hypothesis:** Prefilling the intake form with a realistic RevOps SaaS example increases form submission rate and improves input quality, because users understand what "good" looks like and have less cognitive work to do.

**Target metric:** Intake form submission rate; input quality score (proxy: foundation generation success, not failure/retry)
**Guardrail:** Users should actually replace the content, not submit the example verbatim (check for sample content in submitted inputs)

**Control:** Empty form with placeholder text only
**Variant A:** Form prefilled with RevOps SaaS example + "Example content loaded" banner

**Implementation:** `SAMPLE_INTAKE` in `lib/experiments/sample-intake.ts`; `getSampleIntakeContent()` called server-side; passed as `sampleContent` prop to `NewProjectForm`.

**Minimum runtime:** 2 weeks or 40 form views per variant.
**Decision criteria:** ≥ 8pp lift in submission rate; < 15% of submissions contain near-verbatim sample text.

---

### EXP-003 — Outcome Preview on Intake Page
**Flag:** `INTAKE_OUTCOME_PREVIEW` (not yet implemented)
**Stage:** Onboarding
**Priority:** High
**Effort:** Minimal

**Hypothesis:** Showing a small preview of example output (a 3-bullet Messaging Foundation summary + asset thumbnails) before the form increases intent to complete and reduces abandonment.

**Target metric:** Intake form start rate (how often users click "New Project" → begin filling)
**Guardrail:** Intake page load time

**Control:** Current page (description text only)
**Variant A:** Collapsed "What you'll get" panel showing example Foundation excerpt + asset type badges

**Implementation notes:**
- Add a collapsible `ExampleOutputPreview` component above the form
- Hardcode a short example (3 bullets from a RevOps Foundation)
- Gate behind `NEXT_PUBLIC_EXP_INTAKE_OUTCOME_PREVIEW=true`
- No backend required

**Effort estimate:** ~2h (new component + flag + wire-up)

---

### EXP-004 — Generation Progress Messaging
**Flag:** `GENERATION_PROGRESS_COPY` (not yet implemented)
**Stage:** Activation
**Priority:** High
**Effort:** Medium

**Hypothesis:** Showing what the AI is doing during foundation generation (step-by-step copy like "Analyzing your differentiation…", "Structuring your narrative…") reduces abandonment during the 15–30s generation wait.

**Target metric:** Generation start → generation complete rate (foundation_generation_started → messaging_foundation_generated)
**Guardrail:** Perceived generation time (don't make it feel slower)

**Control:** Current loading state (spinner, no copy)
**Variant A:** Rotating copy describing what the AI is analyzing, cycling every 3s

**Implementation notes:**
- Replace the current spinner in the foundation generation waiting state
- Array of 5–6 copy strings, cycle with `useEffect` + `setInterval`
- Client component, no API changes
- Gate behind flag

**Effort estimate:** ~3h

---

### EXP-005 — Foundation CTA Copy
**Flag:** `FOUNDATION_CTA_COPY`
**Stage:** Activation
**Priority:** Medium
**Effort:** Minimal (partially implemented)
**Status:** Running (variant controlled by `getVariant("FOUNDATION_CTA_COPY")`)

**Hypothesis:** The copy on the primary CTA on the Foundation review page affects whether users approve and proceed to assets.

**Target metric:** Foundation approved rate (messaging_foundation_approved / messaging_foundation_reviewed)

**Control:** "Approve and continue →"
**Variant A:** "Looks good — generate assets →"
**Variant B:** "Approve foundation →"

**Implementation notes:**
- `getVariant("FOUNDATION_CTA_COPY")` returns "control" | "variant_a" | "variant_b"
- Wire into the foundation approve button copy in `app/projects/[id]/narrative/page.tsx`
- Currently the flag exists but the variant isn't applied to the UI — needs one more step

**Effort estimate:** ~1h to wire into the CTA button

---

### EXP-006 — Inputs Outcome Hint
**Flag:** `INPUTS_OUTCOME_HINT`
**Stage:** Onboarding
**Priority:** Low
**Effort:** Minimal (flag implemented, UI not wired)
**Status:** Planned

**Hypothesis:** Adding a small hint below each intake field showing how that input maps to foundation output ("This becomes your ICP section") increases input quality without slowing submission.

**Target metric:** Foundation quality (proxy: no regeneration requests within 24h)
**Guardrail:** Intake form submission rate (hints shouldn't slow users down)

**Control:** Current field labels + hint text only
**Variant A:** Each field has a small "→ powers your [section name]" callout

**Implementation notes:**
- Add optional `outcomeHint` to `INTAKE_FIELDS` in `NewProjectForm.tsx`
- Render conditionally when `isEnabled("INPUTS_OUTCOME_HINT")`
- No backend required

**Effort estimate:** ~1.5h

---

### EXP-007 — Paywall Early Lock Test
**Flag:** `PAYWALL_EARLY_LOCK`
**Stage:** Conversion
**Priority:** Medium
**Effort:** Minimal (flag implemented, not wired)
**Status:** Planned

**Hypothesis:** Locking the foundation generation step (instead of just assets) behind the paid plan drives earlier conversion from users who are highly engaged but haven't hit the paywall yet.

**Risk:** This could also kill activation entirely — users who hit a paywall before experiencing value churn. Run with caution.

**Target metric:** Free → paid conversion rate within 7 days
**Guardrail:** Activation rate (must not drop by > 10pp)

**Control:** Free users can generate one foundation; paywall hits on assets
**Variant A:** Free users can create a project but not generate a foundation; paywall hits on generation

**Implementation notes:**
- `isEnabled("PAYWALL_EARLY_LOCK")` in `generateFoundationAction`
- If enabled and user is on free plan, return `UPGRADE_REQUIRED` error instead of generating
- Show `UpgradePrompt` component on the inputs page
- **Only run this after you have baseline conversion data from control**

**Effort estimate:** ~2h

---

### EXP-008 — Asset Preview on Foundation Page
**Flag:** `FOUNDATION_ASSET_PREVIEW` (not yet implemented)
**Stage:** Activation
**Priority:** High
**Effort:** Medium

**Hypothesis:** Showing a thumbnail or 2-sentence preview of what each generated asset will contain — derived from the just-approved foundation — increases asset open rate and reduces the "now what?" drop-off after foundation approval.

**Target metric:** Asset open rate (asset_opened / messaging_foundation_approved)

**Control:** Current assets page (cards with asset type labels only, locked until approved)
**Variant A:** After foundation approval, each asset card shows 2 lines of preview content

**Implementation notes:**
- Requires a lightweight preview-generation step after foundation approval
- OR: use the foundation's positioning statement to generate 1 sentence per asset type client-side
- Higher effort — builds a new generation step

**Effort estimate:** ~6h

---

### EXP-009 — Empty State CTA Prominence
**Flag:** `EMPTY_STATE_CTA_VARIANT` (not yet implemented)
**Stage:** Onboarding
**Priority:** Medium
**Effort:** Minimal

**Hypothesis:** New users who see the empty projects page don't click "New project" because the CTA is not prominent enough or the empty state doesn't communicate the value proposition clearly.

**Target metric:** Empty state → new project click rate

**Control:** Current empty state (text + small button)
**Variant A:** Larger hero-style empty state with "Start your first project →" as a primary button and a 2-line value prop

**Effort estimate:** ~1h

---

### EXP-010 — Inline Example Toggles
**Flag:** `INLINE_EXAMPLES` (not yet implemented)
**Stage:** Onboarding
**Priority:** Medium
**Effort:** Medium

**Hypothesis:** Rather than prefilling the form (EXP-002), showing expandable "See an example" toggles next to each field lets users reference examples without replacing their own content.

**Note:** This is a structural alternative to EXP-002. Run after EXP-002 concludes.

**Target metric:** Intake form submission rate; input quality

**Control:** Current form (EXP-002 off)
**Variant A:** Each field has a "See an example ↓" link that expands to show example text inline

**Effort estimate:** ~3h

---

### EXP-011 — Foundation Approval Confirmation
**Flag:** `FOUNDATION_APPROVAL_CONFIRM` (not yet implemented)
**Stage:** Activation
**Priority:** Medium
**Effort:** Minimal

**Hypothesis:** Adding a brief confirmation ("Foundation approved — your assets are ready to generate") after approval increases confidence and reduces "did that work?" confusion.

**Target metric:** Approved → asset_opened rate

**Control:** Current behavior (approval redirects to assets page)
**Variant A:** 1-second success toast + redirect with "Your assets are ready" copy

**Effort estimate:** ~1h

---

### EXP-012 — Post-Activation Upgrade Nudge
**Flag:** `POST_ACTIVATION_UPGRADE_NUDGE` (not yet implemented)
**Stage:** Conversion
**Priority:** High
**Effort:** Medium

**Hypothesis:** Free users who have activated (opened an asset) have experienced peak value. A targeted upgrade prompt at this moment — "You've seen what it can do" — converts better than any pre-activation prompt.

**Target metric:** Free → paid conversion rate for activated users

**Control:** No additional prompt (paywall hits when they try to create a second project or export)
**Variant A:** After first asset_opened, show a contextual banner: "Liked what you saw? Unlock unlimited projects for €5/month."

**Effort estimate:** ~3h

---

### EXP-013 — Persona-Based Onboarding
**Flag:** Not yet defined
**Stage:** Onboarding
**Priority:** Low
**Effort:** Large

**Hypothesis:** Asking one qualification question at signup ("Are you a founder, PMM, or consultant?") and tailoring the intake example and copy to that persona improves activation rate for non-RevOps users.

**Note:** Do not run until EXP-002 (sample prefill) has concluded and you have a clear view of which personas the sample helps vs. confuses.

**Effort estimate:** ~8–12h (segmentation logic, multiple example sets, routing)

---

## Not Running / Deferred

- A/B testing signup page copy: defer until organic traffic is significant
- Pricing page variant: pricing is not yet live; defer
- Onboarding email sequence variants: defer until provider is wired (Loops/Resend)
- In-app chat or help widget: not enough users to justify yet
