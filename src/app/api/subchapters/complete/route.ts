import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { getEligibleBadges } from '@/lib/badges';
import { ensurePremiumSettings } from '@/lib/premium-settings';
import { updateStreak } from '@/lib/streak';

const MIN_XP_REWARD = 10;
const MAX_XP_REWARD = 30;

type SubchapterStatus = 'LOCKED' | 'CURRENT' | 'COMPLETED';

async function ensureProgressTable() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS "UserSubchapterProgress" (
      id TEXT PRIMARY KEY,
      "userId" TEXT NOT NULL,
      "subchapterId" TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'LOCKED' CHECK (status IN ('LOCKED', 'CURRENT', 'COMPLETED')),
      "bestScore" INT NOT NULL DEFAULT 0,
      attempts INT NOT NULL DEFAULT 0,
      "completedAt" TIMESTAMP NULL,
      "createdAt" TIMESTAMP DEFAULT NOW(),
      "updatedAt" TIMESTAMP DEFAULT NOW(),
      FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE,
      FOREIGN KEY ("subchapterId") REFERENCES "Subchapter"(id) ON DELETE CASCADE,
      UNIQUE ("userId", "subchapterId")
    )
  `);
}

function deriveStatuses(
  subchapters: Array<{ id: string; isAvailable: boolean }>,
  progressMap: Map<string, string>
): Map<string, SubchapterStatus> {
  const statuses = new Map<string, SubchapterStatus>();
  let currentAssigned = false;

  for (const subchapter of subchapters) {
    const persisted = progressMap.get(subchapter.id);

    if (!subchapter.isAvailable) {
      statuses.set(subchapter.id, 'LOCKED');
      continue;
    }

    if (persisted === 'COMPLETED') {
      statuses.set(subchapter.id, 'COMPLETED');
      continue;
    }

    if (!currentAssigned) {
      statuses.set(subchapter.id, 'CURRENT');
      currentAssigned = true;
    } else {
      statuses.set(subchapter.id, 'LOCKED');
    }
  }

  return statuses;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession(request);

    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const subchapterId = body?.subchapterId as string | undefined;
    const score = Math.max(0, Number(body?.score || 0));
    const maxScore = Math.max(0, Number(body?.maxScore || 0));

    if (!subchapterId) {
      return NextResponse.json({ error: 'Missing subchapterId' }, { status: 400 });
    }

    if (maxScore > 0 && score > maxScore) {
      return NextResponse.json({ error: 'Invalid score: score cannot exceed maxScore' }, { status: 400 });
    }

    await ensureProgressTable();

    const subchapterResult = await db.query(
      `SELECT s.id, s."chapterId", s."order", s."isLocked", s."unlocksAt"
       FROM "Subchapter" s
       WHERE s.id = $1`,
      [subchapterId]
    );

    if (subchapterResult.rows.length === 0) {
      return NextResponse.json({ error: 'Subchapter not found' }, { status: 404 });
    }

    const userId = session.user.id;
    const chapterId = subchapterResult.rows[0].chapterId as string;
    const isPremium = session.user.plan === 'PREMIUM';
    const settings = await ensurePremiumSettings();

    // Check daily subchapter completion limit
    const maxSubchaptersPerDay = isPremium ? settings.maxSubchaptersPerDayPremium : settings.maxSubchaptersPerDayFree;
    if (maxSubchaptersPerDay > 0) {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const completedTodayResult = await db.query(
        `SELECT COUNT(*)::int AS count FROM "UserSubchapterProgress"
         WHERE "userId" = $1 AND status = 'COMPLETED' AND "completedAt" >= $2`,
        [userId, todayStart.toISOString()]
      );
      const completedToday = completedTodayResult.rows[0]?.count || 0;
      if (completedToday >= maxSubchaptersPerDay) {
        return NextResponse.json(
          { error: 'Daily subchapter limit reached', limit: maxSubchaptersPerDay },
          { status: 429 }
        );
      }
    }

    const chapterSubchaptersResult = await db.query(
      `SELECT id, "order", "isLocked", "unlocksAt"
       FROM "Subchapter"
       WHERE "chapterId" = $1
       ORDER BY "order" ASC`,
      [chapterId]
    );

    const now = new Date();
    const chapterSubchapters = chapterSubchaptersResult.rows.map((row: any) => {
      const unlocksAt = row.unlocksAt ? new Date(row.unlocksAt) : null;
      const isAvailable = !row.isLocked || (unlocksAt ? now >= unlocksAt : false);
      return {
        id: row.id as string,
        isAvailable,
      };
    });

    for (const subchapter of chapterSubchapters) {
      await db.query(
        `INSERT INTO "UserSubchapterProgress" (id, "userId", "subchapterId", status, "createdAt", "updatedAt")
         VALUES ($1, $2, $3, 'LOCKED', NOW(), NOW())
         ON CONFLICT ("userId", "subchapterId") DO NOTHING`,
        [`${userId}-${subchapter.id}`, userId, subchapter.id]
      );
    }

    const progressResult = await db.query(
      `SELECT "subchapterId", status
       FROM "UserSubchapterProgress"
       WHERE "userId" = $1 AND "subchapterId" = ANY($2::text[])`,
      [userId, chapterSubchapters.map((subchapter) => subchapter.id)]
    );

    const progressMap = new Map<string, string>(
      progressResult.rows.map((row: any) => [row.subchapterId, row.status])
    );

    const preStatuses = deriveStatuses(chapterSubchapters, progressMap);
    const currentStatus = preStatuses.get(subchapterId) || 'LOCKED';

    if (currentStatus === 'LOCKED') {
      return NextResponse.json({ error: 'Subchapter is locked' }, { status: 403 });
    }

    let xpReward = MIN_XP_REWARD;
    if (maxScore > 0) {
      const ratio = Math.min(Math.max(score / maxScore, 0), 1);
      xpReward = Math.max(MIN_XP_REWARD, Math.round(MAX_XP_REWARD * ratio));
    }

    if (progressMap.get(subchapterId) === 'COMPLETED') {
      xpReward = Math.max(3, Math.round(xpReward * 0.25));
    }

    // Apply premium XP multiplier
    if (isPremium && settings.xpMultiplierPremium > 1) {
      xpReward = Math.round(xpReward * settings.xpMultiplierPremium);
    }

    await db.query(
      `UPDATE "UserSubchapterProgress"
       SET status = 'COMPLETED',
           attempts = attempts + 1,
           "bestScore" = GREATEST("bestScore", $1),
           "completedAt" = COALESCE("completedAt", NOW()),
           "updatedAt" = NOW()
       WHERE "userId" = $2 AND "subchapterId" = $3`,
      [score, userId, subchapterId]
    );

    await db.query(
      'UPDATE "User" SET xp = LEAST(xp + $1, 2147483647), "updatedAt" = NOW() WHERE id = $2',
      [xpReward, userId]
    );

    await updateStreak(userId);

    const refreshedProgressResult = await db.query(
      `SELECT "subchapterId", status
       FROM "UserSubchapterProgress"
       WHERE "userId" = $1 AND "subchapterId" = ANY($2::text[])`,
      [userId, chapterSubchapters.map((subchapter) => subchapter.id)]
    );

    const refreshedProgressMap = new Map<string, string>(
      refreshedProgressResult.rows.map((row: any) => [row.subchapterId, row.status])
    );

    const finalStatuses = deriveStatuses(chapterSubchapters, refreshedProgressMap);

    for (const subchapter of chapterSubchapters) {
      const status = finalStatuses.get(subchapter.id) || 'LOCKED';

      if (status === 'COMPLETED') {
        continue;
      }

      await db.query(
        `UPDATE "UserSubchapterProgress"
         SET status = $1, "updatedAt" = NOW()
         WHERE "userId" = $2 AND "subchapterId" = $3`,
        [status, userId, subchapter.id]
      );
    }

    const userResult = await db.query(
      'SELECT xp, "streakCount" FROM "User" WHERE id = $1',
      [userId]
    );

    const completedSubchaptersResult = await db.query(
      `SELECT COUNT(*)::int AS count
       FROM "UserSubchapterProgress"
       WHERE "userId" = $1 AND status = 'COMPLETED'`,
      [userId]
    );

    const eligibleBadges = getEligibleBadges({
      xp: Number(userResult.rows[0]?.xp || 0),
      streakCount: Number(userResult.rows[0]?.streakCount || 0),
      completedLevels: Number(completedSubchaptersResult.rows[0]?.count || 0),
    });

    for (const badgeId of eligibleBadges) {
      await db.query(
        `INSERT INTO "UserBadge" ("userId", "badgeId", "awardedAt")
         VALUES ($1, $2, NOW())
         ON CONFLICT ("userId", "badgeId") DO NOTHING`,
        [userId, badgeId]
      );
    }

    const chapterCompleted = Array.from(finalStatuses.values()).every(
      (status) => status === 'COMPLETED' || status === 'LOCKED'
    ) && Array.from(finalStatuses.values()).some((status) => status === 'COMPLETED');

    return NextResponse.json(
      {
        success: true,
        xpReward,
        chapterCompleted,
        statuses: Object.fromEntries(finalStatuses),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Subchapter complete error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
