import { parseBooking } from "../../lib/booking-validation.js";
import { hasAdminSession } from "../../lib/admin-auth.js";
import { methodNotAllowed, sendApiError, sendJson } from "../../lib/api-http.js";
import { connectDatabase } from "../../lib/neon.js";

export default async function handler(request, response) {
  if (request.method !== "GET" && request.method !== "POST") {
    methodNotAllowed(response, ["GET", "POST"]);
    return;
  }
  if (!hasAdminSession(request)) {
    sendJson(response, 401, { error: "Admin login required." });
    return;
  }

  if (request.method === "POST") {
    const result = parseBooking(request.body);
    if (result.error) {
      sendJson(response, 400, result);
      return;
    }
  }

  try {
    const sql = await connectDatabase();
    if (request.method === "GET") {
      const bookings = await sql`
        SELECT
          id,
          name,
          phone,
          service,
          address,
          preferred_date::text AS "preferredDate",
          issue,
          TO_CHAR(created_at AT TIME ZONE 'UTC', 'YYYY-MM-DD HH24:MI:SS') AS "createdAt"
        FROM bookings
        ORDER BY id DESC
      `;
      sendJson(response, 200, bookings);
      return;
    }

    const { booking } = parseBooking(request.body);
    const saved = await sql`
      INSERT INTO bookings (name, phone, service, address, preferred_date, issue)
      VALUES (
        ${booking.name},
        ${booking.phone},
        ${booking.service},
        ${booking.address},
        ${booking.preferredDate || null}::date,
        ${booking.issue}
      )
      RETURNING id
    `;
    sendJson(response, 201, { id: Number(saved[0].id) });
  } catch (error) {
    sendApiError(response, error, "Failed to manage bookings:", "We couldn't load or save bookings. Please try again.");
  }
}
