import { useEffect, useMemo, useState } from "react";

const fieldClass = "w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";

async function readApiResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("application/json")) {
    throw new Error(
      response.status === 404
        ? "The admin API is not configured on this Vercel site. Connect a backend and persistent database to manage bookings."
        : "The admin API returned an unexpected response. Check the backend configuration."
    );
  }

  try {
    return await response.json();
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error("The admin API returned invalid JSON. Check the backend configuration.");
    }
    throw error;
  }
}

function formatDate(value) {
  if (!value) return "Not specified";
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function formatTimestamp(value) {
  if (!value) return "Unknown";
  const date = new Date(`${value.replace(" ", "T")}Z`);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [password, setPassword] = useState("");
  const [search, setSearch] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  async function loadBookings() {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/bookings");
      const result = await readApiResponse(response);
      if (response.status === 401) {
        setIsAuthenticated(false);
        return;
      }
      if (!response.ok) throw new Error(result.error || "Couldn't load bookings.");
      setBookings(result);
      setIsAuthenticated(true);
    } catch (loadError) {
      setError(loadError instanceof TypeError
        ? "Unable to reach the booking service. Please try again."
        : loadError.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadBookings();
  }, []);

  async function handleLogin(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const result = await readApiResponse(response);
      if (!response.ok) throw new Error(result.error || "Admin login failed.");
      setPassword("");
      await loadBookings();
    } catch (loginError) {
      setError(loginError instanceof TypeError
        ? "Unable to reach the booking service. Please try again."
        : loginError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleLogout() {
    setError("");
    try {
      const response = await fetch("/api/admin/logout", { method: "POST" });
      if (!response.ok) throw new Error("Couldn't log out. Please try again.");
      setIsAuthenticated(false);
      setBookings([]);
    } catch (logoutError) {
      setError(logoutError instanceof TypeError
        ? "Unable to reach the booking service. Please try again."
        : logoutError.message);
    }
  }

  function startCreateBooking() {
    setEditingBooking(null);
    setIsEditorOpen(true);
    setError("");
  }

  function startEditBooking(booking) {
    setEditingBooking(booking);
    setIsEditorOpen(true);
    setError("");
  }

  async function handleSaveBooking(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");
    const formData = new FormData(event.currentTarget);
    const booking = {
      name: formData.get("name"),
      phone: formData.get("phone"),
      service: formData.get("service"),
      address: formData.get("address"),
      preferredDate: formData.get("preferredDate"),
      issue: formData.get("issue"),
    };

    try {
      const response = await fetch(
        editingBooking ? `/api/admin/bookings/${editingBooking.id}` : "/api/admin/bookings",
        {
          method: editingBooking ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(booking),
        }
      );
      const result = await readApiResponse(response);
      if (!response.ok) throw new Error(result.error || "Couldn't save the booking.");
      setIsEditorOpen(false);
      setEditingBooking(null);
      await loadBookings();
    } catch (saveError) {
      setError(saveError instanceof TypeError
        ? "Unable to reach the booking service. Please try again."
        : saveError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteBooking(booking) {
    if (!window.confirm(`Delete the booking from ${booking.name}? This can't be undone.`)) return;

    setDeletingId(booking.id);
    setError("");
    try {
      const response = await fetch(`/api/admin/bookings/${booking.id}`, { method: "DELETE" });
      const result = await readApiResponse(response);
      if (!response.ok) throw new Error(result.error || "Couldn't delete the booking.");
      if (editingBooking?.id === booking.id) {
        setIsEditorOpen(false);
        setEditingBooking(null);
      }
      await loadBookings();
    } catch (deleteError) {
      setError(deleteError instanceof TypeError
        ? "Unable to reach the booking service. Please try again."
        : deleteError.message);
    } finally {
      setDeletingId(null);
    }
  }

  const filteredBookings = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return bookings;
    return bookings.filter((booking) =>
      [booking.name, booking.phone, booking.service, booking.address, booking.issue]
        .some((value) => value.toLowerCase().includes(query))
    );
  }, [bookings, search]);

  if (isLoading && !isAuthenticated) {
    return (
      <main className="grid min-h-screen place-items-center px-6">
        <p role="status" className="text-sm font-semibold text-muted">Checking admin access…</p>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="grid min-h-screen place-items-center bg-page px-6 py-12">
        <section className="w-full max-w-md rounded-2xl border border-line bg-white p-8 shadow-card">
          <a href="/" className="text-sm font-bold text-brand hover:underline">RO Services</a>
          <p className="mt-8 text-xs font-bold uppercase tracking-[0.18em] text-brand">Admin</p>
          <h1 className="mt-2 text-3xl font-extrabold text-ink">Booking dashboard</h1>
          <p className="mt-2 text-sm leading-6 text-muted">Sign in to view customer booking requests.</p>
          <form onSubmit={handleLogin} className="mt-6 grid gap-4">
            <label htmlFor="admin-password" className="grid gap-1.5 text-sm font-semibold">
              Admin password
              <input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className={fieldClass}
              />
            </label>
            {error && <p role="alert" className="text-sm font-semibold text-red-700">{error}</p>}
            <button type="submit" disabled={isSubmitting} className="rounded-md bg-brand px-5 py-3 text-sm font-bold text-white hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-60">
              {isSubmitting ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-page px-4 py-8 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <a href="/" className="text-sm font-bold text-brand hover:underline">RO Services</a>
            <h1 className="mt-2 text-3xl font-extrabold text-ink sm:text-4xl">Booking dashboard</h1>
            <p className="mt-2 text-sm text-muted">Review customer requests submitted through Book Now.</p>
          </div>
          <button type="button" onClick={handleLogout} className="rounded-md border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink hover:bg-gray-50">
            Sign out
          </button>
        </header>

        <section aria-label="Booking summary" className="mt-8 rounded-xl border border-line bg-white p-5 shadow-card">
          <p className="text-sm font-semibold text-muted">Total bookings</p>
          <p className="mt-2 text-3xl font-extrabold text-brand">{bookings.length}</p>
        </section>

        <section className="mt-8 rounded-xl border border-line bg-white shadow-card">
          <div className="flex flex-col gap-4 border-b border-line p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-ink">Booking requests</h2>
              <p className="mt-1 text-sm text-muted">{filteredBookings.length} shown</p>
            </div>
            <div className="flex gap-2">
              <input
                type="search"
                aria-label="Search bookings"
                placeholder="Search bookings"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className={`${fieldClass} min-w-0 sm:w-72`}
              />
              <button type="button" onClick={loadBookings} disabled={isLoading} className="shrink-0 rounded-md border border-line px-4 py-2.5 text-sm font-semibold text-ink hover:bg-gray-50 disabled:opacity-60">
                {isLoading ? "Loading…" : "Refresh"}
              </button>
              <button type="button" onClick={startCreateBooking} className="shrink-0 rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand/90">
                Add booking
              </button>
            </div>
          </div>

          {error && <p role="alert" className="m-5 rounded-md bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}
          {isEditorOpen && (
            <form
              key={editingBooking?.id ?? "new"}
              onSubmit={handleSaveBooking}
              className="grid gap-4 border-b border-line bg-gray-50 p-5 sm:grid-cols-2"
            >
              <div className="sm:col-span-2">
                <h3 className="font-bold text-ink">{editingBooking ? "Edit booking" : "Add booking"}</h3>
                <p className="mt-1 text-sm text-muted">Enter the customer and service details below.</p>
              </div>
              <label className="grid gap-1.5 text-sm font-semibold">
                Customer name
                <input name="name" required maxLength="120" defaultValue={editingBooking?.name || ""} className={fieldClass} />
              </label>
              <label className="grid gap-1.5 text-sm font-semibold">
                Phone number
                <input name="phone" type="tel" inputMode="numeric" pattern="[0-9]{10}" required maxLength="10" defaultValue={editingBooking?.phone || ""} className={fieldClass} />
              </label>
              <label className="grid gap-1.5 text-sm font-semibold">
                Service
                <select name="service" required defaultValue={editingBooking?.service || ""} className={fieldClass}>
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
                <input name="preferredDate" type="date" defaultValue={editingBooking?.preferredDate || ""} className={fieldClass} />
              </label>
              <label className="grid gap-1.5 text-sm font-semibold sm:col-span-2">
                Service address
                <input name="address" required maxLength="500" defaultValue={editingBooking?.address || ""} className={fieldClass} />
              </label>
              <label className="grid gap-1.5 text-sm font-semibold sm:col-span-2">
                Issue details
                <textarea name="issue" rows="3" maxLength="2000" defaultValue={editingBooking?.issue || ""} className={fieldClass} />
              </label>
              <div className="flex justify-end gap-3 sm:col-span-2">
                <button type="button" onClick={() => setIsEditorOpen(false)} className="rounded-md px-4 py-2.5 text-sm font-semibold text-muted hover:bg-gray-100">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-60">
                  {isSubmitting ? "Saving…" : editingBooking ? "Save changes" : "Create booking"}
                </button>
              </div>
            </form>
          )}
          {isLoading ? (
            <p role="status" className="p-8 text-center text-sm text-muted">Loading bookings…</p>
          ) : filteredBookings.length === 0 ? (
            <p className="p-8 text-center text-sm text-muted">
              {bookings.length ? "No bookings match your search." : "No bookings have been submitted yet."}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase tracking-wide text-muted">
                  <tr>
                    <th scope="col" className="px-5 py-3 font-bold">Submitted</th>
                    <th scope="col" className="px-5 py-3 font-bold">Customer</th>
                    <th scope="col" className="px-5 py-3 font-bold">Service</th>
                    <th scope="col" className="px-5 py-3 font-bold">Preferred date</th>
                    <th scope="col" className="px-5 py-3 font-bold">Address</th>
                    <th scope="col" className="px-5 py-3 font-bold">Issue details</th>
                    <th scope="col" className="px-5 py-3 font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id} className="align-top">
                      <td className="whitespace-nowrap px-5 py-4 text-muted">{formatTimestamp(booking.createdAt)}</td>
                      <td className="px-5 py-4">
                        <p className="font-bold text-ink">{booking.name}</p>
                        <a href={`tel:${booking.phone}`} className="mt-1 inline-block text-brand hover:underline">{booking.phone}</a>
                      </td>
                      <td className="px-5 py-4 font-semibold text-ink">{booking.service}</td>
                      <td className="whitespace-nowrap px-5 py-4 text-muted">{formatDate(booking.preferredDate)}</td>
                      <td className="max-w-xs whitespace-normal px-5 py-4 text-muted">{booking.address}</td>
                      <td className="max-w-xs whitespace-normal px-5 py-4 text-muted">{booking.issue || "—"}</td>
                      <td className="whitespace-nowrap px-5 py-4">
                        <div className="flex gap-2">
                          <button type="button" onClick={() => startEditBooking(booking)} className="rounded border border-line px-3 py-1.5 text-xs font-semibold text-ink hover:bg-gray-50">
                            Edit
                          </button>
                          <button type="button" onClick={() => handleDeleteBooking(booking)} disabled={deletingId === booking.id} className="rounded border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60">
                            {deletingId === booking.id ? "Deleting…" : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
