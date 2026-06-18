# Lifecycle Trigger Spec — Go-to-Market Taste

Technical specification for connecting lifecycle messages to the product's
event model. All event names match the constants in `src/lib/analytics/events.ts`.

---

## Event-to-Message Map

| Analytics Event | Message Triggered | Condition |
|---|---|---|
| `signup_completed` | `welcome` | Always (idempotent) |
| `signup_completed` | `onboarding_reminder` | Start 24h timer; fire if `onboarding_completed` not received |
| `onboarding_completed` | `project_nudge` | Start 24h timer; fire if `project_created` not received AND user is on paid plan |
| `project_created` | `foundation_nudge` | Start 24h timer; fire if `messaging_foundation_generated` not received |
| `messaging_foundation_generated` | `asset_nudge` | Start 24h timer; fire if `asset_opened` not received |
| `paywall_viewed` | `upgrade_paywall_hit` | User is on free plan AND cooldown (7d) has not elapsed |
| `asset_opened` | `activation_success` | First `asset_opened` event only; user is on paid plan |
| _7 days post-signup_ | `upgrade_engaged_free` | Free plan; `free_resources_clicked` or `pricing_page_viewed` count ≥ 2; no `checkout_completed` |
| _14 days since last event_ | `re_engagement` | No event in 14d; cooldown 30d |

---

## Activation Milestone

The activation milestone is considered complete when all three events have fired
for a given user (in any order):

```
project_created
messaging_foundation_generated
asset_opened
```

When the milestone is reached:
- Set `activated = true` on the contact record in the messaging provider
- Suppress all future onboarding nudges (`onboarding_reminder`, `project_nudge`, `foundation_nudge`, `asset_nudge`) for this user
- Queue `activation_success` email if not already sent

---

## Where Each Event Currently Fires

| Event | Location in codebase |
|---|---|
| `signup_completed` | `src/lib/auth/actions.ts` — `signUp()` |
| `login_completed` | `src/lib/auth/actions.ts` — `signIn()` |
| `onboarding_completed` | `src/lib/auth/actions.ts` — `createWorkspace()` |
| `project_created` | `src/app/app/projects/new/_actions.ts` — `createProjectAction()` |
| `messaging_foundation_generated` | `src/app/app/projects/[id]/inputs/_actions.ts` — `generateFoundationAction()` |
| `messaging_foundation_approved` | `src/app/app/projects/[id]/narrative/_actions.ts` — `approveFoundationAction()` |
| `asset_opened` | `src/app/app/projects/[id]/overview/page.tsx` — `PageViewTracker` |
| `paywall_viewed` | `src/lib/billing/events.ts` — `emitBillingEvent()` |
| `upgrade_clicked` | `src/components/analytics/TrackedCta` on billing page |

---

## Connecting Messaging Events to the Provider

The `trackMessagingEvent()` function in `src/lib/messaging/service.ts` sends a
behavioral event to the configured messaging provider so it can trigger sequences.

Add calls to server actions **after** the analytics `track()` call:

```typescript
// In createProjectAction (projects/new/_actions.ts)
import { sendLifecycleEmail, trackMessagingEvent, identifyUser } from "@/lib/messaging";

// After project is created:
await trackMessagingEvent(user.id, user.email!, "project_created", {
  project_id: project.id,
  plan: workspace.plan,
});

// In signUp (auth/actions.ts) — after workspace created:
await sendLifecycleEmail("welcome", {
  to: email,
  variables: { first_name: firstName },
});
await identifyUser({
  userId: user.id,
  email: user.email!,
  firstName,
  plan: "free",
});
```

---

## Suppression Implementation Notes

Most suppression should be handled by the messaging provider (Loops, Customer.io, etc.)
using contact properties and sequence conditions. The recommended approach:

1. **Contact properties** — Set boolean flags on each contact when milestones are reached:
   - `onboarding_completed` (boolean)
   - `project_created` (boolean)
   - `foundation_generated` (boolean)
   - `asset_opened` (boolean)
   - `activated` (boolean — all three milestones)
   - `plan` (string — "free" | "paid_monthly")

2. **Sequence conditions** — In the provider dashboard, add entry conditions to each sequence:
   - "Send only if `foundation_generated = false` at time of send"
   - "Exit sequence when `foundation_generated` becomes true"

3. **Cooldowns** — Use the provider's native cooldown/frequency capping to prevent
   duplicate sends (e.g. `upgrade_paywall_hit` max once per 7 days).

4. **Unsubscribe** — Honor provider-level unsubscribes. Do not re-add contacts
   who have unsubscribed. Transactional emails (receipt, password reset) are exempt.

---

## Time Windows

| Message | Anchor event | Delay | Max window |
|---|---|---|---|
| `onboarding_reminder` | `signup_completed` | 24h | 72h after signup |
| `project_nudge` | `onboarding_completed` | 24h | 7 days after onboarding |
| `foundation_nudge` | `project_created` | 24h | 7 days after project creation |
| `asset_nudge` | `messaging_foundation_generated` | 24h | 7 days after generation |
| `upgrade_engaged_free` | `signup_completed` | 7 days | Once per user |
| `re_engagement` | Last event | 14 days | Cooldown 30 days |

---

## Free vs. Paid Routing

Free users who hit the project creation paywall should receive `upgrade_paywall_hit`
rather than `project_nudge`. The routing logic:

```
onboarding_completed fires
  → if plan = "paid_monthly": start timer for project_nudge
  → if plan = "free": no nudge (upgrade email handles it)

paywall_viewed fires
  → if plan = "free": queue upgrade_paywall_hit (with 7d cooldown)
  → if plan = "paid_monthly": no email (shouldn't hit paywall)
```

---

## Provider Activation Checklist

Before going live with lifecycle messaging:

- [ ] Choose provider: Resend (transactional) + Loops (lifecycle) or Customer.io (both)
- [ ] Implement the chosen provider in `src/lib/messaging/providers/`
- [ ] Set the provider as active in `providers/index.ts`
- [ ] Set required env vars (e.g. `RESEND_API_KEY`, `LOOPS_API_KEY`)
- [ ] Create contact properties in the provider dashboard (see list above)
- [ ] Create transactional email templates matching each `LifecycleMessageId`
- [ ] Wire `sendLifecycleEmail("welcome", ...)` into `signUp()` in auth/actions.ts
- [ ] Wire `identifyUser()` into `signUp()` and `createWorkspace()` in auth/actions.ts
- [ ] Wire `trackMessagingEvent()` into key server actions (see table above)
- [ ] Test each sequence in staging with a real email address
- [ ] Verify suppression logic works (e.g. onboarding nudge stops after project created)
- [ ] Set up unsubscribe footer in all lifecycle emails
