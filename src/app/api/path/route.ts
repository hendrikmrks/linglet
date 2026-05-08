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

    const chaptersResult = await db.query(
      'SELECT id, "titleKey", "orderIndex" FROM "LearningChapter" ORDER BY "orderIndex" ASC'
    );
    const levelsResult = await db.query(
      'SELECT id, "chapterId", "titleKey", "themeKey", "orderIndex", "requiredXp" FROM "LearningLevel" ORDER BY "orderIndex" ASC'
    );
    const progressResult = await db.query(
      'SELECT "levelId", status FROM "UserLevelProgress" WHERE "userId" = $1',
      [session.user.id]
    );

    const progressMap = new Map(progressResult.rows.map((row: any) => [row.levelId, row.status]));

    const levelsByChapter = new Map<string, any[]>();
    for (const level of levelsResult.rows) {
      const status = progressMap.get(level.id) || 'LOCKED';
      const list = levelsByChapter.get(level.chapterId) || [];
      list.push({
        id: level.id,
        titleKey: level.titleKey,
        themeKey: level.themeKey,
        orderIndex: level.orderIndex,
        requiredXp: level.requiredXp,
        status,
      });
      levelsByChapter.set(level.chapterId, list);
    }

    const chapters = chaptersResult.rows.map((chapter: any) => ({
      id: chapter.id,
      titleKey: chapter.titleKey,
      orderIndex: chapter.orderIndex,
      levels: levelsByChapter.get(chapter.id) || [],
    }));

    return NextResponse.json({ chapters }, { status: 200 });
  } catch (error) {
    console.error('Path error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
