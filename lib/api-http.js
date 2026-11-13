import { DatabaseConfigurationError } from "./neon.js";

export function sendJson(response, status, payload) {
  response.statusCode = status;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("Cache-Control", "no-store");
  response.end(JSON.stringify(payload));
}

export function methodNotAllowed(response, allowedMethods) {
  response.setHeader("Allow", allowedMethods.join(", "));
  sendJson(response, 405, { error: "Method not allowed." });
}

export function sendApiError(response, error, context, message) {
  if (error instanceof DatabaseConfigurationError) {
    sendJson(response, 503, { error: "Database is not configured for this deployment." });
    return;
  }

  console.error(context, error);
  sendJson(response, 500, { error: message });
}
