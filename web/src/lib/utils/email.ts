// Shared work-email validation — importable by both client and server code.

const BLOCKED_DOMAINS = new Set([
  "gmail.com", "googlemail.com",
  "yahoo.com", "ymail.com",
  "hotmail.com", "outlook.com", "live.com", "msn.com",
  "icloud.com", "me.com",
  "aol.com",
  "proton.me", "protonmail.com",
  "gmx.com",
  "zoho.com",
  "mail.com",
]);

export function isWorkEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase().trim();
  return !!domain && !BLOCKED_DOMAINS.has(domain);
}
