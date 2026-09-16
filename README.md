# Linglet

![License](https://img.shields.io/github/license/hendrikmrks/linglet)

Linglet is a gamified language learning web application for **German ↔ Brazilian Portuguese** vocabulary practice. It organizes vocabulary into chapters and subchapters, turns each subchapter into a set of auto-generated exercises, and layers game mechanics — XP, streaks, badges, a learning path, a leaderboard, and an XP shop — on top to keep learners coming back.

Built with **Next.js 14 (App Router)**, **TypeScript**, **Prisma**, and **PostgreSQL**, and shipped as a Docker image for self-hosting.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Seeding](#database-seeding)
- [Available Scripts](#available-scripts)
- [Testing](#testing)
- [Docker](#docker)
- [Project Structure](#project-structure)
- [Internationalization](#internationalization)
- [Contributing](#contributing)
- [Code of Conduct](#code-of-conduct)
- [License](#license)

## Features

- **Chapter-based vocabulary content** — Content is organized as `Chapter → Subchapter → Vocabulary`, with each vocabulary entry carrying a word, its translation, and an example sentence in both languages. The repository ships 14 chapters per learning direction (German → Portuguese and Portuguese → German), covering everyday life, home, leisure, body & clothing, time & language, professions & education, food & health, city & orientation, technology & media, society & culture, feelings & relationships, environment & sustainability, and work & economy (see the `seed-de-pt-chapter*.js` / `seed-pt-de-chapter*.js` files).
- **Auto-generated exercises** — `src/lib/exercise-generator.ts` turns a subchapter's vocabulary into a balanced mix of seven exercise types: multiple-choice translation (both directions), matching pairs, type-the-answer, fill-in-the-blank (using example sentences), true/false, and word-scramble.
- **Gamification** — XP is awarded on lesson/subchapter completion, daily **streaks** are tracked (`src/lib/streak.ts`), and **badges** are unlocked for XP, streak, and level milestones (`src/lib/badges.ts`). A **leaderboard** ranks users by XP.
- **Learning path** — A separate level-based learning path (`LearningChapter` / `LearningLevel` / `UserLevelProgress`) with XP-gated level unlocks, alongside the chapter/vocabulary content system.
- **CEFR progress indicator** — A `cefr-progress` component visualizes progress against CEFR levels.
- **XP shop** — Users can spend earned XP on badges, themes, and boosters (`ShopItem` / `UserPurchase`); admins manage the catalog.
- **Free / Premium plans** — Plan-gated limits (daily chapters/subchapters/lessons, leaderboard access, XP multiplier) are configurable via a `PremiumSettings` singleton row and enforced through `src/lib/premium.ts` / `src/lib/premium-settings.ts`. Users can request a Premium upgrade in-app (`PremiumRequest`), which admins approve or reject.
- **Certificates** — Users can generate a completion certificate (`/certificate`, `src/app/api/user/certificate`).
- **Vocabulary reporting** — Users can flag incorrect words/translations; admins triage reports (`VocabularyReport`).
- **Admin panel** (`/admin`) — Manage chapters, subchapters, vocabulary, shop items, FAQ entries, Premium requests, Premium settings, and users.
- **Authentication** — Custom email/password auth with bcrypt password hashing and database-backed sessions (httpOnly cookies), no third-party auth provider.
- **Onboarding flow** — First-time users go through `/onboarding` to set up their profile and learning language.
- **Internationalization** — The UI itself is translated into German, English, and Brazilian Portuguese (`src/i18n/locales/{de,en,pt-br}.json`), independent of which language pair a user is learning.
- **PWA support** — A web app manifest and service worker (`public/manifest.json`, `public/sw.js`) make the app installable.
- **German legal pages** — Imprint (`/impressum`), privacy policy (`/datenschutz`), terms (`/agb`), and contact (`/kontakt`) pages, reflecting the app's primary deployment for German-speaking users.

> Note: some scaffolding (e.g. a static `LESSONS` lookup in `src/lib/lesson-data.ts`) predates the current seeded-vocabulary system and is not the primary content path — the seed scripts and the `Vocabulary` table are the source of truth for lesson content.

## Tech Stack

- **Framework**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL 16
- **ORM**: Prisma
- **Validation**: Zod
- **Auth**: Custom session-based auth with `bcryptjs` password hashing (no external auth provider)
- **DB access at runtime**: `pg` (raw SQL via a connection pool) alongside Prisma (schema/migrations)
- **Testing**: Vitest + Testing Library (jsdom environment)
- **Containerization**: Docker (multi-stage build), Docker Compose (dev/prod)

## Architecture

- **Next.js App Router** under `src/app`, with route handlers under `src/app/api/*` implementing the REST-style backend (auth, chapters, subchapters, lessons, leaderboard, shop, admin, FAQ, etc.).
- **Prisma** (`prisma/schema.prisma`) defines the schema and drives migrations (`prisma/migrations`), but most runtime queries use the `pg` client directly (`src/lib/db.ts`) rather than the Prisma Client query API.
- **Middleware** (`src/middleware.ts`) protects authenticated routes.
- **PostgreSQL** is the single data store for users, sessions, content (chapters/subchapters/vocabulary), gamification state (XP, streaks, badges, level progress), the shop, and admin-managed data (FAQ, Premium settings/requests, vocabulary reports).

## Prerequisites

- Node.js 18+ (LTS recommended)
- Docker & Docker Compose
- npm

## Getting Started

### 1. Clone and configure environment

```bash
git clone https://github.com/hendrikmrks/linglet.git
cd linglet
cp .env.example .env
```

Edit `.env` and fill in real values (see [Environment Variables](#environment-variables) below).

### 2. Start PostgreSQL

The root `docker-compose.yml` starts a local PostgreSQL 16 container (trust auth, no password) for development:

```bash
docker compose up -d
docker compose logs db   # look for "database system is ready to accept connections"
```

### 3. Install dependencies

```bash
npm install
```

### 4. Apply database migrations

```bash
npm run prisma:generate
npm run prisma:migrate
```

### 5. Seed the database

```bash
npm run db:seed:chapters
```

See [Database Seeding](#database-seeding) for all available seed scripts.

### 6. Run the dev server

```bash
npm run dev
```

The app is available at **http://localhost:3000**.

## Environment Variables

These are the variables defined in `.env.example`:

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string, e.g. `postgresql://lingletuser:your_secure_password@localhost:5432/linglet?schema=public` |
| `AUTH_SECRET` | Secret used for session handling. Generate a strong value with `openssl rand -base64 32`. |
| `NEXT_PUBLIC_APP_URL` | Public base URL of the app (used for cookies/redirects). |
| `NODE_ENV` | `development` or `production`. |
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | Optional discrete DB connection parameters consumed by the standalone seed scripts (`seed-*.js`, `scripts/seed-runner.js`). If omitted, these are derived from `DATABASE_URL`. |

Additionally, the **production admin-seeding scripts** (`seed-production.js`, `seed-production-complete.js`, and `scripts/seed-runner.js --env prod`) require:

| Variable | Description |
| --- | --- |
| `ADMIN_EMAIL` | Email for the seeded admin account (defaults to `admin@linglet.com`/`admin@linglet.de` depending on script if unset). |
| `ADMIN_PASSWORD` | **Required.** Password for the seeded admin account; the script throws if this is missing. |

These two are not listed in `.env.example` (it's for the app runtime, not the seed scripts) — set them in your shell or CI secrets when seeding a production/admin user.

## Database Seeding

Seeding is handled by a set of plain Node scripts (not Prisma's built-in seed runner), executed with `pg` against `DATABASE_URL`/`DB_*`:

| Script | Command | What it does |
| --- | --- | --- |
| `seed-all-pt-de.js` | `npm run db:seed:chapters` | Seeds all 14+14 chapters/subchapters/vocabulary (both learning directions) from the `seed-de-pt-chapter*.js` / `seed-pt-de-chapter*.js` files. |
| `seed-production.js` | `npm run db:seed:production` | Creates only the admin user (requires `ADMIN_PASSWORD`). |
| `seed-production-complete.js` | `npm run db:seed:production:complete` | Creates the admin user **and** seeds all chapters — the recommended one-shot production seed. |
| `scripts/seed-runner.js` | `npm run seed:dev` / `npm run seed:prod` | Wrapper used in CI/deploy: `--env dev` truncates and reseeds all content tables every run; `--env prod` seeds once and records completion in a `_seed_history` table so re-runs are a no-op. |

To add a new vocabulary chapter, copy the structure of an existing `seed-de-pt-chapterN-*.js` (or `seed-pt-de-chapterN-*.js`) file — each defines a chapter with an ordered list of subchapters, each with an ordered list of `{ word, translation, example, translatedExample, order }` vocabulary entries — and wire it into `seed-all-pt-de.js`.

## Available Scripts

```bash
npm run dev                          # Start the Next.js dev server
npm run build                        # prisma generate && next build
npm start                            # Start the production server
npm run lint                         # ESLint (.ts, .tsx)
npm run prisma:generate              # Generate the Prisma Client
npm run prisma:migrate               # Apply migrations (prisma migrate deploy)
npm run db:seed:production           # Seed admin user only
npm run db:seed:production:complete  # Seed admin user + all chapters
npm run db:seed:chapters             # Seed all vocabulary chapters
npm run seed:dev                     # Reset + reseed dev DB (scripts/seed-runner.js --env dev)
npm run seed:prod                    # One-time idempotent prod seed (scripts/seed-runner.js --env prod)
npm run health:check                 # Production health check (env, DB, schema, admin user, reachability)
npm run test                         # Run unit/integration tests once (Vitest)
npm run test:watch                   # Vitest watch mode
npm run test:ui                      # Vitest UI
npm run test:coverage                # Vitest with coverage report
npm run test:pipeline                # Full pipeline: npm test, then live integration checks against a running server
```

## Testing

Unit and component tests use **Vitest** with `jsdom` and Testing Library, configured in `vitest.config.ts`. Test files live alongside the code they test (`src/**/*.test.ts`), e.g. `src/lib/streak.test.ts`, `src/lib/premium.test.ts`, `src/lib/validators.test.ts`, `src/lib/exercise-generator.test.ts`, `src/lib/faq.test.ts`, and API route tests such as `src/app/api/auth/auth.test.ts`, `src/app/api/chapters/chapters.test.ts`, `src/app/api/lesson/complete/route.test.ts`, `src/app/api/subchapters/complete/route.test.ts`.

```bash
npm test
```

`test-pipeline.js` (`npm run test:pipeline`) runs `npm test` first, then spins up integration checks against a **running server** (defaults to `http://localhost:3000`, or pass a base URL as an argument): it creates two `isTestUser=true` accounts (free/premium, excluded from rankings and admin listings) and exercises login, the chapters API, subchapter data, and the lesson/exercise start API end-to-end.

## Docker

Three Compose files are provided:

- `docker-compose.yml` — local PostgreSQL 16 only (for `npm run dev` against a containerized DB).
- `docker-compose.dev.yml` — builds and runs the app itself (`linglet-dev`) from the `Dockerfile`, exposed on `127.0.0.1:3001`, reading config from `.env`.
- `docker-compose.prod.yml` — builds and runs the app (`linglet-prod`) on `127.0.0.1:3000`.

Both app compose files include a healthcheck against `GET /api/health`.

The `Dockerfile` is a three-stage build (`deps` → `builder` → `runner`) producing a minimal Node 20 Alpine image using Next.js's `standalone` output, running as a non-root `nextjs` user, with the Prisma CLI and seed scripts included for running migrations/seeding at deploy time.

```bash
# Build and run the app container (dev)
docker compose -f docker-compose.dev.yml up -d --build

# Build and run the app container (prod)
docker compose -f docker-compose.prod.yml up -d --build
```

See `DEPLOYMENT.md` for a full bare-metal/production deployment walkthrough (PostgreSQL setup, Nginx reverse proxy, Let's Encrypt, PM2) and `.github/workflows/deploy-prod.yml` / `deploy-dev.yml` for the CI/CD deployment pipeline.

## Project Structure

```
linglet/
├─ src/
│  ├─ app/
│  │  ├─ page.tsx                    # Landing page
│  │  ├─ login/, register/           # Auth pages
│  │  ├─ onboarding/                 # First-run onboarding flow
│  │  ├─ dashboard/                  # Authenticated home (XP, streak, progress)
│  │  ├─ path/                       # Learning path (level tree)
│  │  ├─ lesson/                     # Exercise runner
│  │  ├─ leaderboard/                # XP leaderboard
│  │  ├─ shop/                       # XP shop
│  │  ├─ stats/                      # User stats
│  │  ├─ certificate/                # Completion certificate
│  │  ├─ profile/, settings/         # Profile & account settings
│  │  ├─ admin/                      # Admin panel (chapters, FAQ, users, ...)
│  │  ├─ impressum/, datenschutz/, agb/, kontakt/  # German legal pages
│  │  └─ api/                        # Route handlers (auth, chapters, lesson, shop, admin, ...)
│  ├─ components/                    # UI components (navbar, chapter list, exercise runner, ...)
│  │  └─ ui/                         # Low-level UI primitives (button, input, form)
│  ├─ lib/                           # Business logic: auth, db, streak, badges, premium, exercise generator, validators
│  ├─ i18n/locales/                  # UI translations (de, en, pt-br)
│  └─ middleware.ts                  # Route protection
├─ prisma/
│  ├─ schema.prisma                  # Database schema
│  └─ migrations/                    # SQL migrations
├─ scripts/seed-runner.js            # Dev/prod seed orchestration
├─ seed-*.js                         # Vocabulary chapter + production seed scripts
├─ test-pipeline.js                  # Vitest + live integration pipeline
├─ production-health-check.js        # Post-deploy health check
├─ Dockerfile, docker-compose*.yml   # Container build & orchestration
└─ DEPLOYMENT.md                     # Bare-metal deployment guide
```

## Internationalization

The application UI supports German, English, and Brazilian Portuguese (`src/i18n/locales/de.json`, `en.json`, `pt-br.json`, used via `src/lib/use-translation.ts` and `src/lib/language-context.tsx`). This is separate from the **vocabulary content**, which currently covers the German ↔ Brazilian Portuguese learning pair.

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for the local development workflow, how to add vocabulary content, and how to submit changes. All contributors are expected to follow the [Code of Conduct](./CODE_OF_CONDUCT.md).

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](./CODE_OF_CONDUCT.md).

## License

Linglet is licensed under the **GNU Affero General Public License v3.0 (AGPL-3.0)**. See [LICENSE](./LICENSE) for the full text.
