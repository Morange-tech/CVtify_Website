# CVtify

CVtify is a CV (resume) and motivation-letter builder SaaS. Users pick a visual template, fill in their information through a guided builder, get AI-assisted writing suggestions, and export the result as a PDF or DOCX. A separate admin console manages users, templates, support tickets, premium requests, and platform analytics.

The project is a two-app monorepo with no shared root tooling — each app is developed and run independently from its own directory.

## Stack

**Frontend (`client_side/`)**
- Next.js 16 (App Router), React 19, JavaScript (`.jsx` — no TypeScript despite `tsconfig.json` being present)
- MUI (Material UI) v7 + Emotion — the app's primary styling system
- TanStack Query for server-state/data fetching
- `react-quill-new` for rich-text editing, `html2canvas` + `jsPDF` for client-side PDF export
- `next-auth` for Google/LinkedIn social login
- Tailwind CSS v4 is installed but not the primary styling system (used only in a handful of components)

**Backend (`server_side/`)**
- Laravel 12 (PHP 8.2)
- Laravel Sanctum — **Bearer token** auth (not cookie sessions)
- `phpoffice/phpword` for DOCX export, `spatie/pdf-to-text` for CV parsing/import
- `laravel/socialite` (+ a LinkedIn provider package) for OAuth
- Pest for testing
- Groq API (OpenAI-compatible) for AI-assisted content generation

## Installation

### Prerequisites
- Node.js 20+, npm
- PHP 8.2+, Composer
- MySQL (or another Laravel-supported DB)

### Backend (`server_side/`)

```bash
cd server_side
composer install
cp .env.example .env
php artisan key:generate
# create the database named in DB_DATABASE, then:
php artisan migrate
php artisan serve                 # API on http://localhost:8000
```

To run the API server, queue worker, and asset watcher together:

```bash
composer run dev
```

Run the test suite (Pest, in-memory SQLite, no external services needed):

```bash
composer test
# or a single test:
php artisan test --filter=TestName
```

### Frontend (`client_side/`)

```bash
cd client_side
npm install
# create .env.local (see Environment Variables below)
npm run dev                       # http://localhost:3000
```

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # ESLint (flat config, eslint-config-next)
```

No test runner is configured for the frontend.

### Running both together

Start `server_side` (`php artisan serve` or `composer run dev`) and `client_side` (`npm run dev`) in separate terminals. The Next.js dev server proxies `/api/*` (except `/api/auth/*`, reserved for NextAuth) to the Laravel backend via `rewrites()` in `next.config.ts`. Direct client-side API calls go straight to `NEXT_PUBLIC_API_URL` instead of through that proxy.

## Environment Variables

### `client_side/.env.local`

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL the client calls directly (e.g. `http://localhost:8000/api`) |
| `NEXT_PUBLIC_BACKEND_URL` | Base backend URL used by a few direct-fetch call sites (e.g. `http://localhost:8000`) |
| `NEXTAUTH_URL` / `NEXTAUTH_SECRET` | Required by NextAuth for the social-login route handler |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth (NextAuth provider) |
| `LINKEDIN_CLIENT_ID` / `LINKEDIN_CLIENT_SECRET` | LinkedIn OAuth (NextAuth provider) |
| `DB_HOST` / `DB_PORT` / `DB_USER` / `DB_PASSWORD` / `DB_NAME` | Direct MySQL connection used by the Next.js admin analytics API route (`app/api/admin/analytics/route.js`), independent of the Laravel connection |

### `server_side/.env`

| Variable | Purpose |
|---|---|
| `APP_*` | Standard Laravel app config (name, env, key, debug, url, locale) |
| `DB_*` | Laravel's MySQL connection |
| `SESSION_*`, `CACHE_STORE`, `QUEUE_CONNECTION`, `BROADCAST_CONNECTION` | Standard Laravel infra config |
| `MAIL_*` | Outgoing mail (welcome emails, password reset) |
| `AWS_*` | Optional S3-compatible storage |
| `LINKEDIN_CLIENT_ID` / `LINKEDIN_CLIENT_SECRET` / `LINKEDIN_REDIRECT_URI` | The **separate** server-side LinkedIn OAuth flow (`LinkedInAuthController`), independent of NextAuth's LinkedIn provider — verify which flow a given page actually uses before touching LinkedIn auth |
| `PDFTOTEXT_BINARY` | Path to the `pdftotext` binary used for CV import parsing |
| `GROQ_API_KEY` / `GROQ_MODEL` | Groq API credentials for AI-assisted content generation (defaults to `llama-3.3-70b-versatile`) |
| `FRONTEND_URL` | Used to build absolute links back to the frontend (e.g. shared-letter URLs) |
| `SANCTUM_STATEFUL_DOMAINS` | Sanctum config (Bearer tokens are the actual auth mechanism; CORS has `supports_credentials: true` but cookie sessions aren't used) |

Update `server_side/config/cors.php` when adding new frontend origins/ports — it only allows `api/*` and `sanctum/csrf-cookie` paths from localhost and `*.ngrok-free.app` origins.

## Folder Architecture

```
CVtify/
├── client_side/                 Next.js frontend
│   └── app/
│       ├── (dashboard)/         Authenticated end-user area (dashboard, my-cvs, downloads,
│       │                        templates, subscription, settings, motivation-letter, upgrade,
│       │                        ai-assistant, analytics) — gated by ProtectedRoute
│       ├── admin/               Admin console, mirrors the backend Api/Admin/* resources
│       │                        1:1 (users, cvs, templates, messages, notifications, logs,
│       │                        settings, admins, payments, premium-requests, ...)
│       ├── CV_Builder/           CV builder page (composes CV_Sections/* form components)
│       ├── motivation-letter-builder/   Motivation-letter builder page
│       ├── components/
│       │   ├── templates/       CV visual templates (Template1.jsx, Template2.jsx, ...)
│       │   ├── letter_templates/  Motivation-letter visual templates
│       │   └── CV_Sections/     CV builder's per-section form components
│       ├── hooks/                TanStack Query hooks (useDashboard, useMyCvs, useAdmin*, ...)
│       ├── services/api.js      Shared fetch wrapper for template/dashboard/admin endpoints
│       └── lib/                  CV-builder-specific API/export helpers (useCvBuilderApi.js,
│                                  exportCvPdf.js, templateComponents.js, ...)
│
└── server_side/                 Laravel backend
    └── app/
        ├── Http/Controllers/Api/
        │   ├── User/            End-user resources: CvController, MotivationLetterController,
        │   │                    DownloadHistoryController, UpgradeContentController, AiController
        │   ├── Admin/           Admin-only resources, mounted under auth:sanctum + admin
        │   │                    middleware and the /admin route prefix
        │   └── *                Shared/public: AuthController, TemplateController,
        │                        MotivationTemplateController, CvParseController,
        │                        DashboardController, SubscriptionController, SupportTicketController
        ├── Models/               User, Cv, MotivationLetter, Template, MotivationLetterTemplate,
        │                        DownloadHistory, ActivityLog, PremiumRequest, SupportTicket(Message),
        │                        AdminNotification(Setting), SystemSetting
        └── Services/             CvDocxExporter (PhpWord), GroqService (AI content generation)
```

`routes/api.php` is the single source of truth for what's public vs `auth:sanctum`-protected vs admin-only.

## Deployment Guide

1. **Backend**: deploy `server_side` as a standard Laravel app (PHP-FPM + nginx/Apache, or a platform like Forge/Vapor/Render). Set `APP_ENV=production`, `APP_DEBUG=false`, generate a fresh `APP_KEY`, point `DB_*` at the production database, run `php artisan migrate --force`, and cache config/routes (`php artisan config:cache`, `route:cache`).
2. **Frontend**: deploy `client_side` to Vercel (or any Next.js-capable host). Set `NEXT_PUBLIC_API_URL`/`NEXT_PUBLIC_BACKEND_URL` to the production API's public URL, and configure `NEXTAUTH_URL`/`NEXTAUTH_SECRET` for the deployed domain.
3. **CORS**: update `server_side/config/cors.php` to allow the production frontend origin(s).
4. **OAuth callbacks**: update Google/LinkedIn app configs with the production callback URLs for both the NextAuth flow and the separate Laravel `LinkedInAuthController` flow.
5. **Storage**: if using AWS S3 for file storage, set `FILESYSTEM_DISK=s3` and the `AWS_*` variables; otherwise the default `local` disk requires the deployment target to have persistent storage for uploaded files (profile photos, signatures, template preview images).
6. **Queue**: a queue worker (`php artisan queue:work`) must run continuously in production for any queued jobs (e.g. mail) to be processed.

## Maintenance Contacts

_Add the team/individuals responsible for ongoing maintenance here (name, role, contact channel) — not filled in automatically since this isn't information available in the codebase._
