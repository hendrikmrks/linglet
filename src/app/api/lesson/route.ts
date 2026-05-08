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

    const userId = session.user.id;
    const learningLanguage = session.user.learningLanguage || 'en';
    const requestedLevelId = request.nextUrl.searchParams.get('levelId');

    if (requestedLevelId) {
      const levelCheck = await db.query(
        'SELECT id FROM "LearningLevel" WHERE id = $1',
        [requestedLevelId]
      );

      if (levelCheck.rows.length === 0) {
        return NextResponse.json({ error: 'Invalid levelId' }, { status: 404 });
      }

      return NextResponse.json(
        { levelId: requestedLevelId, learningLanguage },
        { status: 200 }
      );
    }

    const currentLevelResult = await db.query(
      `SELECT "levelId" FROM "UserLevelProgress"
       WHERE "userId" = $1 AND status = 'CURRENT'
       LIMIT 1`,
      [userId]
    );

    let levelId = currentLevelResult.rows[0]?.levelId;

    if (!levelId) {
      const firstLevelResult = await db.query(
        'SELECT id FROM "LearningLevel" ORDER BY "orderIndex" ASC LIMIT 1'
      );
      levelId = firstLevelResult.rows[0]?.id || null;
    }

    return NextResponse.json(
      { levelId, learningLanguage },
      { status: 200 }
    );
  } catch (error) {
    console.error('Lesson error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
