import { connectDatabase } from "../../lib/neon.js";
import { methodNotAllowed, sendApiError, sendJson } from "../../lib/api-http.js";
import {
  hasAdminPassword,
  setAdminSession,
  verifyAdminPassword,
} from "../../lib/admin-auth.js";

const attemptWindowMs = 15 * 60 * 1000;
const maxAttempts = 5;

function getClientIp(request) {
  const forwardedFor = request.headers["x-forwarded-for"];
  const ip = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor;
  return typeof ip === "string" ? ip.split(",")[0].trim() || "unknown" : "unknown";
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    methodNotAllowed(response, ["POST"]);
    return;
  }
  if (!hasAdminPassword()) {
    sendJson(response, 503, { error: "Admin access is not configured for this deployment." });
    return;
  }

  const password = request.body && typeof request.body === "object"
    ? request.body.password
    : undefined;
  if (typeof password !== "string") {
    sendJson(response, 400, { error: "Enter the admin password." });
    return;
  }

  try {
    const sql = await connectDatabase();
    const ip = getClientIp(request);
    const existing = await sql`
      SELECT attempts, window_started_at
      FROM admin_login_attempts
      WHERE ip = ${ip}
    `;
    const attempt = existing[0];
    if (
      attempt &&
      Date.now() - new Date(attempt.window_started_at).getTime() < attemptWindowMs &&
      Number(attempt.attempts) >= maxAttempts
    ) {
      sendJson(response, 429, { error: "Too many login attempts. Try again later." });
      return;
    }

    if (!verifyAdminPassword(password)) {
      await sql`
        INSERT INTO admin_login_attempts (ip, attempts, window_started_at)
        VALUES (${ip}, 1, NOW())
        ON CONFLICT (ip) DO UPDATE SET
          attempts = CASE
            WHEN admin_login_attempts.window_started_at < NOW() - INTERVAL '15 minutes' THEN 1
            ELSE admin_login_attempts.attempts + 1
          END,
          window_started_at = CASE
            WHEN admin_login_attempts.window_started_at < NOW() - INTERVAL '15 minutes' THEN NOW()
            ELSE admin_login_attempts.window_started_at
          END
      `;
      sendJson(response, 401, { error: "Incorrect admin password." });
      return;
    }

    await sql`DELETE FROM admin_login_attempts WHERE ip = ${ip}`;
    setAdminSession(response);
    sendJson(response, 200, { ok: true });
  } catch (error) {
    sendApiError(response, error, "Failed to authenticate admin:", "Admin login failed. Please try again.");
  }
}
