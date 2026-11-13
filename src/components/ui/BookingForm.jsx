import { useEffect, useRef, useState } from "react";

const inputClass = "w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";
const services = [
  "RO repair",
  "New RO installation",
  "Filter replacement",
  "Annual maintenance",
  "Cleaning",
  "Other",
];

function validateField(field, value) {
  const text = typeof value === "string" ? value.trim() : "";

  if (field === "name") {
    if (!text) return "Enter your name.";
    if (text.length > 120) return "Max 120 characters.";
  }
  if (field === "phone") {
    if (!text) return "Enter phone number.";
    if (!/^\d{10}$/.test(text)) return "Enter a valid 10-digit number.";
  }
  if (field === "service" && !services.includes(text)) return "Choose a service.";
  if (field === "address") {
    if (!text) return "Enter service address.";
    if (text.length > 500) return "Max 500 characters.";
  }
  if (field === "preferredDate" && text) {
    const date = new Date(`${text}T00:00:00Z`);
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(text) ||
      Number.isNaN(date.getTime()) ||
      date.toISOString().slice(0, 10) !== text
    ) {
      return "Choose a valid date.";
    }
  }
  if (field === "issue" && text.length > 2000) {
    return "Max 2,000 characters.";
  }
  return "";
}

export default function BookingForm({ onClose }) {
  const dialogRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const details = new FormData(event.currentTarget);
    const booking = {
      name: details.get("name") || "",
      phone: details.get("phone") || "",
      service: details.get("service") || "",
      address: details.get("address") || "",
      preferredDate: details.get("preferredDate") || "",
      issue: details.get("issue") || "",
    };
    const validationErrors = Object.fromEntries(
      Object.entries(booking)
        .map(([field, value]) => [field, validateField(field, value)])
        .filter(([, message]) => message)
    );
    setFieldErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(booking),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "We couldn't save your booking. Please try again.");
      }

      setSubmitted(true);
    } catch (submissionError) {
      setError(
        submissionError instanceof TypeError
          ? "Unable to reach the booking service. Please try again later."
          : submissionError.message
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleFieldChange(event) {
    const { name, value } = event.target;
    setFieldErrors((current) => {
      if (!current[name]) return current;
      const message = validateField(name, value);
      const next = { ...current };
      if (message) next[name] = message;
      else delete next[name];
      return next;
    });
  }

  function fieldClasses(field) {
    return `${inputClass}${fieldErrors[field] ? " border-red-500 focus:border-red-500 focus:ring-red-200" : ""}`;
  }

  function fieldError(field, id) {
    return (
      <span
        id={id}
        aria-live="polite"
        className="min-h-3 text-xs leading-4 font-medium text-red-600"
      >
        {fieldErrors[field]}
      </span>
    );
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="booking-title"
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      className="m-auto w-[calc(100%-2rem)] max-w-xl rounded-xl p-0 text-ink shadow-2xl backdrop:bg-black/50"
    >
      <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
        <div>
          <p className="text-xs font-bold uppercase text-brand">RO Services</p>
          <h2 id="booking-title" className="mt-1 text-2xl font-extrabold">Book a service</h2>
        </div>
        <button type="button" onClick={onClose} className="rounded-md px-3 py-2 text-sm font-semibold text-muted hover:bg-gray-100" aria-label="Close booking form">
          Close
        </button>
      </div>

      {submitted ? (
        <div className="grid gap-4 px-6 py-6">
          <p role="status" className="text-sm font-semibold text-green-700">
            Your booking has been saved. We’ll contact you soon.
          </p>
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand/90">
              Done
            </button>
          </div>
        </div>
      ) : (
      <form noValidate onSubmit={handleSubmit} className="grid gap-4 px-6 py-5 sm:grid-cols-2">
        <label className="grid gap-1.5 text-sm font-semibold">
          <span>Your name <span aria-hidden="true" className="text-red-600">*</span></span>
          <input name="name" autoComplete="name" maxLength="120" required aria-invalid={Boolean(fieldErrors.name)} aria-describedby={fieldErrors.name ? "name-error" : undefined} onChange={handleFieldChange} className={fieldClasses("name")} />
          {fieldError("name", "name-error")}
        </label>
        <label className="grid gap-1.5 text-sm font-semibold">
          <span>Phone number <span aria-hidden="true" className="text-red-600">*</span></span>
          <input name="phone" type="tel" inputMode="numeric" autoComplete="tel" maxLength="10" pattern="[0-9]{10}" required aria-invalid={Boolean(fieldErrors.phone)} aria-describedby={fieldErrors.phone ? "phone-error" : undefined} onChange={handleFieldChange} className={fieldClasses("phone")} />
          {fieldError("phone", "phone-error")}
        </label>
        <label className="grid gap-1.5 text-sm font-semibold">
          <span>Service needed <span aria-hidden="true" className="text-red-600">*</span></span>
          <select name="service" required defaultValue="" aria-invalid={Boolean(fieldErrors.service)} aria-describedby={fieldErrors.service ? "service-error" : undefined} onChange={handleFieldChange} className={fieldClasses("service")}>
            <option value="" disabled>Select a service</option>
            {services.map((service) => <option key={service}>{service}</option>)}
          </select>
          {fieldError("service", "service-error")}
        </label>
        <label className="grid gap-1.5 text-sm font-semibold">
          Preferred date
          <input name="preferredDate" type="date" aria-invalid={Boolean(fieldErrors.preferredDate)} aria-describedby={fieldErrors.preferredDate ? "preferred-date-error" : undefined} onChange={handleFieldChange} className={fieldClasses("preferredDate")} />
          {fieldError("preferredDate", "preferred-date-error")}
        </label>
        <label className="grid gap-1.5 text-sm font-semibold sm:col-span-2">
          <span>Service address <span aria-hidden="true" className="text-red-600">*</span></span>
          <input name="address" autoComplete="street-address" maxLength="500" required aria-invalid={Boolean(fieldErrors.address)} aria-describedby={fieldErrors.address ? "address-error" : undefined} onChange={handleFieldChange} className={fieldClasses("address")} />
          {fieldError("address", "address-error")}
        </label>
        <label className="grid gap-1.5 text-sm font-semibold sm:col-span-2">
          Tell us what needs attention
          <textarea name="issue" rows="3" maxLength="2000" aria-invalid={Boolean(fieldErrors.issue)} aria-describedby={fieldErrors.issue ? "issue-error" : undefined} onChange={handleFieldChange} className={fieldClasses("issue")} />
          {fieldError("issue", "issue-error")}
        </label>
        <p className="text-xs leading-relaxed text-muted sm:col-span-2">
          <span className="font-semibold text-red-600">*</span> Required. Your booking details will be saved so our team can follow up.
        </p>
        {error && <p role="alert" className="text-sm font-semibold text-red-700 sm:col-span-2">{error}</p>}
        <div className="flex justify-end gap-3 sm:col-span-2">
          <button type="button" onClick={onClose} className="rounded-md px-4 py-2.5 text-sm font-semibold text-muted hover:bg-gray-100">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-60">
            {isSubmitting ? "Saving..." : "Book now"}
          </button>
        </div>
      </form>
      )}
    </dialog>
  );
}