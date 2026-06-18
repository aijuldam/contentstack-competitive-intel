# Launch Plan — Go-to-Market Taste

Single source of truth for the MVP launch. All positioning, audience, channels,
KPIs, checklist, and decisions about what ships now vs what waits.

---

## 1. Launchable Story (What Is Actually True Right Now)

Go-to-Market Taste is a working product. The core workflow functions end-to-end:

- Signup → workspace creation → project creation
- Four-field intake → Messaging Foundation generation (AI pipeline via Anthropic)
- Foundation review with verified/inferred claim tagging
- Foundation approval → three asset editors (pitch deck, one-pager, sales enablement deck)
- HTML export
- Entitlement-gated free vs paid plan
- Analytics scaffolding (ready to activate with PostHog)
- Lifecycle messaging scaffolding (ready to activate with Loops or Resend)

**Not yet live (honest):**
- Stripe checkout (billing UI is in the product; checkout activation coming shortly)
- PDF/PPTX export (HTML is available)
- Team/multi-user workspaces
- In-product feedback mechanism

**Launch posture:** This is a soft launch to qualified early users, not a mass public launch. The goal is 10–20 real activations in week 1 from outreach, not 500 signups from a viral post.

---

## 2. Launch Audience

### Primary ICP (who to target first)

**B2B SaaS founder or PMM, Seed to Series B, 5–100 employees.**

More specifically:
- Has a product in market with real customers but messaging that lives in the founder's head or in a stale deck
- Has tried using GPT for messaging and got generic output that didn't hold up in a real buyer conversation
- Understands MEDDIC or CotM (or is aware of the concepts)
- Does not have a full-time PMM — or has one PMM trying to support 3–5 AEs
- Is comfortable paying €5/month for a workflow tool without a procurement process

**Secondary ICP (also worth targeting):**
- GTM consultant or fractional PMM who builds messaging deliverables for multiple B2B SaaS clients
- Account executive at a B2B SaaS company who wants a structured sales playbook without waiting for the PMM team

### Who to avoid in launch week
- Consumer companies (no fit)
- Enterprise teams with a full PMM org (product is not enterprise-grade yet)
- Anyone who needs PDF export in the first 30 days (it's not ready)
- Developers who want an API (not a use case we support)

---

## 3. Entry Offer

**Recommended:** Lead with the free plan as the risk-free entry point, but optimize for paid conversions immediately.

The free plan gives qualified users enough to understand the product (framework guides, examples) without giving away the full value. The paid workflow (€5/month) should be the primary conversion goal from week 1.

**Conversion logic:**
- Free user experiences the framework → sees what they're missing → hits paywall → upgrades
- OR: Direct outreach converts directly to paid via the signup link with `?plan=paid_monthly`
- Warm outreach should send people directly to the paid workflow CTA, not the generic homepage

**Entry URL for warm outreach:** `{app_url}/signup?plan=paid_monthly`
**Entry URL for cold or uncertain audience:** `{app_url}` (homepage)

---

## 4. Channel Plan

Ranked by expected usefulness for week 1.

### Channel 1: Warm outreach (primary)
**Why:** The fastest path to real feedback. People who know you will try the product honestly and tell you what doesn't work. No algorithm required.
**Target:** 20–30 personal messages to PMMs, founders, and GTM leads in your network.
**Message:** See `docs/launch/outreach-sequences.md` — sequence 1 and 2.
**Goal:** 10–15 signups with real activation.

### Channel 2: LinkedIn founder post (secondary)
**Why:** B2B SaaS PMMs and founders live on LinkedIn. A personal post with a clear product demo or workflow description reaches the exact audience without paid ads.
**Format:** Long-form text post (no image required). Hook in first 2 lines. Link in first comment.
**Post:** See `docs/launch/asset-pack.md` — section 3.
**Goal:** 50–100 additional signups from distribution if post performs.
**Timing:** Day 1 of launch, Tuesday or Wednesday morning EU timezone.

### Channel 3: Small PMM communities (tertiary)
**Why:** Product marketing practitioners gather in a few focused communities. A genuine "I built this, here's what it produces, tell me what's wrong with it" post performs well there if you're a member and contribute normally.
**Communities to consider:**
- Product Marketing Alliance community (if member)
- PMM subreddit (r/productmarketing)
- Demand Curve or relevant growth Slack groups
- Any founder Slack community you're active in
**Framing:** Share honestly as a founder-builder showing early product. Ask for feedback, not signups.
**Goal:** 10–30 signups from community posts.

### Channel 4: Product Hunt (optional, week 2+)
**Why it might fit:** Go-to-Market Taste has a clear job-to-be-done, a free plan, and a low price point — all things that do well on Product Hunt.
**Why to wait:** You want real user feedback and a few proof-of-concept activations before a public launch surface. Use PH in week 2 or 3 after you know the core workflow holds up for real users.
**If you launch on PH:** Prepare a short GIF demo of the intake → foundation → pitch deck flow. This is the clearest demonstration of the product.

### What to skip for now
- Twitter/X (wrong audience for this product)
- Google Ads (premature at MVP)
- Newsletter swaps or cold email blasts (wrong moment — you need qualitative feedback, not volume)
- Hacker News "Show HN" (possible but lower priority than warm channels for week 1)

---

## 5. Launch Execution Checklist

### Pre-launch (before going live)

**Product:**
- [ ] `ANTHROPIC_API_KEY` set in production environment
- [ ] Foundation generation pipeline tested end-to-end in production
- [ ] All three asset editors accessible and editable
- [ ] HTML export functional for at least one asset type
- [ ] Error boundaries in place (global, app, project) — done ✓
- [ ] Analytics events firing (verify in browser console or PostHog)
- [ ] Settings page shows real user email, not placeholder
- [ ] Billing page shows correct plan, honest disabled state for Stripe

**Copy and positioning:**
- [ ] Landing page hero matches launch messaging framework
- [ ] Pricing page copy is accurate to current plan entitlements
- [ ] FAQ page has updated plan names (Free / paid — not Starter / Pro) — done ✓
- [ ] Login page says "Go-to-Market Taste" (not "Product Marketing Taste") — done ✓
- [ ] All "coming soon" labels in UI are accurate and not embarrassing on launch day

**Tracking:**
- [ ] Confirm `signup_completed` fires after new account creation
- [ ] Confirm `project_created` fires after first project
- [ ] Confirm `messaging_foundation_generated` fires after generation
- [ ] Confirm `asset_opened` fires when visiting project overview
- [ ] Verify no double-counting of page view events

**Outreach prep:**
- [ ] List of 20–30 warm contacts compiled with name, channel, and personal note angle
- [ ] List of 10–15 PMM/founder targets for direct outreach with LinkedIn profiles
- [ ] LinkedIn launch post drafted and queued (see asset-pack.md section 3)
- [ ] Launch email drafted and ready to send (see asset-pack.md section 4)
- [ ] Feedback tracking spreadsheet created (name, sent date, signed up, activated, feedback)

---

### Launch Day

**Morning:**
- [ ] Publish LinkedIn founder launch post
- [ ] Link in first comment immediately
- [ ] Begin sending warm outreach DMs (aim for 10–15 in first 2 hours)
- [ ] Send launch announcement email to personal network

**Midday:**
- [ ] Monitor signup flow — confirm onboarding is not breaking
- [ ] Check error boundaries — confirm no unexpected crashes
- [ ] Respond to any LinkedIn comments within 2 hours
- [ ] Check DM replies — prioritize anyone who signed up

**Evening:**
- [ ] Tally signups from launch day
- [ ] Note any users who reached the project creation step
- [ ] Identify anyone who completed foundation generation → reach out personally

---

### Week 1 Post-Launch

**Daily:**
- [ ] Send 5–10 additional warm outreach messages
- [ ] Check analytics for key funnel events
- [ ] Respond to any in-product feedback or email replies within 24 hours

**By day 3:**
- [ ] Send follow-up to anyone who signed up but hasn't created a project
- [ ] Review any feedback received on foundation output quality
- [ ] Note the 3 most common objections or sticking points from conversations

**By day 7:**
- [ ] Send feedback request to anyone who completed the full workflow (sequence 5)
- [ ] Assess PMM community posts if sent (engagement, signups)
- [ ] Decide whether to post in a community this week or wait
- [ ] Prepare week 1 KPI summary (see section 7 below)
- [ ] Identify top 3 product improvements based on actual user feedback

---

## 6. Public vs Private at Launch

### Public-facing (available to anyone)
- Landing page, pricing page, FAQ, examples, product page
- Signup (open — anyone can create a free account)
- Free plan content (framework guides, examples)

### Warm network only (not announced broadly)
- Direct outreach to PMM/founder contacts
- Community posts (kept to communities you're already active in — not broad syndication)
- Early access invites via `?plan=paid_monthly` signup link

### Hold back until post-launch feedback
- Product Hunt launch — wait until you have at least 5 successful activations and real feedback
- PR or press — premature before you have proof points
- Paid advertising — premature before activation funnel is proven
- Blog/content marketing — not worth the effort in week 1
- Influencer or newsletter partnerships — wait for signal on what the product actually does for users

### The soft launch principle
Week 1 is a learning exercise, not a brand exercise. The goal is not to have a launch moment — it is to have 10–20 real users go through the workflow and tell you what doesn't hold up. Optimize for conversation depth, not signup volume.

---

## 7. Launch KPIs

### Primary KPIs (activation funnel)

| KPI | Week 1 Target | Why It Matters |
|---|---|---|
| Signups | 20–40 | Total qualified users entering the funnel |
| Onboarding completion rate | >80% | Workspace creation; should be near-automatic |
| Project creation rate | >50% of paid/onboarding-complete users | First real engagement with the product |
| Foundation generation rate | >60% of project-created users | Core value delivery moment |
| First asset open rate | >70% of foundation-generated users | Activation milestone completion |
| Activation milestone reached | 5–10 total | The definition of a real early user |

### Conversion KPIs

| KPI | Week 1 Target | Why It Matters |
|---|---|---|
| Free → paid upgrade rate | Track only (no target yet) | Too early for a meaningful rate target |
| Paid signups from outreach | 5–10 | Validates directness of the pitch |

### Qualitative KPIs (just as important)

| KPI | Week 1 Target |
|---|---|
| Feedback conversations | 5+ (reply to email or direct message) |
| Negative feedback items logged | As many as possible — this is good |
| "The output was too generic" instances | Track by field (which input field correlates) |
| "I would pay for this" unprompted | Track any instance |
| "I wouldn't pay for this because..." | Track and categorize reason |

### What to avoid tracking in week 1
- Page views (not meaningful without conversion context)
- Social media impressions
- LinkedIn post likes/shares (vanity — track signups from link in comments instead)

---

## 8. What Is Ready Now vs Still Rough

### Ready now — can confidently represent these to users
- Four-field intake → Messaging Foundation generation
- Verified/inferred claim tagging in the foundation
- Three asset editors (pitch deck, one-pager, sales enablement deck)
- Foundation approval and lock
- HTML export
- Free vs paid plan distinction
- Entitlement gating (paywalls)
- Analytics event tracking (console/dev mode — needs PostHog to be visible)
- Error handling (error boundaries, 404 page)

### Still rough — be honest about these with early users
- Stripe checkout not yet live (tell users this directly; the billing page communicates it)
- Asset content is generated from the foundation but asset editors show the content structurally — UX for editing and saving is functional but not polished
- No in-product feedback mechanism (rely on email for now)
- No team collaboration (single-user workspaces)
- No mobile-optimized experience for the app (landing page is mobile-responsive; app is not optimized for mobile)
- Version history UI is a placeholder ("coming in Phase 2")

### Defer until post-launch
- PDF/PPTX export
- PostHog analytics wiring
- Lifecycle email activation (Loops or Resend)
- Stripe webhook and plan activation
- Team seats
- API access

---

## 9. Next Steps After Week 1

After the first week of real users:
1. **Identify the 3 biggest output quality gaps** — which sections of the foundation or assets consistently disappointed users?
2. **Identify the biggest conversion gap in the funnel** — where are people dropping off (onboarding? project creation? foundation? assets?)
3. **Decide on Stripe activation timing** — if even 3–5 people say they'd pay, activate Stripe immediately
4. **Decide on PostHog timing** — activate analytics for real data visibility
5. **Review the lifecycle messaging map** — which email sequences would have helped the users you saw drop off?
6. **Set week 2 targets** based on week 1 actuals, not guesses
