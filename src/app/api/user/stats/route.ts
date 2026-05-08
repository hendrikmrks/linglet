import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);

    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    if (session.user.plan !== 'PREMIUM') {
      return NextResponse.json(
        { error: 'Premium plan required' },
        { status: 403 }
      );
    }

    const userId = session.user.id;

    // Run all stat queries in parallel
    const [
      completedLevelsResult,
      totalLevelsResult,
      badgesResult,
      purchasesResult,
      userResult,
    ] = await Promise.all([
      db.query(
        `SELECT COUNT(*) AS count FROM "UserLevelProgress"
         WHERE "userId" = $1 AND status = 'COMPLETED'`,
        [userId]
      ),
      db.query(
        `SELECT COUNT(*) AS count FROM "LearningLevel"`
      ),
      db.query(
        `SELECT COUNT(*) AS count FROM "UserBadge" WHERE "userId" = $1`,
        [userId]
      ),
      db.query(
        `SELECT COUNT(*) AS count FROM "UserPurchase" WHERE "userId" = $1`,
        [userId]
      ),
      db.query(
        `SELECT "createdAt" FROM "User" WHERE id = $1`,
        [userId]
      ),
    ]);

    const completedLevels = parseInt(completedLevelsResult.rows[0]?.count || '0', 10);
    const totalLevels = parseInt(totalLevelsResult.rows[0]?.count || '0', 10);
    const badgesCount = parseInt(badgesResult.rows[0]?.count || '0', 10);
    const purchasesCount = parseInt(purchasesResult.rows[0]?.count || '0', 10);
    const memberSince = userResult.rows[0]?.createdAt ?? null;

    const xp = session.user.xp ?? 0;
    const level = Math.floor(xp / 500) + 1;
    const xpInLevel = xp % 500;

    return NextResponse.json(
      {
        xp,
        level,
        xpInLevel,
        xpToNextLevel: 500 - xpInLevel,
        streakCount: session.user.streakCount ?? 0,
        streakUpdatedAt: session.user.streakUpdatedAt ?? null,
        completedLevels,
        totalLevels,
        badgesCount,
        purchasesCount,
        learningLanguage: session.user.learningLanguage,
        language: session.user.language,
        memberSince,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
