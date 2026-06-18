# User Interview & Feedback Prompts
# Go-to-Market Taste

Guidelines:
- Listen more than you talk. Aim for 80/20 user-to-interviewer speaking ratio.
- Never ask "did you like it?" Ask what they did and what they expected.
- When someone says something interesting, ask "can you say more about that?" before moving on.
- Take verbatim notes — exact words reveal the user's mental model.
- End every interview with: "Is there anything I didn't ask that you think I should know?"

---

## Interview 1 — First-Week User (general activation follow-up)

**When to use:** 3–7 days after signup, regardless of activation status.
**Goal:** Understand what drove signup, what happened next, where they got stuck.
**Duration:** 20–30 minutes.

**Setup:**
> "Thanks for trying Go-to-Market Taste. I'm trying to understand what the experience is actually like — no selling, just learning. Everything you say will make the product better. OK to record?"

**Questions:**

1. What were you hoping to accomplish when you signed up?
2. Walk me through what you actually did after you created your account.
3. Was there a moment where you felt unsure what to do next? What was that?
4. When you looked at the intake form, what was your first reaction?
5. Did you complete the intake? If not — what stopped you?
6. [If they generated a Foundation] When you saw the Foundation output, what did you think? Was it what you expected?
7. [If they opened an asset] What did you do with the asset after you opened it?
8. What's the thing that took the most time to figure out?
9. What would have made the first session meaningfully better?
10. Is there anything I didn't ask that I should know?

---

## Interview 2 — Activation Follow-up (completed full workflow)

**When to use:** User has hit the activation milestone: project_created + foundation_generated + asset_opened.
**Goal:** Understand the perceived value, what worked, what didn't, and conversion intent.
**Duration:** 20 minutes.

**Setup:**
> "You've been through the full workflow — that's exactly what I want to understand better. I want to know what the experience was like from your point of view."

**Questions:**

1. Before we talk about the product — what's the messaging problem you were trying to solve when you found this?
2. After going through the full workflow, did you get what you came for? What specifically?
3. What was the most useful part?
4. What felt like wasted effort?
5. When you look at the asset you generated — would you actually use it? Send it to someone? Why or why not?
6. Was the Foundation (the narrative output) accurate to your product? Where did it get things right or wrong?
7. What would need to be true for this to be worth €5/month to you?
8. Who else on your team would use this, if anyone?
9. Is there anything I didn't ask that I should know?

---

## Interview 3 — Non-Activated User (signed up, didn't complete workflow)

**When to use:** User signed up 5–14 days ago and has not yet created a project or not yet generated a Foundation.
**Goal:** Understand the specific point of abandonment and why. Avoid defensiveness.
**Duration:** 15 minutes.

**Setup:**
> "I noticed you created an account but haven't been back. I'm not trying to convince you of anything — I just want to understand what happened. Honest feedback is genuinely useful."

**Questions:**

1. What were you hoping to try when you signed up?
2. What happened when you got into the product?
3. Did anything feel unclear or confusing?
4. Was there a specific step where you stopped? What was happening at that point?
5. What would have made it worth continuing?
6. Did the product look like it would solve your actual problem? Or was there a mismatch?
7. What are you doing instead to solve the same problem?
8. Is there anything I didn't ask that I should know?

**Notes:** Do not pitch the product during this interview. Do not defend design decisions. The goal is diagnosis, not conversion.

---

## Interview 4 — Free User Who Did Not Upgrade

**When to use:** User is active on the free plan (viewed content, maybe used the framework pages) but has not started a project or upgraded.
**Goal:** Understand the perceived value of the free offering and the barrier to converting.
**Duration:** 15 minutes.

**Setup:**
> "You've been using the free plan for a bit — I'd love to understand what's been useful and what's been missing."

**Questions:**

1. What have you been using most on the free plan?
2. Has any of the content (frameworks, examples, templates) been useful in your actual work? Concretely — how?
3. What would have to be true for you to create a project and generate a Foundation?
4. Have you seen the paid plan features? If yes — what's your reaction to what's included?
5. Does €5/month feel like the right price, too high, or unclear? (Don't justify — just listen.)
6. What's the main thing holding you back right now?
7. If we added [specific feature they might want] — would that change anything?
8. Is there anything I didn't ask that I should know?

---

## Interview 5 — Paid User Who Completed the Workflow

**When to use:** User is on the paid plan and has generated at least one asset.
**Goal:** Understand satisfaction, actual use of outputs, and potential retention/expansion signals.
**Duration:** 20 minutes.

**Setup:**
> "You're one of our earliest paid users, which means your experience has a lot of weight. I want to understand what value you've gotten and where we can improve."

**Questions:**

1. What triggered you to upgrade to the paid plan?
2. How long did it take from signing up to generating your first asset?
3. What did you do with the output? Did it make it into a real document, deck, or conversation?
4. What part of the output surprised you positively?
5. What part disappointed you or needed significant rewriting?
6. How does the quality compare to writing this from scratch? Or from using ChatGPT?
7. Would you use this for a second project? What would that project be?
8. Who else in your company could use this? Have you shown it to anyone?
9. If you were describing this product to a PMM peer, what would you say?
10. Is there anything I didn't ask that I should know?

---

## Interview 6 — User Who Saw a Paywall and Didn't Upgrade

**When to use:** User hit a paywall (paywall_viewed event fired) but did not start checkout.
**Goal:** Understand what specifically blocked conversion — price, timing, trust, or value gap.
**Duration:** 10–15 minutes.

**Setup:**
> "I noticed you hit one of the upgrade prompts but didn't continue. I'm not going to pitch you — I just want to understand what you were thinking at that moment."

**Questions:**

1. What were you trying to do when you saw the upgrade prompt?
2. What was your first reaction when you saw the pricing?
3. What made you decide not to upgrade at that moment?
4. Was it a price concern, a timing concern, or something else?
5. Had you seen enough of the product to evaluate whether it was worth it?
6. What would need to be different for you to have upgraded in that moment?
7. Do you think you'll come back and try the paid features? What would bring you back?
8. Is there anything I didn't ask that I should know?

---

## Short Feedback Prompts (Async / Email)

Use these for written feedback via email when a full interview isn't possible.

**After signup (24h):**
> "You signed up yesterday — just checking in. Did you get a chance to try the intake form? What was your first impression?"

**After project creation:**
> "You created your first project — nice one. Two quick questions: 1) What made you fill it out today? 2) Any part of the form that felt unclear?"

**After foundation generation:**
> "You generated your Messaging Foundation. Quick question: does the output feel accurate to your product, or is something off? One sentence is plenty."

**After paywall hit (no upgrade):**
> "You looked at upgrading but didn't continue. Honest question: what stopped you? Price, timing, something else?"

**After cancellation (if/when Stripe is live):**
> "You cancelled your subscription — I'm sorry to see you go. If you're open to it: what was the main reason? One sentence helps a lot."
