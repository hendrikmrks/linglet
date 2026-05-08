import { db } from '@/lib/db';

export type PremiumSettings = {
  id: string;
  maxChaptersPerDayFree: number;
  maxChaptersPerDayPremium: number;
  maxSubchaptersPerDayFree: number;
  maxSubchaptersPerDayPremium: number;
  maxChaptersTotalFree: number;
  canSeeLeaderboardFree: boolean;
  canSeeLeaderboardPremium: boolean;
  xpMultiplierPremium: number;
  maxLessonsPerDayFree: number;
  maxLessonsPerDayPremium: number;
  createdAt: string;
  updatedAt: string;
};

const DEFAULT_ID = 'default';

export async function ensurePremiumSettings(): Promise<PremiumSettings> {
  await db.query(
    `INSERT INTO "PremiumSettings" (id, "createdAt", "updatedAt") 
     VALUES ($1, NOW(), NOW()) 
     ON CONFLICT (id) DO NOTHING`,
    [DEFAULT_ID]
  );

  const result = await db.query(
    'SELECT * FROM "PremiumSettings" WHERE id = $1',
    [DEFAULT_ID]
  );

  return result.rows[0];
}
