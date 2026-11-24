// Password lock for /admin. Runs on the server (proxy + login route), never in the browser.
// The password lives only in the ADMIN_PASSWORD environment variable (Vercel → Settings → Environment Variables).
// The cookie holds a signature derived from the password, so changing the password logs everyone out.

export const SESSION_COOKIE = "ecospin_admin";
export const SESSION_DAYS = 30;

const enc = new TextEncoder();

async function hmac(key: string, message: string) {
  const k = await crypto.subtle.importKey("raw", enc.encode(key), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", k, enc.encode(message));
  return Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, "0")).join("");
}

function sameText(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export const adminPassword = () => process.env.ADMIN_PASSWORD?.trim() || "";

/** The value stored in the login cookie. */
export async function sessionToken() {
  const pw = adminPassword();
  return pw ? hmac(pw, "ecospin-admin-session-v1") : "";
}

export async function isValidSession(cookie: string | undefined) {
  const expected = await sessionToken();
  return Boolean(expected && cookie && sameText(cookie, expected));
}

export async function checkPassword(attempt: string) {
  const pw = adminPassword();
  if (!pw) return false;
  // Compare fixed-length digests so the time taken doesn't reveal the password length.
  const [a, b] = await Promise.all([hmac("cmp", attempt), hmac("cmp", pw)]);
  return sameText(a, b);
}

/** Only allow redirects back inside the admin panel. */
export function safeNext(next: string | null | undefined) {
  return next && next.startsWith("/admin") && !next.startsWith("//") && !next.startsWith("/admin/login") ? next : "/admin";
}
