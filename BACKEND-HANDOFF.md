# Trios Admin Backend Handoff

This document records gaps between the **Tros admin dashboard** and the live backend at `https://trios.viaspark.site/api/v1`.

Run the endpoint verifier with your admin credentials:

```powershell
cd Tros
.\scripts\test-admin-endpoints.ps1 -Email "you@example.com" -Password "your-password"
```

Optional mutation smoke tests (creates/deletes a test FAQ):

```powershell
.\scripts\test-admin-endpoints.ps1 -Email "you@example.com" -Password "your-password" -IncludeMutations
```

## Architecture

| Layer | Path |
|-------|------|
| Browser | `adminService` → `/api/admin/*` (Next.js proxy) |
| Proxy | Forwards to `BACKEND_API_URL` with `Authorization: Bearer <cookie>` |
| Login | `POST /api/admin/login` → sets httpOnly `trios_session_token` |

## Known UI ↔ API gaps

| Area | Status | Notes |
|------|--------|-------|
| Event attendees (`/dashboard/events/[id]/users`) | **No API** | No `/admin/events/{id}/users` route in OpenAPI. Page shows empty state; use user bookings for history. |
| Transaction detail | **List lookup** | No dedicated `GET /admin/transactions/{id}`; detail page finds row from paginated list. |
| Admin staff phone / job title | **Display only** | `AdminStaff` API shape has no phone or job title; table shows placeholders. |
| Withdrawals / Disputes | **Service only** | Endpoints exist in `adminService` but no sidebar pages yet. |
| Support ticket reply body | **Status only** | `PATCH /admin/support/{id}/status` marks resolved; no reply-message field in API. |
| Theme / referral setting keys | **Assumed keys** | `theme_*`, `referral_*` keys used; confirm with live `GET /admin/settings` response. |

## Fill in after live testing

After running `test-admin-endpoints.ps1`, note any failing routes here:

| Endpoint | HTTP status | Error / notes |
|----------|-------------|---------------|
| _(example)_ `GET /admin/withdrawals` | 404 | Not implemented on backend |
| | | |
| | | |

## Environment

Copy `.env.example` to `.env.local`:

```
BACKEND_API_URL=https://trios.viaspark.site/api/v1
USE_MOCK_FALLBACK=false
```

Set `USE_MOCK_FALLBACK=true` only for offline UI development.

## Build verification

```bash
cd Tros
npm run build
npm run dev
```

Login at `/` with valid admin credentials; dashboard routes under `/dashboard/*` require the session cookie set by `/api/admin/login`.
