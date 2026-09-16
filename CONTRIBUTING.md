# Contributing to Linglet

Thanks for your interest in contributing to Linglet, a gamified German ↔ Brazilian Portuguese vocabulary learning app built with Next.js, TypeScript, Prisma, and PostgreSQL. This document explains how to get a local environment running, how the codebase is organized, and how to submit changes.

By participating in this project, you agree to abide by the [Code of Conduct](./CODE_OF_CONDUCT.md).

## Table of Contents

- [Before You Start](#before-you-start)
- [Local Development Setup](#local-development-setup)
- [Database Seeding](#database-seeding)
- [Running Tests](#running-tests)
- [Linting](#linting)
- [Branch & Pull Request Workflow](#branch--pull-request-workflow)
- [Adding Vocabulary Content](#adding-vocabulary-content)
- [Reporting Bugs](#reporting-bugs)
- [AGPL-3.0 and Hosted Forks](#agpl-30-and-hosted-forks)

## Before You Start

Make sure you have:

- Node.js 18+ and npm
- Docker & Docker Compose (for a local PostgreSQL instance)

## Local Development Setup

1. Fork and clone the repository:

   ```bash
   git clone https://github.com/<your-username>/linglet.git
   cd linglet
   ```

2. Copy the environment template and fill it in:

   ```bash
   cp .env.example .env
   ```

   At minimum, set `DATABASE_URL`, `AUTH_SECRET`, and `NEXT_PUBLIC_APP_URL`. See the README's [Environment Variables](./README.md#environment-variables) section for details.

3. Start PostgreSQL locally:

   ```bash
   docker compose up -d
   docker compose logs db   # wait for "database system is ready to accept connections"
   ```

4. Install dependencies:

   ```bash
   npm install
   ```

5. Apply migrations:

   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

6. Seed the database (see [Database Seeding](#database-seeding) below), then start the dev server:

   ```bash
   npm run dev
   ```

   The app runs at `http://localhost:3000`.

You can also build and run the app itself inside Docker via `docker-compose.dev.yml` (see the README's [Docker](./README.md#docker) section) if you'd rather not run Next.js on the host.

## Database Seeding

For day-to-day development, seed all vocabulary chapters with:

```bash
npm run db:seed:chapters
```

To also get an admin account (needed to reach `/admin`), set `ADMIN_PASSWORD` (and optionally `ADMIN_EMAIL`) and run:

```bash
ADMIN_PASSWORD=change_me npm run db:seed:production:complete
```

`scripts/seed-runner.js` (`npm run seed:dev`) is the same seed used in CI: it truncates all content/user tables and reseeds from scratch, which is useful if your local database has drifted or you want a clean slate.

## Running Tests

Unit and integration tests use **Vitest**:

```bash
npm test              # run once
npm run test:watch    # watch mode
npm run test:ui        # Vitest UI
npm run test:coverage # with coverage
```

Test files sit next to the code they cover (`src/**/*.test.ts`) — see `src/lib/streak.test.ts`, `src/lib/premium.test.ts`, `src/lib/validators.test.ts`, `src/lib/exercise-generator.test.ts`, `src/lib/faq.test.ts`, and API tests like `src/app/api/auth/auth.test.ts`, `src/app/api/chapters/chapters.test.ts`, `src/app/api/lesson/complete/route.test.ts`, and `src/app/api/subchapters/complete/route.test.ts`. Please add or update tests for any logic you change, especially in `src/lib/`.

If you want to exercise the full stack (including live API calls), run the integration pipeline against a running dev server and database:

```bash
npm run dev              # in one terminal
npm run test:pipeline    # in another — runs `npm test`, then live checks
```

`test:pipeline` creates temporary `isTestUser=true` accounts that are excluded from the leaderboard and admin user lists, so it's safe to run against a shared dev database.

## Linting

```bash
npm run lint
```

This runs ESLint (`eslint-config-next`) over `.ts`/`.tsx` files. There is no separate typecheck script; `npm run build` (which runs `prisma generate && next build`) will surface TypeScript errors as part of the Next.js build.

Please match the existing code style (TypeScript, functional React components, Tailwind CSS utility classes) rather than introducing new patterns or dependencies without discussion.

## Branch & Pull Request Workflow

1. Create a feature branch off `main`:

   ```bash
   git checkout -b feature/my-feature
   ```

2. Make your changes, with tests where applicable.
3. Make sure `npm run lint` and `npm test` pass, and that `npm run build` succeeds.
4. Commit with a clear, descriptive message.
5. Push your branch and open a Pull Request against `main`, describing what changed and why.
6. Be responsive to review feedback. Small, focused PRs are easier to review than large ones.

## Adding Vocabulary Content

New chapters are the most approachable way to contribute if you're not comfortable touching application code. Each chapter lives in its own seed file, e.g. `seed-de-pt-chapter14-arbeit-wirtschaft.js` (German → Portuguese) or `seed-pt-de-chapter14-trabalho-economia.js` (Portuguese → German).

To add a new chapter:

1. Copy the structure of the nearest existing `seed-de-pt-chapterN-*.js` / `seed-pt-de-chapterN-*.js` file. Each file defines one chapter with:
   - `title`, `description`, `order`
   - an ordered list of subchapters (`title`, `description`, `order`)
   - each subchapter's ordered `vocabulary` array of `{ word, translation, example, translatedExample, order }`
2. Keep `word`/`example` in the source language and `translation`/`translatedExample` in the target language, and make sure example sentences actually contain the word being taught (the fill-in-the-blank exercise type depends on this).
3. Wire the new chapter into `seed-all-pt-de.js` so it's picked up by `npm run db:seed:chapters` and `scripts/seed-runner.js`.
4. Re-seed your local database and manually check the chapter renders correctly and generates sensible exercises (`src/lib/exercise-generator.ts`) before opening a PR.

For corrections to existing vocabulary, either edit the relevant seed file directly, or — if you're testing against a running instance — use the in-app "report word" flow, which admins can triage via `/admin` (`VocabularyReport`).

## Reporting Bugs

Please open a GitHub issue and include:

- Steps to reproduce
- Expected vs. actual behavior
- Environment (OS, Node version, whether you're running via Docker)
- Relevant logs or screenshots

Security-sensitive issues should not be filed as public GitHub issues — instead, contact the maintainer directly (see [Code of Conduct](./CODE_OF_CONDUCT.md) for the contact address).

## AGPL-3.0 and Hosted Forks

Linglet is licensed under the **GNU Affero General Public License v3.0** (see [LICENSE](./LICENSE)). The AGPL's key difference from the plain GPL is its network-use clause (Section 13): if you run a **modified** version of this application on a server and let users interact with it over a network, you must make the complete corresponding source code of your modified version available to those users, under the same license.

In practice, this means: if you fork Linglet and host your own modified instance for others to use, you must offer that instance's users a way to get the modified source (e.g. a link to your fork's repository, kept up to date with what's actually deployed). Simply running an unmodified copy of this repository does not trigger any additional obligation beyond what's already public here.

This is not legal advice — consult the full license text in [LICENSE](./LICENSE) or a qualified professional if you're unsure how it applies to your situation.
