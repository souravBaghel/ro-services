import { parseBooking } from "../../../lib/booking-validation.js";
import { hasAdminSession } from "../../../lib/admin-auth.js";
import { methodNotAllowed, sendApiError, sendJson } from "../../../lib/api-http.js";
import { connectDatabase } from "../../../lib/neon.js";

export default async function handler(request, response) {
  if (request.method !== "PUT" && request.method !== "DELETE") {
    methodNotAllowed(response, ["PUT", "DELETE"]);
    return;
  }
  if (!hasAdminSession(request)) {
    sendJson(response, 401, { error: "Admin login required." });
    return;
  }

  const idValue = Array.isArray(request.query?.id) ? request.query.id[0] : request.query?.id;
  const id = Number(idValue);
  if (!Number.isSafeInteger(id) || id < 1) {
    sendJson(response, 400, { error: "Invalid booking ID." });
    return;
  }

  let booking;
  if (request.method === "PUT") {
    const result = parseBooking(request.body);
    if (result.error) {
      sendJson(response, 400, result);
      return;
    }
    booking = result.booking;
  }

  try {
    const sql = await connectDatabase();
    if (request.method === "DELETE") {
      const deleted = await sql`DELETE FROM bookings WHERE id = ${id} RETURNING id`;
      if (deleted.length === 0) {
        sendJson(response, 404, { error: "Booking not found." });
        return;
      }
      sendJson(response, 200, { ok: true });
      return;
    }

    const updated = await sql`
      UPDATE bookings
      SET
        name = ${booking.name},
        phone = ${booking.phone},
        service = ${booking.service},
        address = ${booking.address},
        preferred_date = ${booking.preferredDate || null}::date,
        issue = ${booking.issue}
      WHERE id = ${id}
      RETURNING id
    `;
    if (updated.length === 0) {
      sendJson(response, 404, { error: "Booking not found." });
      return;
    }
    sendJson(response, 200, { ok: true });
  } catch (error) {
    sendApiError(response, error, "Failed to change booking:", "We couldn't update or delete the booking. Please try again.");
  }
}
