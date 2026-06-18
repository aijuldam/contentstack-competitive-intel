# Lifecycle Messaging Map — Go-to-Market Taste

Covers all nine MVP lifecycle messages: who gets them, when, what they say,
and what suppresses them.

The primary activation milestone is:
**project_created + messaging_foundation_generated + asset_opened**

All onboarding nudges should suppress once this milestone is reached.

---

## 1. Welcome

| Field | Value |
|---|---|
| **ID** | `welcome` |
| **Channel** | Email |
| **Trigger** | `signup_completed` event fires |
| **Trigger type** | Event |
| **Audience** | All new signups |
| **Goal** | Get the user to complete workspace setup and understand the workflow |
| **CTA** | "Set up your workspace" → `/onboarding` |
| **Suppression** | Already received (send once per user) |

**Subject:** Your Go-to-Market Taste account is ready

**Copy intent:** Explain the four-step workflow concisely. Frame the value — one intake, one approved narrative, three assets. Set expectations about what the model does and doesn't invent.

---

## 2. Onboarding Reminder

| Field | Value |
|---|---|
| **ID** | `onboarding_reminder` |
| **Channel** | Email |
| **Trigger** | 24 hours after `signup_completed` if `onboarding_completed` has not fired |
| **Trigger type** | Time-based fallback |
| **Audience** | Signed up but workspace not yet created |
| **Goal** | Complete workspace creation |
| **CTA** | "Create your workspace" → `/onboarding` |
| **Suppression** | `onboarding_completed` has fired. More than 72h since signup (window closed). |

**Subject:** One step left to start using Go-to-Market Taste

**Copy intent:** Low-friction. One clear action. Don't oversell the product — they already signed up.

---

## 3. Project Creation Nudge

| Field | Value |
|---|---|
| **ID** | `project_nudge` |
| **Channel** | Email |
| **Trigger** | 24 hours after `onboarding_completed` if `project_created` has not fired |
| **Trigger type** | Time-based fallback |
| **Audience** | Workspace created, paid plan, no project yet |
| **Goal** | Create first project and fill in the four intake fields |
| **CTA** | "Create your first project" → `/app/projects/new` |
| **Suppression** | `project_created` has fired. User is on free plan (send upgrade email instead). More than 7 days since onboarding. |

**Subject:** Your workspace is ready — add your first product

**Copy intent:** Explain the four intake fields concretely. Make the effort feel small ("less than 10 minutes from blank to first draft").

---

## 4. Messaging Foundation Nudge

| Field | Value |
|---|---|
| **ID** | `foundation_nudge` |
| **Channel** | Email |
| **Trigger** | 24 hours after `project_created` if `messaging_foundation_generated` has not fired |
| **Trigger type** | Time-based fallback |
| **Audience** | Has at least one project, no foundation generated yet |
| **Goal** | Generate the Messaging Foundation |
| **CTA** | "Generate your Messaging Foundation" → `/app/projects/{project_id}/inputs` |
| **Suppression** | `messaging_foundation_generated` has fired. More than 7 days since `project_created`. Sent before (once per user). |

**Subject:** Your intake is saved — generate your Messaging Foundation

**Copy intent:** Explain what the Messaging Foundation actually produces — name the MEDDIC elements and CotM dimensions. Make it clear this is the step that unlocks assets.

---

## 5. Asset Nudge

| Field | Value |
|---|---|
| **ID** | `asset_nudge` |
| **Channel** | Email |
| **Trigger** | 24 hours after `messaging_foundation_generated` if `asset_opened` has not fired |
| **Trigger type** | Time-based fallback |
| **Audience** | Foundation generated and approved, no asset opened yet |
| **Goal** | Open the first generated asset |
| **CTA** | "Open your pitch deck" → `/app/projects/{project_id}/assets/pitch-deck` |
| **Suppression** | `asset_opened` has fired. More than 7 days since `messaging_foundation_generated`. Sent before (once per user). |

**Subject:** Your Messaging Foundation is ready — open your pitch deck

**Copy intent:** Describe all three assets concretely so the user understands what's waiting for them. Point them at the pitch deck as the first asset to open.

---

## 6. Upgrade — Paywall Hit

| Field | Value |
|---|---|
| **ID** | `upgrade_paywall_hit` |
| **Channel** | Email |
| **Trigger** | `paywall_viewed` event fires |
| **Trigger type** | Event |
| **Audience** | Free plan users who just hit a feature gate |
| **Goal** | Convert to paid plan |
| **CTA** | "Start for €5/month" → `/app/billing` |
| **Suppression** | Already on paid plan. Sent within the last 7 days (cooldown). `checkout_completed` has fired. |

**Subject:** You tried to access a paid feature

**Copy intent:** Direct and honest. List what unlocks specifically. Don't apologize for the paywall — frame it as an explanation of the product tiers.

---

## 7. Upgrade — Engaged Free User

| Field | Value |
|---|---|
| **ID** | `upgrade_engaged_free` |
| **Channel** | Email |
| **Trigger** | 7 days post signup; user has `pricing_page_viewed` or `free_resources_clicked` ≥ 2 times; `checkout_completed` not fired |
| **Trigger type** | Time-based, condition-gated |
| **Audience** | Free users who've engaged with resources but haven't upgraded |
| **Goal** | Convert to paid by connecting frameworks to applied workflow |
| **CTA** | "Start for €5/month" → `/app/billing` |
| **Suppression** | Already on paid plan. `checkout_completed` fired. Sent before (once per user). Never logged in after signup. |

**Subject:** The frameworks are just the starting point

**Copy intent:** Acknowledge that they've been using the free content. Bridge from "understanding the frameworks" to "applying them to your own product." Respect their intelligence — don't oversell.

---

## 8. Activation Success

| Field | Value |
|---|---|
| **ID** | `activation_success` |
| **Channel** | Email |
| **Trigger** | `asset_opened` fires for the first time ever |
| **Trigger type** | Event |
| **Audience** | Paid users completing the activation milestone |
| **Goal** | Reinforce delivered value, encourage export and iteration |
| **CTA** | "Review your pitch deck" → `/app/projects/{project_id}/assets/pitch-deck` |
| **Suppression** | Sent before (once per user — first asset open only). User is on free plan. |

**Subject:** You've got your first GTM assets

**Copy intent:** Confirm what just happened. Suggest what to do next (review, edit, export). Open a feedback loop — explicitly invite replies for this early-stage product.

---

## 9. Re-engagement

| Field | Value |
|---|---|
| **ID** | `re_engagement` |
| **Channel** | Email |
| **Trigger** | 14 days since any tracked event from this user |
| **Trigger type** | Time-based fallback |
| **Audience** | All users with no activity in 14 days. Paid users prioritized. |
| **Goal** | Bring the user back to their most recent unfinished step |
| **CTA** | "Pick up where you left off" → `/app/projects` |
| **Suppression** | Any event fired in the past 14 days. Sent within the past 30 days. User has unsubscribed. |

**Subject:** Your project is still here

**Copy intent:** Low-pressure. Remind them where they likely left off (three possible stages). No guilt. No FOMO. Just a clear path back.

---

## Suppression Logic Summary

| Condition | Effect |
|---|---|
| Activation milestone reached | Suppress all onboarding nudges for this user |
| `checkout_completed` fired | Suppress all upgrade emails |
| User on paid plan | Suppress `upgrade_paywall_hit` and `upgrade_engaged_free` |
| Email sent within cooldown window | Suppress duplicate sends (see per-message rules above) |
| User unsubscribed from lifecycle emails | Suppress all lifecycle messages (honor provider unsubscribe) |
| More than N days since anchor event | Suppress time-based fallbacks outside their window |
