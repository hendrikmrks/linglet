import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession(request);

    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const userId = session.user.id;

    const userResult = await db.query('SELECT xp FROM "User" WHERE id = $1', [userId]);
    const userXp = Number(userResult.rows[0]?.xp || 0);

    const levelsResult = await db.query(
      'SELECT id, "requiredXp" FROM "LearningLevel" ORDER BY "orderIndex" ASC'
    );
    const levels = levelsResult.rows;

    // Ensure progress rows exist
    for (const level of levels) {
      await db.query(
        `INSERT INTO "UserLevelProgress" (id, "userId", "levelId")
         VALUES ($1, $2, $3)
         ON CONFLICT ("userId", "levelId") DO NOTHING`,
        [`${userId}-${level.id}`, userId, level.id]
      );
    }

    const progressResult = await db.query(
      'SELECT "levelId", status FROM "UserLevelProgress" WHERE "userId" = $1',
      [userId]
    );
    const progressMap = new Map(progressResult.rows.map((row: any) => [row.levelId, row.status]));

    // Determine statuses based on XP unlocks, preserve completions
    let currentAssigned = false;

    for (const level of levels) {
      const existingStatus = progressMap.get(level.id) as string | undefined;
      let status: 'LOCKED' | 'CURRENT' | 'COMPLETED' = 'LOCKED';

      if (existingStatus === 'COMPLETED') {
        status = 'COMPLETED';
      } else if (!currentAssigned && userXp >= Number(level.requiredXp)) {
        status = 'CURRENT';
        currentAssigned = true;
      }

      await db.query(
        `UPDATE "UserLevelProgress" SET status = $1, "updatedAt" = NOW()
         WHERE "userId" = $2 AND "levelId" = $3`,
        [status, userId, level.id]
      );
    }

    // If all levels completed, keep last as current
    if (!currentAssigned && levels.length > 0) {
      const lastLevel = levels[levels.length - 1];
      await db.query(
        `UPDATE "UserLevelProgress" SET status = 'CURRENT', "updatedAt" = NOW()
         WHERE "userId" = $1 AND "levelId" = $2`,
        [userId, lastLevel.id]
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Path refresh error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
