# ro-services

## Booking storage

Bookings submitted through the form are stored in `data/bookings.sqlite` by the
Node.js API server. Run the app locally in two terminals:

1. `npm run server`
2. `npm run dev`

The development server forwards `/api` requests to the booking API on port 3001.
Set `API_PORT` to change the API port, or `DB_PATH` to choose another SQLite
database file. The API requires Node.js 24 or newer.

## Admin dashboard

Set `ADMIN_PASSWORD` in the API server's environment or in a local `.env` file,
then visit `/admin` and sign in with that password to view, search, create,
edit, and delete bookings. Admin sessions expire after eight hours. Use a strong
password and HTTPS in production; the session cookie is HttpOnly and Secure in production.
Without `ADMIN_PASSWORD`, admin login remains disabled.

In PowerShell, set the password before starting the API:

```powershell
$env:ADMIN_PASSWORD = "choose-a-strong-password"
npm run server
```

## Vercel backend

The Vercel API functions in `api/` use Neon PostgreSQL; the local `server.mjs`
continues to use SQLite. In Vercel Project Settings, add `DATABASE_URL` from
your Neon project and a strong `ADMIN_PASSWORD`, then redeploy. The functions
create their required tables on first use.

To copy local SQLite bookings to Neon, set `DATABASE_URL` in the local
environment (or `.env`) and run `npm run import:sqlite`. The import is safe to
rerun; rows already imported from the same SQLite database are skipped.