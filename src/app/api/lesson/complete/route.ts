import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { getEligibleBadges } from '@/lib/badges';
import { ensurePremiumSettings } from '@/lib/premium-settings';
import { updateStreak } from '@/lib/streak';

const MIN_XP_REWARD = 5;
const MAX_XP_REWARD = 30;

export async function POST(request: NextRequest) {
  try {
    const session = await getSession(request);

    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const levelId = body?.levelId as string | undefined;
    const score = Math.max(0, Number(body?.score || 0));
    const maxScore = Math.max(0, Number(body?.maxScore || 0));

    if (!levelId) {
      return NextResponse.json({ error: 'Missing levelId' }, { status: 400 });
    }

    if (maxScore > 0 && score > maxScore) {
      return NextResponse.json({ error: 'Invalid score: score cannot exceed maxScore' }, { status: 400 });
    }

    const userId = session.user.id;
    const isPremium = session.user.plan === 'PREMIUM';
    const settings = await ensurePremiumSettings();

    // Check daily lesson limit
    const maxLessonsPerDay = isPremium ? settings.maxLessonsPerDayPremium : settings.maxLessonsPerDayFree;
    if (maxLessonsPerDay > 0) {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const completedTodayResult = await db.query(
        `SELECT COUNT(*)::int AS count FROM "UserLevelProgress"
         WHERE "userId" = $1 AND status = 'COMPLETED' AND "updatedAt" >= $2`,
        [userId, todayStart.toISOString()]
      );
      const completedToday = completedTodayResult.rows[0]?.count || 0;
      if (completedToday >= maxLessonsPerDay) {
        return NextResponse.json(
          { error: 'Daily lesson limit reached', limit: maxLessonsPerDay },
          { status: 429 }
        );
      }
    }

    const progressResult = await db.query(
      'SELECT status FROM "UserLevelProgress" WHERE "userId" = $1 AND "levelId" = $2',
      [userId, levelId]
    );
    const currentStatus = progressResult.rows[0]?.status as string | undefined;

    let xpReward = MIN_XP_REWARD;
    if (maxScore > 0) {
      const ratio = Math.min(Math.max(score / maxScore, 0), 1);
      xpReward = Math.max(MIN_XP_REWARD, Math.round(MAX_XP_REWARD * ratio));
    }

    if (currentStatus === 'COMPLETED') {
      xpReward = Math.max(2, Math.round(xpReward * 0.3));
    }

    // Apply premium XP multiplier
    if (isPremium && settings.xpMultiplierPremium > 1) {
      xpReward = Math.round(xpReward * settings.xpMultiplierPremium);
    }

    await db.query(
      'UPDATE "User" SET xp = LEAST(xp + $1, 2147483647), "updatedAt" = NOW() WHERE id = $2',
      [xpReward, userId]
    );

    await db.query(
      `UPDATE "UserLevelProgress" SET status = 'COMPLETED', "updatedAt" = NOW()
       WHERE "userId" = $1 AND "levelId" = $2`,
      [userId, levelId]
    );

    await updateStreak(userId);

    const userResult = await db.query(
      'SELECT xp, "streakCount" FROM "User" WHERE id = $1',
      [userId]
    );
    const completedResult = await db.query(
      'SELECT COUNT(*)::int AS count FROM "UserLevelProgress" WHERE "userId" = $1 AND status = $2',
      [userId, 'COMPLETED']
    );

    const eligibleBadges = getEligibleBadges({
      xp: Number(userResult.rows[0]?.xp || 0),
      streakCount: Number(userResult.rows[0]?.streakCount || 0),
      completedLevels: Number(completedResult.rows[0]?.count || 0),
    });

    for (const badgeId of eligibleBadges) {
      await db.query(
        `INSERT INTO "UserBadge" ("userId", "badgeId", "awardedAt")
         VALUES ($1, $2, NOW())
         ON CONFLICT ("userId", "badgeId") DO NOTHING`,
        [userId, badgeId]
      );
    }

    return NextResponse.json({ success: true, xpReward }, { status: 200 });
  } catch (error) {
    console.error('Lesson complete error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
