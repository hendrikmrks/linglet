// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockDbQuery, mockGetSession, mockPrismaFindMany, mockEnsurePremiumSettings } = vi.hoisted(
  () => ({
    mockDbQuery: vi.fn(),
    mockGetSession: vi.fn(),
    mockPrismaFindMany: vi.fn(),
    mockEnsurePremiumSettings: vi.fn(),
  })
);

vi.mock('@/lib/db', () => ({
  db: { query: mockDbQuery },
  prisma: {
    chapter: { findMany: mockPrismaFindMany },
  },
}));

vi.mock('@/lib/auth', () => ({
  getSession: mockGetSession,
}));

vi.mock('@/lib/premium-settings', () => ({
  ensurePremiumSettings: mockEnsurePremiumSettings,
}));

import { GET } from '@/app/api/chapters/route';

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
    xp: 0,
    streakCount: 0,
    learningLanguage: 'de',
    language: 'pt-br',
    onboardingComplete: true,
  },
};

const mockPremiumSettings = {
  id: 'default',
  maxChaptersPerDayFree: 3,
  maxChaptersPerDayPremium: -1,
  maxSubchaptersPerDayFree: 3,
  maxSubchaptersPerDayPremium: -1,
  maxChaptersTotalFree: -1,
  canSeeLeaderboardFree: false,
  canSeeLeaderboardPremium: true,
  xpMultiplierPremium: 1.5,
  maxLessonsPerDayFree: 3,
  maxLessonsPerDayPremium: -1,
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
};

describe('GET /api/chapters', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockDbQuery.mockResolvedValue({ rows: [] });
    mockPrismaFindMany.mockResolvedValue([]);
    mockEnsurePremiumSettings.mockResolvedValue(mockPremiumSettings);
  });

  it('returns 401 for unauthenticated request', async () => {
    mockGetSession.mockResolvedValueOnce(null);

    const req = new Request('http://localhost/api/chapters');
    const res = await GET(req as any);
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data).toMatchObject({ error: 'Not authenticated' });
  });

  it('returns 200 with chapters array for authenticated request', async () => {
    mockGetSession.mockResolvedValueOnce(mockSession);

    const req = new Request('http://localhost/api/chapters');
    const res = await GET(req as any);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data.chapters)).toBe(true);
  });
});
