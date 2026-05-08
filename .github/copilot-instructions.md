# Copilot Instructions — Linglet

## Tech Stack

Next.js 14 (App Router) · TypeScript · Tailwind CSS · PostgreSQL 16 · `pg` (direct SQL) · Zod · bcryptjs · Vitest

## Commands

```bash
npm run dev              # Start dev server (http://localhost:3000)
npm run build            # prisma generate + next build
npm run lint             # ESLint on .ts/.tsx
npm test                 # Run all Vitest tests once
npm run test:watch       # Vitest watch mode
npx vitest run src/lib/validators.test.ts   # Run a single test file
npm run prisma:migrate   # Apply pending migrations (prisma migrate deploy)
npm run db:seed          # Seed test data
docker compose up -d     # Start PostgreSQL container
```

## Architecture

### Database Layer — NOT Prisma Client

`prisma/schema.prisma` exists **only for migrations**. At runtime the app uses **raw SQL via the `pg` pool**:

- `src/lib/db.ts` exports two things:
  - `db` — the raw `pg.Pool` for direct `db.query(sql, params)` calls
  - `prisma` — a **hand-rolled wrapper** with a Prisma-like API (`prisma.user.findUnique(…)`) that internally issues raw SQL; it is **not** the actual Prisma Client

Use `db.query()` directly for anything not already covered by the wrapper. Always quote PascalCase table/column names in SQL (e.g., `"User"`, `"sessionToken"`).

### Authentication

Custom session system — no NextAuth or third-party auth library.

- **`src/lib/auth.ts`**: `createSession`, `getSession`, `getCurrentUser`, `deleteSession`
- Sessions are stored in the `"Session"` table with a 7-day expiry
- httpOnly cookie named `sessionToken`
- **Middleware** (`src/middleware.ts`): guards `/dashboard`, `/profile`, `/settings`, `/admin` by checking cookie *existence only*. Full session validation happens inside each API route handler

### Internationalisation

Custom i18n — no next-intl or i18next.

- Translation files: `src/i18n/locales/{de,en,pt-br}.json`
- `useTranslation(language)` in `src/lib/use-translation.ts` — returns a `t(key)` function using dot-notation keys (e.g. `t('auth.passwordsDoNotMatch')`)
- `useLanguage()` from `src/lib/language-context.tsx` — provides the current UI language; persists to the DB for logged-in users, to `localStorage` for guests
- Each user has two language fields: `language` (UI/interface language) and `learningLanguage` (what they are studying, e.g. `"pt-br"`)

### Content Model

`Chapter → Subchapter → Vocabulary` hierarchy, all with an `order: Int` field. Chapters carry both `sourceLanguage` (interface language) and `targetLanguage` (language being learned). Unique constraint: `(sourceLanguage, targetLanguage, order)`.

### Plan Gating

`src/lib/premium.ts` provides `isPremium(user)` and `requirePremium(user)`. Configurable limits live in the `PremiumSettings` singleton row (`src/lib/premium-settings.ts`). `-1` means unlimited.

### Exercises

`src/lib/exercise-generator.ts` generates Duolingo-style exercises (translate-choice, reverse-choice, match-pairs, type-answer, fill-in-blank, true-false, word-scramble) from `Vocabulary` items.

## Key Conventions

- **Path alias**: `@` → `src/` (configured in `tsconfig.json` and `vitest.config.ts`)
- **Tests**: Vitest with jsdom; test files live alongside source in `src/lib/` with `.test.ts` suffix; globals are enabled so no import needed for `describe`/`it`/`expect`
- **Validation**: All API input validated with Zod schemas from `src/lib/validators.ts`; export both schema and inferred type (e.g. `registerSchema` + `RegisterInput`)
- **API routes**: Next.js route handlers (`route.ts`); call `getCurrentUser(req)` at the top and return 401 JSON for unauthenticated requests
- **Supported learning languages**: `'de' | 'en' | 'pt-br'` — this enum appears in Zod schemas, `language-context.tsx`, and `use-translation.ts`; add new languages to all three places
- **Commit style**: conventional commits (`feat:`, `fix:`, `chore:`, etc.)

## Environment Variables

```env
DATABASE_URL="postgresql://postgres@localhost:5432/linglet?schema=public"
AUTH_SECRET="dev_only_replace_me"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

## Test Credentials (after seeding)

| Account | Email | Password | Plan |
|---------|-------|----------|------|
| Free | test@example.com | Passw0rd! | FREE |
| Premium | premium@example.com | Passw0rd! | PREMIUM |
