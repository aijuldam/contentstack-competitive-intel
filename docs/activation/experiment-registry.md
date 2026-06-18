# Experiment Registry — Go-to-Market Taste

Live log of all experiments. Add a row when an experiment starts; update status and results when it concludes.

---

## Active Experiments

| ID | Name | Flag | Start | Status | Owner |
|---|---|---|---|---|---|
| EXP-001 | Intake progress steps | `INTAKE_PROGRESS_STEPS` | 2026-06-18 | Running | — |
| EXP-002 | Sample intake prefill | `INTAKE_SAMPLE_PREFILL` | 2026-06-18 | Running | — |
| EXP-005 | Foundation CTA copy | `FOUNDATION_CTA_COPY` | 2026-06-18 | Running (UI partial) | — |

---

## Experiment Details

---

### EXP-001 — Intake Progress Steps

| Field | Value |
|---|---|
| **Status** | Running |
| **Flag** | `INTAKE_PROGRESS_STEPS` (env: `NEXT_PUBLIC_EXP_INTAKE_PROGRESS_STEPS`) |
| **Default** | Off |
| **Stage** | Onboarding |
| **Start date** | 2026-06-18 |
| **Target end** | 2026-07-02 (or 50 form views per variant) |
| **Hypothesis** | A 4-step progress indicator reduces perceived complexity and increases form submission rate |
| **Primary metric** | Intake form submission rate |
| **Guardrail** | Time on intake page (no decrease) |
| **Control** | No progress indicator |
| **Variant A** | `WorkflowProgressSteps` above the form |
| **Result** | — |
| **Decision** | — |

**Implementation files:**
- `web/src/components/experiments/WorkflowProgressSteps.tsx`
- `web/src/app/app/projects/new/page.tsx` (EXP-001 gate)

**To enable:** `NEXT_PUBLIC_EXP_INTAKE_PROGRESS_STEPS=true` in `.env.local`

---

### EXP-002 — Sample Intake Prefill

| Field | Value |
|---|---|
| **Status** | Running |
| **Flag** | `INTAKE_SAMPLE_PREFILL` (env: `NEXT_PUBLIC_EXP_INTAKE_SAMPLE_PREFILL`) |
| **Default** | Off |
| **Stage** | Onboarding |
| **Start date** | 2026-06-18 |
| **Target end** | 2026-07-02 (or 40 form views per variant) |
| **Hypothesis** | Prefilling the form with a realistic example increases submission rate and input quality |
| **Primary metric** | Intake form submission rate |
| **Guardrail** | < 15% of submissions contain near-verbatim sample content |
| **Control** | Empty form with placeholders |
| **Variant A** | Form prefilled with RevOps SaaS example + "Example content loaded" banner |
| **Result** | — |
| **Decision** | — |

**Implementation files:**
- `web/src/lib/experiments/sample-intake.ts`
- `web/src/app/app/projects/new/NewProjectForm.tsx` (sampleContent prop)
- `web/src/app/app/projects/new/page.tsx` (EXP-002 gate + getSampleIntakeContent)

**To enable:** `NEXT_PUBLIC_EXP_INTAKE_SAMPLE_PREFILL=true` in `.env.local`

**Watch-out:** Monitor for users submitting the example verbatim. If > 15% of generated foundations read like the RevOps example, the prefill is hurting quality. Kill.

---

### EXP-005 — Foundation CTA Copy

| Field | Value |
|---|---|
| **Status** | Running (flag active; UI wiring needed) |
| **Flag** | `FOUNDATION_CTA_COPY` (env: `NEXT_PUBLIC_EXP_FOUNDATION_CTA_COPY`) |
| **Default** | `"control"` |
| **Stage** | Activation |
| **Start date** | 2026-06-18 |
| **Target end** | After EXP-001 or EXP-002 concludes (don't run too many variants at once) |
| **Hypothesis** | CTA copy that emphasizes outcome ("generate assets") outperforms generic approval copy |
| **Primary metric** | Foundation approved rate (approve_clicked / foundation_reviewed) |
| **Control** | "Approve and continue →" |
| **Variant A** | "Looks good — generate assets →" |
| **Variant B** | "Approve foundation →" |
| **Result** | — |
| **Decision** | — |

**Implementation files:**
- `web/src/lib/experiments/flags.ts` (FOUNDATION_CTA_COPY flag)
- `web/src/app/app/projects/[id]/narrative/page.tsx` — **needs `getVariant("FOUNDATION_CTA_COPY")` wired into the approve button**

**To activate variant A:** `NEXT_PUBLIC_EXP_FOUNDATION_CTA_COPY=variant_a`
**To activate variant B:** `NEXT_PUBLIC_EXP_FOUNDATION_CTA_COPY=variant_b`

---

## Completed Experiments

_None yet._

---

## Abandoned Experiments

_None yet._

---

## Registry Conventions

### Status values
- **Planned** — Spec written, not yet implemented
- **Running** — Flag implemented; may be on or off depending on env config
- **Complete** — Decided; result recorded
- **Abandoned** — Stopped early (insufficient traffic, blocking issue, or superseded)

### Adding a new experiment
1. Add a row to the Active Experiments table
2. Add a full detail block below
3. Add the flag to `web/src/lib/experiments/flags.ts`
4. Add a spec entry to `experiment-backlog.md`
5. Implement the variant behind the flag

### Concluding an experiment
1. Set status to Complete or Abandoned
2. Record the result (quantitative if available, qualitative otherwise)
3. Record the decision (keep variant / revert to control / iterate)
4. If keeping: remove the flag and hardcode the winning variant
5. If reverting: remove the flag and all variant code
6. Move the row from Active to Completed/Abandoned

### Flag removal checklist
When an experiment concludes and a winner is decided:
- [ ] Delete the flag from `FLAGS` in `flags.ts`
- [ ] Remove all `isEnabled()` / `getVariant()` calls for that flag
- [ ] Remove or hardcode the variant component/copy
- [ ] Delete the env var from all `.env` files and hosting config
- [ ] Update this registry with the result and decision
