import { parseBooking } from "../lib/booking-validation.js";
import { sendApiError, sendJson, methodNotAllowed } from "../lib/api-http.js";
import { connectDatabase } from "../lib/neon.js";

export default async function handler(request, response) {
  if (request.method !== "POST") {
    methodNotAllowed(response, ["POST"]);
    return;
  }

  const result = parseBooking(request.body);
  if (result.error) {
    sendJson(response, 400, result);
    return;
  }

  try {
    const sql = await connectDatabase();
    const { booking } = result;
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
    sendApiError(response, error, "Failed to save booking:", "We couldn't save your booking. Please try again.");
  }
}
