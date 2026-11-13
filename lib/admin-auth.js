import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";

const cookieName = "ro_admin_session";
const sessionDurationSeconds = 8 * 60 * 60;

export function hasAdminPassword() {
  return Boolean(process.env.ADMIN_PASSWORD);
}

export function verifyAdminPassword(candidate) {
  const password = process.env.ADMIN_PASSWORD;
  if (!password || typeof candidate !== "string") return false;

  const expected = createHash("sha256").update(password).digest();
  const provided = createHash("sha256").update(candidate).digest();
  return timingSafeEqual(expected, provided);
}

function sessionSignature(payload) {
  return createHmac("sha256", process.env.ADMIN_PASSWORD).update(payload).digest("base64url");
}

function cookieOptions() {
  const secure = process.env.VERCEL_ENV || process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `HttpOnly; SameSite=Strict; Path=/api/admin; Max-Age=${sessionDurationSeconds}${secure}`;
}

export function setAdminSession(response) {
  const expiresAt = Math.floor(Date.now() / 1000) + sessionDurationSeconds;
  const payload = `${expiresAt}.${randomBytes(18).toString("base64url")}`;
  const value = `${payload}.${sessionSignature(payload)}`;
  response.setHeader("Set-Cookie", `${cookieName}=${value}; ${cookieOptions()}`);
}

export function clearAdminSession(response) {
  response.setHeader(
    "Set-Cookie",
    `${cookieName}=; HttpOnly; SameSite=Strict; Path=/api/admin; Max-Age=0${process.env.VERCEL_ENV || process.env.NODE_ENV === "production" ? "; Secure" : ""}`
  );
}

export function hasAdminSession(request) {
  if (!process.env.ADMIN_PASSWORD) return false;

  const cookieHeader = request.headers.cookie || "";
  const token = cookieHeader
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${cookieName}=`))
    ?.slice(cookieName.length + 1);
  if (!token) return false;

  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [expiresText, nonce, signature] = parts;
  if (!/^\d+$/.test(expiresText) || !/^[A-Za-z0-9_-]+$/.test(nonce)) return false;

  const expiresAt = Number(expiresText);
  const now = Math.floor(Date.now() / 1000);
  if (!Number.isSafeInteger(expiresAt) || expiresAt <= now || expiresAt > now + sessionDurationSeconds) {
    return false;
  }

  const payload = `${expiresText}.${nonce}`;
  const expected = Buffer.from(sessionSignature(payload), "base64url");
  const provided = Buffer.from(signature, "base64url");
  return provided.length === expected.length && timingSafeEqual(expected, provided);
}
