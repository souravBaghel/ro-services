import { useEffect, useRef } from "react";

const inputClass = "w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";

export default function BookingForm({ onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    const details = new FormData(event.currentTarget);
    const message = [
      `Name: ${details.get("name")}`,
      `Phone: ${details.get("phone")}`,
      `Service: ${details.get("service")}`,
      `Address: ${details.get("address")}`,
      `Preferred date: ${details.get("date") || "Flexible"}`,
      `Issue details: ${details.get("issue") || "Not provided"}`,
    ].join("\n");
    const subject = encodeURIComponent(`RO service booking: ${details.get("service")}`);
    window.location.href = `mailto:support@sbhomeservices.com?subject=${subject}&body=${encodeURIComponent(message)}`;
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

      <form onSubmit={handleSubmit} className="grid gap-4 px-6 py-5 sm:grid-cols-2">
        <label className="grid gap-1.5 text-sm font-semibold">
          Your name
          <input name="name" autoComplete="name" required className={inputClass} />
        </label>
        <label className="grid gap-1.5 text-sm font-semibold">
          Phone number
          <input name="phone" type="tel" autoComplete="tel" required className={inputClass} />
        </label>
        <label className="grid gap-1.5 text-sm font-semibold">
          Service needed
          <select name="service" required defaultValue="" className={inputClass}>
            <option value="" disabled>Select a service</option>
            <option>RO repair</option>
            <option>New RO installation</option>
            <option>Filter replacement</option>
            <option>Annual maintenance</option>
            <option>Cleaning</option>
            <option>Other</option>
          </select>
        </label>
        <label className="grid gap-1.5 text-sm font-semibold">
          Preferred date
          <input name="date" type="date" className={inputClass} />
        </label>
        <label className="grid gap-1.5 text-sm font-semibold sm:col-span-2">
          Service address
          <input name="address" autoComplete="street-address" required className={inputClass} />
        </label>
        <label className="grid gap-1.5 text-sm font-semibold sm:col-span-2">
          Tell us what needs attention
          <textarea name="issue" rows="3" className={inputClass} />
        </label>
        <p className="text-xs leading-relaxed text-muted sm:col-span-2">
          Submitting opens your email app with these details ready to send to support@sbhomeservices.com.
        </p>
        <div className="flex justify-end gap-3 sm:col-span-2">
          <button type="button" onClick={onClose} className="rounded-md px-4 py-2.5 text-sm font-semibold text-muted hover:bg-gray-100">
            Cancel
          </button>
          <button type="submit" className="rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand/90">
            Continue to email
          </button>
        </div>
      </form>
    </dialog>
  );
}