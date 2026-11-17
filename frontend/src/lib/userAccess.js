export const DEFAULT_ADMIN_EMAILS = [
  "ganeshvanamala16@gmail.com",
  "roopasri061216@gmail.com"
];

export function isGuestUser(user) {
  return !user || String(user.uid || "").startsWith("guest-");
}

export function isDefaultAdminEmail(email) {
  const normalized = String(email || "").trim().toLowerCase();
  return Boolean(normalized && DEFAULT_ADMIN_EMAILS.includes(normalized));
}

export function isAdminRole(role) {
  const normalized = String(role || "").trim().toLowerCase();
  return normalized === "admin" || normalized === "super-admin";
}
