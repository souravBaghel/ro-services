import { createServer } from "node:http";
import { existsSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { DatabaseSync } from "node:sqlite";
import { parseBooking } from "./lib/booking-validation.js";

const envFile = resolve(".env");
if (existsSync(envFile)) process.loadEnvFile(envFile);

const port = Number(process.env.API_PORT || 3001);
const databasePath = resolve(process.env.DB_PATH || "data/bookings.sqlite");
const maxBodySize = 16 * 1024;
const sessionDuration = 8 * 60 * 60 * 1000;
const adminPassword = process.env.ADMIN_PASSWORD;
const adminPasswordHash = adminPassword
  ? createHash("sha256").update(adminPassword).digest()
  : null;
const adminSessions = new Map();
const loginAttempts = new Map();

mkdirSync(dirname(databasePath), { recursive: true });

const database = new DatabaseSync(databasePath);
database.exec(`
  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    service TEXT NOT NULL,
    address TEXT NOT NULL,
    preferred_date TEXT,
    issue TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`);

const insertBooking = database.prepare(`
  INSERT INTO bookings (name, phone, service, address, preferred_date, issue)
  VALUES (?, ?, ?, ?, ?, ?)
`);
const updateBooking = database.prepare(`
  UPDATE bookings
  SET name = ?, phone = ?, service = ?, address = ?, preferred_date = ?, issue = ?
  WHERE id = ?
`);
const deleteBooking = database.prepare("DELETE FROM bookings WHERE id = ?");
const listBookings = database.prepare(`
  SELECT
    id,
    name,
    phone,
    service,
    address,
    preferred_date AS preferredDate,
    issue,
    created_at AS createdAt
  FROM bookings
  ORDER BY id DESC
`);

function sendJson(response, status, payload) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  response.end(JSON.stringify(payload));
}

function readJsonBody(
  request,
  response,
  callback,
  invalidJsonMessage = "Please submit valid JSON.",
  tooLargeMessage = "Request body is too large."
) {
  let body = "";
  let tooLarge = false;
  request.on("data", (chunk) => {
    if (tooLarge) return;
    body += chunk;
    if (Buffer.byteLength(body) > maxBodySize) {
      tooLarge = true;
      body = "";
    }
  });

  request.on("end", () => {
    if (tooLarge) {
      sendJson(response, 413, { error: tooLargeMessage });
      return;
    }

    try {
      callback(JSON.parse(body));
    } catch (error) {
      if (error instanceof SyntaxError) {
        sendJson(response, 400, { error: invalidJsonMessage });
        return;
      }
      console.error("Failed to process request:", error);
      sendJson(response, 500, { error: "The request could not be processed." });
    }
  });
}

function getAdminSession(request) {
  const cookies = request.headers.cookie || "";
  const sessionId = cookies
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith("ro_admin_session="))
    ?.slice("ro_admin_session=".length);
  if (!sessionId) return false;

  const expiresAt = adminSessions.get(sessionId);
  if (!expiresAt || expiresAt <= Date.now()) {
    adminSessions.delete(sessionId);
    return false;
  }
  return true;
}

function clearAdminCookie(response) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  response.setHeader(
    "Set-Cookie",
    `ro_admin_session=; HttpOnly; SameSite=Strict; Path=/api/admin; Max-Age=0${secure}`
  );
}

function isCorrectAdminPassword(candidate) {
  if (!adminPasswordHash) return false;
  const candidateHash = createHash("sha256").update(candidate).digest();
  return timingSafeEqual(adminPasswordHash, candidateHash);
}

function isLoginRateLimited(request) {
  const now = Date.now();
  const address = request.socket.remoteAddress || "unknown";
  const attempts = loginAttempts.get(address);
  if (!attempts || attempts.resetAt <= now) {
    loginAttempts.set(address, { count: 0, resetAt: now + 15 * 60 * 1000 });
    return false;
  }
  return attempts.count >= 5;
}

function recordFailedLogin(request) {
  const address = request.socket.remoteAddress || "unknown";
  const attempts = loginAttempts.get(address);
  if (attempts && attempts.resetAt > Date.now()) {
    attempts.count += 1;
  } else {
    loginAttempts.set(address, { count: 1, resetAt: Date.now() + 15 * 60 * 1000 });
  }
}

const server = createServer((request, response) => {
  const pathname = new URL(request.url, `http://${request.headers.host || "localhost"}`).pathname;

  if (pathname === "/api/admin/login" && request.method === "POST") {
    if (!adminPasswordHash) {
      sendJson(response, 503, { error: "Admin access is not configured on the server." });
      return;
    }
    if (isLoginRateLimited(request)) {
      sendJson(response, 429, { error: "Too many login attempts. Try again later." });
      return;
    }

    readJsonBody(request, response, (value) => {
      if (!value || typeof value.password !== "string" || !isCorrectAdminPassword(value.password)) {
        recordFailedLogin(request);
        sendJson(response, 401, { error: "Incorrect admin password." });
        return;
      }

      loginAttempts.delete(request.socket.remoteAddress || "unknown");
      for (const [sessionId, expiresAt] of adminSessions) {
        if (expiresAt <= Date.now()) adminSessions.delete(sessionId);
      }

      const sessionId = randomBytes(32).toString("base64url");
      adminSessions.set(sessionId, Date.now() + sessionDuration);
      const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
      response.setHeader(
        "Set-Cookie",
        `ro_admin_session=${sessionId}; HttpOnly; SameSite=Strict; Path=/api/admin; Max-Age=${sessionDuration / 1000}${secure}`
      );
      sendJson(response, 200, { ok: true });
    });
    return;
  }

  if (pathname === "/api/admin/logout" && request.method === "POST") {
    const cookies = request.headers.cookie || "";
    const sessionId = cookies
      .split(";")
      .map((cookie) => cookie.trim())
      .find((cookie) => cookie.startsWith("ro_admin_session="))
      ?.slice("ro_admin_session=".length);
    if (sessionId) adminSessions.delete(sessionId);
    clearAdminCookie(response);
    sendJson(response, 200, { ok: true });
    return;
  }

  if (pathname === "/api/admin/bookings" && request.method === "GET") {
    if (!getAdminSession(request)) {
      sendJson(response, 401, { error: "Admin login required." });
      return;
    }

    try {
      sendJson(response, 200, listBookings.all());
    } catch (error) {
      console.error("Failed to list bookings:", error);
      sendJson(response, 500, { error: "We couldn't load bookings. Please try again." });
    }
    return;
  }

  if (pathname === "/api/admin/bookings" && request.method === "POST") {
    if (!getAdminSession(request)) {
      sendJson(response, 401, { error: "Admin login required." });
      return;
    }

    readJsonBody(request, response, (value) => {
      const result = parseBooking(value);
      if (result.error) {
        sendJson(response, 400, result);
        return;
      }

      try {
        const { booking } = result;
        const saved = insertBooking.run(
          booking.name,
          booking.phone,
          booking.service,
          booking.address,
          booking.preferredDate || null,
          booking.issue
        );
        sendJson(response, 201, { id: Number(saved.lastInsertRowid) });
      } catch (error) {
        console.error("Failed to create booking:", error);
        sendJson(response, 500, { error: "We couldn't create the booking. Please try again." });
      }
    });
    return;
  }

  const bookingMatch = pathname.match(/^\/api\/admin\/bookings\/(\d+)$/);
  if (bookingMatch && (request.method === "PUT" || request.method === "DELETE")) {
    if (!getAdminSession(request)) {
      sendJson(response, 401, { error: "Admin login required." });
      return;
    }

    const bookingId = Number(bookingMatch[1]);
    if (!Number.isSafeInteger(bookingId) || bookingId < 1) {
      sendJson(response, 400, { error: "Invalid booking ID." });
      return;
    }

    if (request.method === "DELETE") {
      try {
        const deleted = deleteBooking.run(bookingId);
        if (deleted.changes === 0) {
          sendJson(response, 404, { error: "Booking not found." });
          return;
        }
        sendJson(response, 200, { ok: true });
      } catch (error) {
        console.error("Failed to delete booking:", error);
        sendJson(response, 500, { error: "We couldn't delete the booking. Please try again." });
      }
      return;
    }

    readJsonBody(request, response, (value) => {
      const result = parseBooking(value);
      if (result.error) {
        sendJson(response, 400, result);
        return;
      }

      try {
        const { booking } = result;
        const updated = updateBooking.run(
          booking.name,
          booking.phone,
          booking.service,
          booking.address,
          booking.preferredDate || null,
          booking.issue,
          bookingId
        );
        if (updated.changes === 0) {
          sendJson(response, 404, { error: "Booking not found." });
          return;
        }
        sendJson(response, 200, { ok: true });
      } catch (error) {
        console.error("Failed to update booking:", error);
        sendJson(response, 500, { error: "We couldn't update the booking. Please try again." });
      }
    });
    return;
  }

  if (pathname !== "/api/bookings" || request.method !== "POST") {
    sendJson(response, 404, { error: "Not found." });
    return;
  }

  readJsonBody(request, response, (value) => {
    const result = parseBooking(value);
    if (result.error) {
      sendJson(response, 400, result);
      return;
    }

    try {
      const { booking } = result;
      const saved = insertBooking.run(
        booking.name,
        booking.phone,
        booking.service,
        booking.address,
        booking.preferredDate || null,
        booking.issue
      );
      sendJson(response, 201, { id: Number(saved.lastInsertRowid) });
    } catch (error) {
      console.error("Failed to save booking:", error);
      sendJson(response, 500, { error: "We couldn't save your booking. Please try again." });
    }
  }, "Please submit valid JSON booking details.", "Booking details are too large.");
});

server.listen(port, process.env.HOST || "0.0.0.0", () => {
  console.log(`Booking API listening on port ${port}; database: ${databasePath}`);
  if (!adminPasswordHash) {
    console.warn("Admin dashboard disabled: set ADMIN_PASSWORD to enable admin login.");
  }
});

function closeServer() {
  server.close(() => {
    database.close();
    process.exit(0);
  });
}

process.on("SIGINT", closeServer);
process.on("SIGTERM", closeServer);
