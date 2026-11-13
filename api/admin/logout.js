import { clearAdminSession } from "../../lib/admin-auth.js";
import { methodNotAllowed, sendJson } from "../../lib/api-http.js";

export default function handler(request, response) {
  if (request.method !== "POST") {
    methodNotAllowed(response, ["POST"]);
    return;
  }

  clearAdminSession(response);
  sendJson(response, 200, { ok: true });
}
