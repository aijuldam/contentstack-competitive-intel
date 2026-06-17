# Tracking Plan — Go-to-Market Taste

Event taxonomy for activation, onboarding, pricing, and upgrade analytics.
All events use object-action naming (`noun_verb`). Server-side events fire from
Next.js Server Actions; client-side events fire from React components.

---

## Architecture

| Layer | Module | When to use |
|---|---|---|
| Server | `src/lib/analytics/server.ts` | Funnel-critical events (signup, project created, foundation generated) |
| Client | `src/lib/analytics/client.ts` | User interactions (page views, CTA clicks, UI events) |
| Shared constants | `src/lib/analytics/events.ts` | Event name strings — import `E` from here |

**Rule:** Never import `server.ts` in a Client Component, and never import
`client.ts` in a Server Component or Server Action.

---

## Event Reference

### Acquisition

| Event | Constant | Fires in | Why it matters |
|---|---|---|---|
| `landing_page_viewed` | `E.LANDING_PAGE_VIEWED` | `PageViewTracker` on landing page | Top-of-funnel volume; source breakdown |
| `pricing_page_viewed` | `E.PRICING_PAGE_VIEWED` | `PageViewTracker` on `/pricing` | Intent signal; conversion denominator |
| `free_resources_clicked` | `E.FREE_RESOURCES_CLICKED` | `TrackedCta` on pricing / billing | Measures free-tier interest |
| `paid_cta_clicked` | `E.PAID_CTA_CLICKED` | `TrackedCta` on pricing / billing | Primary upgrade intent signal |
| `signup_started` | `E.SIGNUP_STARTED` | Signup page load | Drop-off measurement |

**Key properties:** `pricing_cta` (button label), `location` (e.g. `pricing_page_top`), `source_page`

---

### Onboarding & Activation

| Event | Constant | Fires in | Why it matters |
|---|---|---|---|
| `signup_completed` | `E.SIGNUP_COMPLETED` | `signUp` server action | Confirmed new user; triggers onboarding funnel |
| `login_completed` | `E.LOGIN_COMPLETED` | `signIn` server action | Session start; measures returning users |
| `onboarding_started` | `E.ONBOARDING_STARTED` | Onboarding page load | Measures workspace creation intent |
| `onboarding_completed` | `E.ONBOARDING_COMPLETED` | `createWorkspace` server action | Workspace created; user is now active |
| `project_created` | `E.PROJECT_CREATED` | `createProjectAction` | First activation milestone |
| `intake_started` | `E.INTAKE_STARTED` | Inputs page load | Measures project engagement |
| `intake_completed` | `E.INTAKE_COMPLETED` | Future: on source save | Measures form completion |

**Key properties:** `plan`, `workspace_id`, `project_id`, `company_name`

**Activation milestone:** `project_created` → `messaging_foundation_generated` → `asset_opened`
All three must fire for a user to count as activated.

---

### Core Product

| Event | Constant | Fires in | Why it matters |
|---|---|---|---|
| `messaging_foundation_generated` | `E.MESSAGING_FOUNDATION_GENERATED` | `generateFoundationAction` | Second activation milestone; AI pipeline used |
| `messaging_foundation_reviewed` | `E.MESSAGING_FOUNDATION_REVIEWED` | `PageViewTracker` on narrative page | Measures foundation review engagement |
| `messaging_foundation_approved` | `E.MESSAGING_FOUNDATION_APPROVED` | `approveFoundationAction` | Commit signal before asset generation |
| `first_asset_generated` | `E.FIRST_ASSET_GENERATED` | Future: asset generation action | Distinct from subsequent generations |
| `asset_generated` | `E.ASSET_GENERATED` | Future: asset generation action | Volume metric |
| `asset_opened` | `E.ASSET_OPENED` | Future: `PageViewTracker` on asset page | Third activation milestone |
| `asset_edited` | `E.ASSET_EDITED` | Future: asset editor action | Engagement depth |
| `asset_regenerated` | `E.ASSET_REGENERATED` | Future: asset regeneration action | Iteration behavior |

**Key properties:** `project_id`, `foundation_version`, `foundation_version_id`, `asset_type`, `plan`, `workspace_id`

---

### Billing & Upgrade

| Event | Constant | Fires in | Why it matters |
|---|---|---|---|
| `billing_page_viewed` | `E.BILLING_PAGE_VIEWED` | `PageViewTracker` on `/app/billing` | Upgrade consideration signal |
| `paywall_viewed` | `E.PAYWALL_VIEWED` | `emitBillingEvent` in gated actions | Identifies friction points |
| `upgrade_clicked` | `E.UPGRADE_CLICKED` | `TrackedCta` on billing page | High-intent signal before Stripe |
| `checkout_started` | `E.CHECKOUT_STARTED` | `createCheckoutSession` (stub) | Funnel step before payment |
| `checkout_completed` | `E.CHECKOUT_COMPLETED` | Stripe webhook handler | Revenue confirmation |

**Key properties:** `plan`, `paywall_context` (feature name), `source_page`, `pricing_cta`

---

### Export

| Event | Constant | Fires in | Why it matters |
|---|---|---|---|
| `export_requested` | `E.EXPORT_REQUESTED` | `emitExportEvent` in export pipeline | Export intent |
| `export_completed` | `E.EXPORT_COMPLETED` | `emitExportEvent` in export pipeline | Success + latency (`duration_ms`) |

**Key properties:** `job_id`, `asset_type`, `export_format`, `project_id`, `duration_ms`

---

## User Identity

`identify()` is called once per session mount in `AnalyticsIdentity` (app layout):

```
identify(userId, { plan, workspace_id, company_name })
group("workspace", workspaceId, { plan, company_name })
```

This associates all subsequent events with the user's plan and workspace without
needing to pass those props on every individual `track()` call (though server-side
events do pass them explicitly since there is no session context).

---

## Connecting PostHog

1. Install: `npm install posthog-js posthog-node`
2. Set env vars: `NEXT_PUBLIC_POSTHOG_KEY`, `POSTHOG_KEY` (same key), `NEXT_PUBLIC_POSTHOG_HOST`
3. Replace stub in `src/components/analytics/AnalyticsProvider.tsx` with `PostHogProvider`
4. Replace stub calls in `src/lib/analytics/client.ts` with `window.posthog?.capture(...)`
5. Replace stub calls in `src/lib/analytics/server.ts` with PostHog Node SDK calls
6. See integration comments in `src/lib/analytics/posthog/client.ts` and `posthog/server.ts`
