// Public exports for the messaging library.
// Import from here, not from submodules directly.

export { sendLifecycleEmail, identifyUser, trackMessagingEvent } from "./service";
export { LIFECYCLE_MESSAGES, getMessageById, getMessagesByTriggerEvent } from "./triggers";
export { EMAIL_TEMPLATES } from "./templates";
export { PAYWALL_COPY, getPaywallCopy } from "./in-app/paywall";
export { EMPTY_STATE_COPY, getEmptyStateCopy } from "./in-app/empty-states";
export { SUCCESS_COPY, getSuccessCopy } from "./in-app/success-states";
export type {
  LifecycleMessageId,
  EmailTemplate,
  InAppPrompt,
  LifecycleMessage,
  MessageChannel,
  Cta,
} from "./types";
export type { PaywallContext } from "./in-app/paywall";
export type { EmptyStateContext } from "./in-app/empty-states";
export type { SuccessContext } from "./in-app/success-states";
