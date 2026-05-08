// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest';

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

import { POST } from '@/app/api/subchapters/complete/route';

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

function makeRequest(body: object) {
  return new Request('http://localhost/api/subchapters/complete', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('POST /api/subchapters/complete', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockGetSession.mockResolvedValue(mockSession);
    mockEnsurePremiumSettings.mockResolvedValue({
      maxSubchaptersPerDayFree: -1,
      maxSubchaptersPerDayPremium: -1,
      xpMultiplierPremium: 1.5,
    });
    mockUpdateStreak.mockResolvedValue({ updated: true, streakCount: 1, streakUpdatedAt: new Date() });
  });

  it('vergibt bei Game Over keinen Abschluss, kein XP und keinen Streak', async () => {
    mockDbQuery.mockResolvedValueOnce({ rows: [{ id: 'sub1', chapterId: 'chapter1' }] });

    const res = await POST(makeRequest({ subchapterId: 'sub1', score: 3, maxScore: 10, livesRemaining: 0 }) as any);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body).toEqual({ success: false, reason: 'no_lives_remaining' });
    expect(mockUpdateStreak).not.toHaveBeenCalled();
    expect(mockDbQuery).toHaveBeenCalledTimes(1);
  });
});
