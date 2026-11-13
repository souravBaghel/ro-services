const allowedServices = new Set([
  "RO repair",
  "New RO installation",
  "Filter replacement",
  "Annual maintenance",
  "Cleaning",
  "Other",
]);

export function parseBooking(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { error: "Please submit valid booking details." };
  }

  const fields = ["name", "phone", "service", "address", "preferredDate", "issue"];
  if (fields.some((field) => value[field] !== undefined && typeof value[field] !== "string")) {
    return { error: "Booking fields must be text." };
  }

  const booking = {
    name: (value.name || "").trim(),
    phone: (value.phone || "").trim(),
    service: (value.service || "").trim(),
    address: (value.address || "").trim(),
    preferredDate: (value.preferredDate || "").trim(),
    issue: (value.issue || "").trim(),
  };

  if (!booking.name || booking.name.length > 120) {
    return { error: "Enter your name (up to 120 characters)." };
  }
  if (!booking.phone || booking.phone.length > 40) {
    return { error: "Enter a valid phone number (up to 40 characters)." };
  }
  if (!/^\d{10}$/.test(booking.phone)) {
    return { error: "Enter a valid 10-digit phone number." };
  }
  if (!allowedServices.has(booking.service)) {
    return { error: "Select a valid service." };
  }
  if (!booking.address || booking.address.length > 500) {
    return { error: "Enter a service address (up to 500 characters)." };
  }
  if (booking.issue.length > 2000) {
    return { error: "Issue details must be 2,000 characters or fewer." };
  }
  if (
    booking.preferredDate &&
    (!/^\d{4}-\d{2}-\d{2}$/.test(booking.preferredDate) ||
      Number.isNaN(Date.parse(`${booking.preferredDate}T00:00:00Z`)) ||
      new Date(`${booking.preferredDate}T00:00:00Z`).toISOString().slice(0, 10) !== booking.preferredDate)
  ) {
    return { error: "Enter a valid preferred date." };
  }

  return { booking };
}
