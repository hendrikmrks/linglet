/**
 * Linglet Test Pipeline
 * 
 * Creates two test users (free + premium) marked with isTestUser=true
 * so they don't appear in rankings or admin user management.
 * 
 * Tests:
 * 1. Login with free test user
 * 2. Login with premium test user
 * 3. Chapters API reachable
 * 4. Subchapters included in chapter response
 * 5. Lesson/exercise start API reachable
 * 
 * Usage: node test-pipeline.js [BASE_URL]
 *   BASE_URL defaults to http://localhost:3000
 */

require('dotenv').config();
const { execSync } = require('child_process');
const { Client } = require('pg');
const bcryptjs = require('bcryptjs');

// ── Run unit/integration tests first ────────────────────────────────────
console.log('\n⏳  Running npm test (Vitest) before integration pipeline...\n');
execSync('npm test', { stdio: 'inherit' });
console.log('\n✅  npm test passed.\n');

// ── Config ──────────────────────────────────────────────────────────────

const BASE_URL = process.argv[2] || 'http://localhost:3000';

const TEST_USER_FREE = {
  email: '__test_free@linglet-test.local',
  password: 'TestPipeline!Free2026',
  name: 'Test Free',
  firstName: 'Test',
  lastName: 'Free',
  plan: 'FREE',
};

const TEST_USER_PREMIUM = {
  email: '__test_premium@linglet-test.local',
  password: 'TestPipeline!Premium2026',
  name: 'Test Premium',
  firstName: 'Test',
  lastName: 'Premium',
  plan: 'PREMIUM',
};

// ── Helpers ─────────────────────────────────────────────────────────────

function hydrateDbEnvFromDatabaseUrl() {
  if (!process.env.DATABASE_URL) return;
  try {
    const parsedUrl = new URL(process.env.DATABASE_URL);
    process.env.DB_HOST = process.env.DB_HOST || parsedUrl.hostname;
    process.env.DB_PORT = process.env.DB_PORT || parsedUrl.port || '5432';
    process.env.DB_USER = process.env.DB_USER || decodeURIComponent(parsedUrl.username || '');
    process.env.DB_PASSWORD = process.env.DB_PASSWORD || decodeURIComponent(parsedUrl.password || '');
    process.env.DB_NAME = process.env.DB_NAME || parsedUrl.pathname.replace(/^\//, '');
  } catch (error) {
    throw new Error(`Invalid DATABASE_URL: ${error.message}`);
  }
}

let passed = 0;
let failed = 0;

function ok(label) {
  passed++;
  console.log(`  ✅  ${label}`);
}

function fail(label, detail) {
  failed++;
  console.error(`  ❌  ${label}${detail ? ' — ' + detail : ''}`);
}

function header(title) {
  console.log(`\n${'─'.repeat(60)}`);
  console.log(`  ${title}`);
  console.log('─'.repeat(60));
}

// ── DB Setup ────────────────────────────────────────────────────────────

hydrateDbEnvFromDatabaseUrl();

const client = new Client({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'postgres',
  password: String(process.env.DB_PASSWORD || ''),
  database: process.env.DB_NAME || 'linglet',
});

async function ensureTestUser(cfg) {
  const existing = await client.query('SELECT id FROM "User" WHERE email = $1', [cfg.email]);

  if (existing.rows.length > 0) {
    // Update password hash and plan in case they changed
    const hash = await bcryptjs.hash(cfg.password, 10);
    await client.query(
      `UPDATE "User" SET "passwordHash" = $1, plan = $2, "isTestUser" = true, "onboardingComplete" = true, "updatedAt" = NOW() WHERE email = $3`,
      [hash, cfg.plan, cfg.email]
    );
    console.log(`  ℹ️  Test user ${cfg.email} already exists — updated.`);
    return existing.rows[0].id;
  }

  const hash = await bcryptjs.hash(cfg.password, 10);
  const result = await client.query(
    `INSERT INTO "User" (id, email, "passwordHash", name, "firstName", "lastName", plan, "isTestUser", "isAdmin",
        "onboardingComplete", language, "learningLanguage", "createdAt", "updatedAt")
     VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, $6, true, false,
        true, 'de', 'pt-br', NOW(), NOW())
     RETURNING id`,
    [cfg.email, hash, cfg.name, cfg.firstName, cfg.lastName, cfg.plan]
  );
  console.log(`  ✨  Created test user ${cfg.email} (${cfg.plan})`);
  return result.rows[0].id;
}

// ── HTTP helpers ────────────────────────────────────────────────────────

async function login(email, password) {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    redirect: 'manual',
  });
  const cookies = res.headers.getSetCookie?.() || [];
  const sessionCookie = cookies.find(c => c.startsWith('sessionToken='));
  const body = await res.json().catch(() => null);
  return { status: res.status, body, sessionCookie };
}

async function apiGet(path, sessionCookie) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { Cookie: sessionCookie },
  });
  const body = await res.json().catch(() => null);
  return { status: res.status, body };
}

// ── Test Suites ─────────────────────────────────────────────────────────

async function testLogin(label, cfg) {
  header(`Login — ${label}`);

  const { status, body, sessionCookie } = await login(cfg.email, cfg.password);

  if (status === 200 && body?.id) {
    ok(`Login successful (id=${body.id}, plan=${body.plan})`);
  } else {
    fail(`Login failed`, `status=${status} body=${JSON.stringify(body)}`);
    return null;
  }

  if (!sessionCookie) {
    fail('No session cookie received');
    return null;
  }
  ok('Session cookie received');
  return sessionCookie;
}

async function testChapters(sessionCookie, label) {
  header(`Chapters — ${label}`);

  const { status, body } = await apiGet('/api/chapters', sessionCookie);

  if (status !== 200) {
    fail('Chapters API', `status=${status}`);
    return;
  }
  ok('Chapters API reachable');

  if (!Array.isArray(body) && !Array.isArray(body?.chapters)) {
    fail('Response is not an array of chapters', JSON.stringify(body)?.slice(0, 200));
    return;
  }

  const chapters = Array.isArray(body) ? body : body.chapters;

  if (chapters.length === 0) {
    fail('No chapters returned (DB may be empty)');
    return;
  }
  ok(`${chapters.length} chapter(s) returned`);

  // Check subchapters
  const firstWithSubs = chapters.find(ch => ch.subchapters && ch.subchapters.length > 0);
  if (firstWithSubs) {
    ok(`Chapter "${firstWithSubs.title}" has ${firstWithSubs.subchapters.length} subchapter(s)`);
  } else {
    fail('No chapter has subchapters');
  }

  return chapters;
}

async function testLessonStart(sessionCookie, label) {
  header(`Lesson / Exercise — ${label}`);

  const { status, body } = await apiGet('/api/lesson', sessionCookie);

  if (status !== 200) {
    fail('Lesson API', `status=${status} body=${JSON.stringify(body)}`);
    return;
  }
  ok('Lesson API reachable');

  if (body?.levelId) {
    ok(`Current level: ${body.levelId}`);
  } else {
    // Not having a levelId is OK for freshly created users with no levels seeded
    console.log('    ⚠️  No levelId returned (no learning levels seeded yet — non-critical)');
  }

  if (body?.learningLanguage) {
    ok(`Learning language: ${body.learningLanguage}`);
  }
}

async function testLeaderboardExclusion(sessionCookie) {
  header('Leaderboard — Test user exclusion');

  const { status, body } = await apiGet('/api/leaderboard', sessionCookie);

  if (status === 403) {
    // Leaderboard may be locked behind premium settings
    console.log('    ⚠️  Leaderboard access restricted by premium settings — skipping');
    return;
  }

  if (status !== 200) {
    fail('Leaderboard API', `status=${status}`);
    return;
  }
  ok('Leaderboard API reachable');

  const entries = body?.entries || [];
  const testEmails = [TEST_USER_FREE.email, TEST_USER_PREMIUM.email];
  const foundTestUser = entries.find(e =>
    testEmails.some(te => e.name?.includes('Test Free') || e.name?.includes('Test Premium'))
  );

  if (foundTestUser) {
    fail('Test user appeared in leaderboard!', JSON.stringify(foundTestUser));
  } else {
    ok('Test users do NOT appear in leaderboard');
  }
}

async function testOnboarding(sessionCookie) {
  header('Onboarding API');

  // Test with valid data
  const res = await fetch(`${BASE_URL}/api/onboarding`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: sessionCookie },
    body: JSON.stringify({ language: 'de', learningLanguage: 'pt-br' }),
  });

  if (res.status === 200) {
    ok('Onboarding API accepts valid language pair');
  } else {
    const body = await res.json().catch(() => null);
    fail('Onboarding API', `status=${res.status} body=${JSON.stringify(body)}`);
  }

  // Test with same language (should fail)
  const resBad = await fetch(`${BASE_URL}/api/onboarding`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: sessionCookie },
    body: JSON.stringify({ language: 'de', learningLanguage: 'de' }),
  });

  if (resBad.status === 400) {
    ok('Onboarding API rejects same native/learning language');
  } else {
    fail('Onboarding API should reject same language', `status=${resBad.status}`);
  }
}

// ── Main ────────────────────────────────────────────────────────────────

async function main() {
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║           LINGLET TEST PIPELINE                        ║');
  console.log(`║  Target: ${BASE_URL.padEnd(47)}║`);
  console.log('╚══════════════════════════════════════════════════════════╝');

  // 1. Connect to DB and ensure test users exist
  header('Database — Preparing test users');
  await client.connect();
  console.log('  ℹ️  Connected to PostgreSQL');

  // Ensure isTestUser column exists (in case migration hasn't run yet)
  try {
    await client.query(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "isTestUser" BOOLEAN NOT NULL DEFAULT false`);
  } catch (_) { /* column may already exist */ }

  const freeUserId = await ensureTestUser(TEST_USER_FREE);
  const premiumUserId = await ensureTestUser(TEST_USER_PREMIUM);
  await client.end();

  // 2. Login tests
  const freeCookie = await testLogin('Free User', TEST_USER_FREE);
  const premiumCookie = await testLogin('Premium User', TEST_USER_PREMIUM);

  if (!freeCookie || !premiumCookie) {
    console.error('\n🚨  Login failed — cannot continue with remaining tests.');
    process.exit(1);
  }

  // 3. Chapters + subchapters tests (both users)
  await testChapters(freeCookie, 'Free User');
  await testChapters(premiumCookie, 'Premium User');

  // 4. Lesson / exercise start tests
  await testLessonStart(freeCookie, 'Free User');
  await testLessonStart(premiumCookie, 'Premium User');

  // 5. Leaderboard exclusion test
  await testLeaderboardExclusion(premiumCookie);

  // 6. Onboarding API test
  await testOnboarding(freeCookie);

  // ── Summary ───────────────────────────────────────────────────────────
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`  Results:  ${passed} passed  /  ${failed} failed`);
  console.log('═'.repeat(60));

  if (failed > 0) {
    console.error('\n🚨  Some tests FAILED.');
    process.exit(1);
  } else {
    console.log('\n🎉  All tests PASSED!');
    process.exit(0);
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
