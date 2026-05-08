// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockDbQuery, mockGetSession, mockEnsurePremiumSettings, mockUpdateStreak } = vi.hoisted(() => ({
  mockDbQuery: vi.fn(),
  mockGetSession: vi.fn(),
  mockEnsurePremiumSettings: vi.fn(),
  mockUpdateStreak: vi.fn(),
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

vi.mock('@/lib/streak', () => ({
  updateStreak: mockUpdateStreak,
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

function setupDbMocks({
  currentStatus = null as string | null,
  currentStreak = 0,
} = {}) {
  const callQueue: Array<{ rows: object[] }> = [
    { rows: currentStatus ? [{ status: currentStatus }] : [] },
    { rows: [] },
    { rows: [] },
    { rows: [{ xp: 100, streakCount: currentStreak }] },
    { rows: [{ count: 1 }] },
  ];

  mockDbQuery.mockReset();
  for (const result of callQueue) {
    mockDbQuery.mockResolvedValueOnce(result);
  }
  mockDbQuery.mockResolvedValue({ rows: [] });
}

describe('POST /api/lesson/complete – Streak-Logik', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockGetSession.mockResolvedValue(mockSession);
    mockEnsurePremiumSettings.mockResolvedValue(mockPremiumSettings);
    mockUpdateStreak.mockResolvedValue({
      streakCount: 1,
      streakUpdatedAt: new Date(),
      updated: true,
    });
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

  it('ruft updateStreak bei erfolgreichem Abschluss auf', async () => {
    setupDbMocks({ currentStreak: 0 });

    const res = await POST(makeRequest({ levelId: 'level1', score: 10, maxScore: 10 }) as any);
    expect(res.status).toBe(200);
    expect(mockUpdateStreak).toHaveBeenCalledWith('user1');
  });

  it('ruft updateStreak auch bei Wiederholung eines bereits abgeschlossenen Levels auf', async () => {
    setupDbMocks({ currentStatus: 'COMPLETED', currentStreak: 3 });

    const res = await POST(makeRequest({ levelId: 'level1', score: 10, maxScore: 10 }) as any);
    expect(res.status).toBe(200);
    expect(mockUpdateStreak).toHaveBeenCalledWith('user1');
  });

  it('antwortet mit success:true und xpReward', async () => {
    setupDbMocks({ currentStreak: 1 });

    const res = await POST(makeRequest({ levelId: 'level1', score: 8, maxScore: 10 }) as any);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.success).toBe(true);
    expect(typeof body.xpReward).toBe('number');
    expect(body.xpReward).toBeGreaterThan(0);
  });

  it('vergibt bei fehlenden Leben keinen Abschluss, kein XP und keinen Streak', async () => {
    const res = await POST(makeRequest({ levelId: 'level1', score: 8, maxScore: 10, livesRemaining: 0 }) as any);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body).toEqual({ success: false, reason: 'no_lives_remaining' });
    expect(mockUpdateStreak).not.toHaveBeenCalled();
    expect(mockDbQuery).not.toHaveBeenCalled();
  });
});
