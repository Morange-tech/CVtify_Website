# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

This is a two-app monorepo with no shared root tooling — each app is developed independently from its own directory:

- `client_side/` — Next.js 16 (App Router) frontend, React 19, JavaScript (`.jsx`, not TypeScript despite `tsconfig.json` being present).
- `server_side/` — Laravel 12 (PHP 8.2) API backend, using Sanctum for token auth.

Always `cd` into the relevant app directory before running its commands — there is no top-level `package.json` or build orchestration tying them together.

## Commands

### client_side (Next.js)

```
npm run dev      # start dev server on :3000
npm run build
npm run start
npm run lint      # eslint (flat config, eslint-config-next)
```

No test runner is configured for the frontend.

### server_side (Laravel)

```
composer install
php artisan serve                 # API on :8000
composer run dev                  # runs php artisan serve + queue:listen + vite concurrently
php artisan migrate
composer test                     # clears config, then `php artisan test` (Pest)
php artisan test --filter=TestName
php artisan test tests/Feature/SomeTest.php
```

Tests use Pest (`tests/Feature`, `tests/Unit`), an in-memory SQLite DB, and array drivers for cache/session/queue/mail (see `phpunit.xml`) — no external services needed to run the suite.

## Architecture

### Client ↔ API wiring

- The Next.js dev server proxies `/api/*` (except `/api/auth/*`) to the Laravel backend at `http://localhost:8000/api` via `rewrites()` in `client_side/next.config.ts`. `/api/auth/*` is reserved for NextAuth's own route handler.
- Direct API calls from client code go through `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:8000/api`), not the rewrite — see `client_side/app/services/api.js`, `app/lib/auth.js`, `app/lib/useCvBuilderApi.js`.
- Auth is Sanctum **Bearer tokens**, not cookie sessions, despite CORS having `supports_credentials: true`. The token and user object are persisted to `localStorage` (`token`, `user` keys) by `app/context/AuthContext.js`, and every API helper reads the token straight out of `localStorage` per-request rather than from React state/context.
- There are two overlapping API-call layers on the client: `app/services/api.js` (template/dashboard/admin endpoints, uses a shared `apiFetch` wrapper) and `app/lib/useCvBuilderApi.js` (CV builder, its own fetch wrapper as a hook). `app/lib/api.js` is dead/stub code (`fetch('/cv')`) — don't extend it.
- Social login (Google/LinkedIn) is handled by NextAuth (`app/api/auth/[...nextauth]/route.js`): NextAuth's `signIn` callback POSTs the OAuth profile to Laravel's `/social-login`, receives a Sanctum token back, stashes it on the NextAuth JWT/session, and always redirects to `/auth/callback`, which is responsible for pulling the token out of the session and writing it into `AuthContext`/localStorage so the rest of the app (which only trusts localStorage) can use it.
- There is also a separate LinkedIn OAuth flow implemented directly on the Laravel side (`LinkedInAuthController`, `/auth/linkedin/redirect|callback`) independent of NextAuth's LinkedIn provider — check which one a given page actually uses before touching LinkedIn auth.

### Server structure (`server_side/app/Http/Controllers/Api`)

- `Api/User/*` — end-user resources: `CvController`, `MotivationLetterController`, `DownloadHistoryController`, `UpgradeContentController`.
- `Api/Admin/*` — admin-only resources (users, templates, CVs, support tickets, notifications, logs, settings, admin management, motivation-letter templates), all mounted under `auth:sanctum` + `admin` middleware and the `/admin` route prefix in `routes/api.php`.
- Top-level `Api/*` — shared/public controllers: `AuthController` (register/login/logout/password reset/social login), `TemplateController` + `MotivationTemplateController` (public CV/letter template catalogs, wishlist toggling), `CvParseController` (public CV parsing/import), `DashboardController`, `SubscriptionController`, `SupportTicketController`.
- `routes/api.php` is the single source of truth for what's public vs. `auth:sanctum`-protected vs. admin-only — check it before assuming a controller method is reachable.
- `AdminMiddleware` (aliased as `admin`) gates on `$request->user()->isAdmin()`; `EnsureUserIsPremium` gates premium-only features. Free-plan limits are enforced in controllers too (e.g. `CvController::store` caps free users at 3 CVs — see `isPremium()`/plan fields on `User`).
- CORS (`config/cors.php`) only allows `api/*` and `sanctum/csrf-cookie` paths, from localhost and `*.ngrok-free.app` origins — update this when adding new frontend origins/ports.
- DOCX export goes through `App\Services\CvDocxExporter` (PhpWord); CV parsing/import uses `spatie/pdf-to-text`.

### CV / Motivation Letter builders

- CV templates are React components under `client_side/app/components/templates/` (`Template1.jsx`, `Template2.jsx`, ...); letter templates live in `client_side/app/components/letter_templates/`. Adding a new visual template means adding both the backend `Template`/`MotivationLetterTemplate` DB record (via admin endpoints) and a matching frontend component.
- The CV builder page (`client_side/app/CV_Builder/page.jsx`) composes section forms from `client_side/app/components/CV_Sections/` (`PersonalInfoForm`, `EducationSection`, `ExperienceSection`, `ProfileSection`, `AdditionalSectionForm`) and persists via `useCvBuilderApi`.
- Client-side PDF export uses `jspdf` + `html2canvas`; server-side DOCX export uses `CvDocxExporter`.

### Route groups on the client

- `app/(dashboard)/` — authenticated end-user area (dashboard, my-cvs, downloads, templates, subscription, settings, motivation-letter, upgrade, ai-assistant, analytics), wrapped by `app/(dashboard)/layout.jsx` and gated with `ProtectedRoute`.
- `app/admin/` — separate admin console with its own layout/sidebar (`AdminSidebar.jsx`, `AdminSidebarContext.jsx`), mirroring the `Api/Admin/*` backend resources one-to-one (users, cvs, templates, messages, notifications, logs, settings, admins, payments, premium-requests, motivation-letters).
- Data fetching throughout the dashboard/admin areas goes through TanStack Query hooks in `app/hooks/` (`useDashboard`, `useMyCvs`, `useAdmin*`, etc.), which wrap the `services/api.js` functions — add new endpoints there rather than calling `fetch` directly from components.

### Models worth knowing (`server_side/app/Models`)

`User` carries role (`isAdmin()`) and subscription/plan fields directly (no separate roles table). `Cv`, `MotivationLetter`, `Template`, `MotivationLetterTemplate` are the core content models; `DownloadHistory`, `ActivityLog`, `PremiumRequest`, `SupportTicket(Message)`, `AdminNotification(Setting)`, `SystemSetting` back the admin console features.
