// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockDbQuery, mockGetSession, mockEnsurePremiumSettings } = vi.hoisted(() => ({
  mockDbQuery: vi.fn(),
  mockGetSession: vi.fn(),
  mockEnsurePremiumSettings: vi.fn(),
}));

vi.mock('@/lib/db', () => ({
  db: { query: mockDbQuery },
}));

vi.mock('@/lib/auth', () => ({
  getSession: mockGetSession,
}));

vi.mock('@/lib/badges', () => ({
  getEligibleBadges: vi.fn(() => []),
}));

vi.mock('@/lib/premium-settings', () => ({
  ensurePremiumSettings: mockEnsurePremiumSettings,
}));

import { POST } from '@/app/api/lesson/complete/route';

const mockSession = {
  sessionToken: 'token123',
  userId: 'user1',
  expiresAt: new Date(Date.now() + 86400000),
  createdAt: new Date(),
  updatedAt: new Date(),
  user: {
    id: 'user1',
    email: 'test@example.com',
    name: 'Test User',
    firstName: 'Test',
    showFullName: false,
    plan: 'FREE',
    isAdmin: false,
    xp: 100,
    streakCount: 0,
    learningLanguage: 'de',
    language: 'pt-br',
    onboardingComplete: true,
  },
};

const mockPremiumSettings = {
  id: 'default',
  maxLessonsPerDayFree: -1,
  maxLessonsPerDayPremium: -1,
  xpMultiplierPremium: 1.5,
};

function makeRequest(body: object) {
  return new Request('http://localhost/api/lesson/complete', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
}

/**
 * Helper: sets up the standard DB mock sequence for a lesson completion.
 * Note: the daily-limit DB query is only executed when maxLessonsPerDay > 0.
 * Since mockPremiumSettings sets maxLessonsPerDayFree = -1, that query is skipped.
 *
 * Sequence:
 * 1. Current lesson progress (SELECT status FROM "UserLevelProgress")
 * 2. XP update (UPDATE "User" SET xp …)
 * 3. Lesson progress update (UPDATE "UserLevelProgress" SET status = 'COMPLETED' …)
 * 4. Streak read  (only when currentStatus !== 'COMPLETED')
 * 5. Streak write (only when lastDay !== today AND currentStatus !== 'COMPLETED')
 * 6. User XP/streak read
 * 7. Completed lessons count
 */
function setupDbMocks({
  currentStatus = null as string | null,
  currentStreak = 0,
  lastStreakDate = null as string | null,
  streakShouldUpdate = true,
} = {}) {
  const isAlreadyCompleted = currentStatus === 'COMPLETED';

  const callQueue: Array<{ rows: object[] }> = [
    // 1. Current lesson progress
    { rows: currentStatus ? [{ status: currentStatus }] : [] },
    // 2. XP update
    { rows: [] },
    // 3. Lesson progress update
    { rows: [] },
  ];

  if (!isAlreadyCompleted) {
    // 4. Streak read
    callQueue.push({
      rows: [
        {
          streakCount: currentStreak,
          streakUpdatedAt: lastStreakDate ? new Date(lastStreakDate) : null,
        },
      ],
    });

    if (streakShouldUpdate) {
      // 5. Streak write
      callQueue.push({ rows: [] });
    }
  }

  // Always: user read, completed count
  callQueue.push({ rows: [{ xp: 100, streakCount: currentStreak }] });
  callQueue.push({ rows: [{ count: 1 }] });

  mockDbQuery.mockReset();
  for (const result of callQueue) {
    mockDbQuery.mockResolvedValueOnce(result);
  }
  // Fallback for any extra calls (e.g. badge inserts)
  mockDbQuery.mockResolvedValue({ rows: [] });
}

// ─── helpers for date strings ────────────────────────────────────────────────

function today() {
  return new Date().toISOString().slice(0, 10);
}

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

// ─────────────────────────────────────────────────────────────────────────────

describe('POST /api/lesson/complete – Streak-Logik', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockGetSession.mockResolvedValue(mockSession);
    mockEnsurePremiumSettings.mockResolvedValue(mockPremiumSettings);
  });

  it('gibt 401 zurück, wenn der Nutzer nicht eingeloggt ist', async () => {
    mockGetSession.mockResolvedValueOnce(null);
    const res = await POST(makeRequest({ levelId: 'level1' }) as any);
    expect(res.status).toBe(401);
  });

  it('gibt 400 zurück, wenn levelId fehlt', async () => {
    const res = await POST(makeRequest({}) as any);
    expect(res.status).toBe(400);
  });

  // ── Streak-Tests ────────────────────────────────────────────────────────────

  it('setzt Streak auf 1 beim ersten Abschluss (kein vorheriger Streak)', async () => {
    setupDbMocks({ currentStreak: 0, lastStreakDate: null, streakShouldUpdate: true });

    const res = await POST(makeRequest({ levelId: 'level1', score: 10, maxScore: 10 }) as any);
    expect(res.status).toBe(200);

    // Streak-Update-Query muss mit newStreak=1 aufgerufen worden sein
    const streakUpdateCall = mockDbQuery.mock.calls.find(
      (call) =>
        typeof call[0] === 'string' &&
        call[0].includes('"streakCount"') &&
        call[0].includes('UPDATE "User"') &&
        call[1]?.[0] === 1
    );
    expect(streakUpdateCall).toBeDefined();
  });

  it('erhöht den Streak um 1 bei Abschluss am Folgetag', async () => {
    const yesterday = daysAgo(1);
    setupDbMocks({ currentStreak: 3, lastStreakDate: yesterday, streakShouldUpdate: true });

    const res = await POST(makeRequest({ levelId: 'level1', score: 10, maxScore: 10 }) as any);
    expect(res.status).toBe(200);

    const streakUpdateCall = mockDbQuery.mock.calls.find(
      (call) =>
        typeof call[0] === 'string' &&
        call[0].includes('"streakCount"') &&
        call[0].includes('UPDATE "User"') &&
        call[1]?.[0] === 4 // 3 + 1
    );
    expect(streakUpdateCall).toBeDefined();
  });

  it('setzt Streak zurück auf 1 wenn ein Tag ausgelassen wurde', async () => {
    const twoDaysAgo = daysAgo(2);
    setupDbMocks({ currentStreak: 5, lastStreakDate: twoDaysAgo, streakShouldUpdate: true });

    const res = await POST(makeRequest({ levelId: 'level1', score: 10, maxScore: 10 }) as any);
    expect(res.status).toBe(200);

    const streakUpdateCall = mockDbQuery.mock.calls.find(
      (call) =>
        typeof call[0] === 'string' &&
        call[0].includes('"streakCount"') &&
        call[0].includes('UPDATE "User"') &&
        call[1]?.[0] === 1 // reset to 1
    );
    expect(streakUpdateCall).toBeDefined();
  });

  it('ändert den Streak NICHT wenn heute bereits eine Übung abgeschlossen wurde', async () => {
    setupDbMocks({ currentStreak: 2, lastStreakDate: today(), streakShouldUpdate: false });

    const res = await POST(makeRequest({ levelId: 'level1', score: 10, maxScore: 10 }) as any);
    expect(res.status).toBe(200);

    // Kein Streak-Update-Query darf abgesetzt worden sein
    const streakUpdateCall = mockDbQuery.mock.calls.find(
      (call) =>
        typeof call[0] === 'string' &&
        call[0].includes('"streakCount"') &&
        call[0].includes('UPDATE "User"')
    );
    expect(streakUpdateCall).toBeUndefined();
  });

  it('aktualisiert den Streak NICHT wenn die Übung bereits abgeschlossen war (currentStatus=COMPLETED)', async () => {
    // When currentStatus is COMPLETED the route skips the entire streak block
    setupDbMocks({ currentStatus: 'COMPLETED', currentStreak: 3, lastStreakDate: daysAgo(1), streakShouldUpdate: false });

    const res = await POST(makeRequest({ levelId: 'level1', score: 10, maxScore: 10 }) as any);
    expect(res.status).toBe(200);

    const streakUpdateCall = mockDbQuery.mock.calls.find(
      (call) =>
        typeof call[0] === 'string' &&
        call[0].includes('"streakCount"') &&
        call[0].includes('UPDATE "User"')
    );
    expect(streakUpdateCall).toBeUndefined();
  });

  it('antwortet mit success:true und xpReward', async () => {
    setupDbMocks({ currentStreak: 1, lastStreakDate: daysAgo(1), streakShouldUpdate: true });

    const res = await POST(makeRequest({ levelId: 'level1', score: 8, maxScore: 10 }) as any);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.success).toBe(true);
    expect(typeof body.xpReward).toBe('number');
    expect(body.xpReward).toBeGreaterThan(0);
  });
});
