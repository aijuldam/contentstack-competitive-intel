export { welcome } from "./welcome";
export { onboardingReminder } from "./onboarding-reminder";
export { projectNudge } from "./project-nudge";
export { foundationNudge } from "./foundation-nudge";
export { assetNudge } from "./asset-nudge";
export { upgradePaywallHit } from "./upgrade-paywall-hit";
export { upgradeEngagedFree } from "./upgrade-engaged-free";
export { activationSuccess } from "./activation-success";
export { reEngagement } from "./re-engagement";

import { welcome } from "./welcome";
import { onboardingReminder } from "./onboarding-reminder";
import { projectNudge } from "./project-nudge";
import { foundationNudge } from "./foundation-nudge";
import { assetNudge } from "./asset-nudge";
import { upgradePaywallHit } from "./upgrade-paywall-hit";
import { upgradeEngagedFree } from "./upgrade-engaged-free";
import { activationSuccess } from "./activation-success";
import { reEngagement } from "./re-engagement";
import type { EmailTemplate, LifecycleMessageId } from "../types";

export const EMAIL_TEMPLATES: Record<LifecycleMessageId, EmailTemplate> = {
  welcome,
  onboarding_reminder: onboardingReminder,
  project_nudge: projectNudge,
  foundation_nudge: foundationNudge,
  asset_nudge: assetNudge,
  upgrade_paywall_hit: upgradePaywallHit,
  upgrade_engaged_free: upgradeEngagedFree,
  activation_success: activationSuccess,
  re_engagement: reEngagement,
};
