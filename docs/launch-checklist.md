# Launch Readiness Checklist — Go-to-Market Taste

Use this document before and after each deployment. Each section is a gate;
don't proceed to production until it passes.

---

## Status Key

| Symbol | Meaning |
|---|---|
| ✅ | Ready — verify on each deploy |
| ⚠️ | Scaffolded — not live yet, honest placeholder in UI |
| ❌ | Blocked — cannot ship until resolved |

---

## 1. Environment & Config

| Check | Status | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` set | ✅ | Required for all DB access |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` set | ✅ | Required for client auth |
| `SUPABASE_SERVICE_ROLE_KEY` set (server-only) | ✅ | **Never expose in client** |
| `NEXT_PUBLIC_APP_URL` set | ✅ | Used for OG metadata |
| `ANTHROPIC_API_KEY` set | ❌ | Required for foundation generation |
| `STRIPE_SECRET_KEY` set | ⚠️ | Required when Stripe checkout goes live |
| `STRIPE_PAID_MONTHLY_PRICE_ID` set | ⚠️ | Required when Stripe checkout goes live |
| `STRIPE_WEBHOOK_SECRET` set | ⚠️ | Required for plan activation via webhook |
| `NEXT_PUBLIC_POSTHOG_KEY` set | ⚠️ | Required when PostHog is wired |
| No `.env` or secrets committed to repo | ✅ | Verified: `.env*` in `.gitignore` |
| `NODE_ENV=production` in deploy | ✅ | Suppresses dev console noise |

---

## 2. Database & Migrations

| Check | Status | Notes |
|---|---|---|
| All migrations run in Supabase | ✅ | Confirm in dashboard: migrations 001–005 |
| RLS enabled on all tables | ✅ | Verified in migration SQL |
| `workspace_billing` table exists | ⚠️ | Migration 005 — run before Stripe goes live |
| No direct service-role key use in client code | ✅ | `createServiceClient()` is server-only |

---

## 3. Auth & Routing

Manual smoke test — run before each deploy:

- [ ] `/signup` → creates account → redirects to `/onboarding` → redirects to `/app/projects`
- [ ] `/login` → signs in → redirects to `/app/projects`
- [ ] `/app/projects` without session → redirects to `/login`
- [ ] `/app/projects` with session + no workspace → redirects to `/onboarding`
- [ ] `/onboarding` with existing workspace → redirects to `/app/projects` (no loop)
- [ ] Auth callback (`/auth/callback`) handles email confirmation correctly
- [ ] Accessing `/app/projects/[id]` for a project not in user's workspace → handled gracefully (404 or error boundary)

---

## 4. Feature Gating

| Check | Status | Notes |
|---|---|---|
| Free user cannot create a project | ✅ | `canCreateProject` gate in action + UI |
| Free user sees UpgradePrompt on `/app/projects` | ✅ | Rendered when `!canCreateProject` |
| Free user hitting `/app/projects/new` sees UpgradePrompt | ✅ | Page-level gate |
| Paid user can create project and reach intake | ✅ | Action proceeds |
| Free user cannot generate Messaging Foundation | ✅ | `canGenerateMessagingFoundation` gate |
| Paywall hit emits `paywall_viewed` event | ✅ | `emitBillingEvent` called in gated actions |
| Downgraded user (if applicable) still sees existing projects | ✅ | Fixed: projects list renders regardless of canCreate |

---

## 5. Core Workflow Smoke Test

Run through the full paid-plan journey on staging:

- [ ] Create project with 4 intake fields → saved, redirected to inputs
- [ ] Inputs page shows raw input content
- [ ] Click "Generate Messaging Foundation" → AI pipeline runs → redirected to narrative
- [ ] Narrative page shows MEDDIC + Command of the Message sections with confidence badges
- [ ] "Approve Foundation" button locks the version → redirected to assets
- [ ] Assets page shows real approval status (not mock)
- [ ] Asset editor pages open (pitch-deck, one-pager, sales-enablement)
- [ ] Overview page reflects real foundation state
- [ ] Export page accessible (HTML export available, PDF/PPTX marked coming soon)

---

## 6. Billing

| Check | Status | Notes |
|---|---|---|
| Billing page shows correct current plan | ✅ | Reads `workspace.plan` via `getPlanForWorkspace` |
| "Start for €5/month" button is disabled with explanation | ✅ | Honest placeholder |
| "Manage subscription" button is disabled with explanation | ✅ | Honest placeholder |
| Stripe checkout stub throws clearly (not silently fails) | ⚠️ | See `lib/billing/stripe/checkout.ts` |
| Plan display matches PLANS config (no stale hardcoded copy) | ✅ | Features list reads from `PLANS` |
| Pricing page copy matches actual plan entitlements | ✅ | Verified in QA pass |

**Before activating Stripe:**
- [ ] Install `stripe` npm package
- [ ] Set env vars: `STRIPE_SECRET_KEY`, `STRIPE_PAID_MONTHLY_PRICE_ID`, `STRIPE_WEBHOOK_SECRET`
- [ ] Create `POST /api/webhooks/stripe` route using `lib/billing/stripe/webhook.ts` stub
- [ ] Test webhook locally with Stripe CLI: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
- [ ] Enable the "Start for €5/month" button on billing page
- [ ] Verify workspace.plan is updated correctly on checkout.completed webhook

---

## 7. Analytics

| Check | Status | Notes |
|---|---|---|
| `signup_completed` fires on signup | ✅ | `lib/auth/actions.ts` |
| `login_completed` fires on sign-in | ✅ | `lib/auth/actions.ts` |
| `onboarding_completed` fires on workspace creation | ✅ | `lib/auth/actions.ts` |
| `project_created` fires on project creation | ✅ | `projects/new/_actions.ts` |
| `messaging_foundation_generated` fires on generation | ✅ | `inputs/_actions.ts` |
| `messaging_foundation_approved` fires on approval | ✅ | `narrative/_actions.ts` |
| `messaging_foundation_reviewed` fires on narrative page | ✅ | `PageViewTracker` in narrative page |
| `billing_page_viewed` fires on billing page | ✅ | `PageViewTracker` in billing page |
| `pricing_page_viewed` fires on pricing page | ✅ | `PageViewTracker` in pricing page |
| `paywall_viewed` fires when gating blocks access | ✅ | `emitBillingEvent` in gated actions |
| `identify` + `group` called on app load | ✅ | `AnalyticsIdentity` in app layout |

**Before activating PostHog:**
- [ ] Install `posthog-js` + `posthog-node`
- [ ] Set `NEXT_PUBLIC_POSTHOG_KEY` and `POSTHOG_KEY`
- [ ] Replace stubs in `AnalyticsProvider.tsx`, `lib/analytics/client.ts`, `lib/analytics/server.ts`
- [ ] Verify events fire in PostHog Live Events view

---

## 8. Error Handling

| Check | Status | Notes |
|---|---|---|
| Global `error.tsx` catches unhandled server errors | ✅ | Added in QA pass |
| App-level `app/error.tsx` catches auth/app errors | ✅ | Added in QA pass |
| Project-level `[id]/error.tsx` catches project load errors | ✅ | Added in QA pass |
| Global `not-found.tsx` handles 404s | ✅ | Added in QA pass |
| Foundation generation failure doesn't strand user | ✅ | `generateFoundationAction` error propagates to error boundary |

---

## 9. Post-Deploy Smoke Test

Run immediately after each production deploy:

- [ ] Landing page loads (check OG image, meta title)
- [ ] Pricing page loads, CTAs are correct
- [ ] `/login` and `/signup` render without errors
- [ ] Authenticated `/app/projects` loads for a known test account
- [ ] Billing page shows correct plan for test account
- [ ] Settings page shows real email (not hardcoded placeholder)
- [ ] No JS console errors on key pages
- [ ] No broken images or missing fonts

---

## 10. What Is Fully Working vs. Deferred

### Fully working
- Auth (sign up, sign in, email confirmation, onboarding)
- Free-plan experience: framework guides, examples, templates
- Paid-plan experience: project creation, intake, foundation generation, narrative, asset editors
- Feature gating (free vs. paid) via `workspace.plan`
- Analytics instrumentation (server-side events; needs PostHog to ship)
- Error boundaries (global + app + project scope)
- HTML export (backend pipeline exists)

### Scaffolded / not live
- Stripe checkout (stub — UI shows honest "coming soon" messaging)
- Stripe customer portal (stub — UI shows honest disabled state)
- PostHog analytics (stubs in place; replace with real SDK when ready)
- Asset version history (placeholder page — "coming in Phase 2")
- Account settings save (profile display is real; save is disabled)
- Delete account (disabled — contact us to delete)
- PDF and PPTX export (marked "coming soon" in UI)

### Intentionally deferred until after launch
- Middleware-based route protection (currently uses per-page auth helpers — safe but less efficient than middleware)
- Rate limiting on generation endpoints
- Team/multi-user workspaces
- Custom domain support
- Workspace rename
