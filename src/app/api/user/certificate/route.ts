import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

const LANGUAGE_NAMES: Record<string, string> = {
  de: 'Deutsch',
  en: 'English',
  'pt-br': 'Português (Brasil)',
  fr: 'Français',
  es: 'Español',
  it: 'Italiano',
};

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

    const [completedLevelsResult, totalLevelsResult] = await Promise.all([
      db.query(
        `SELECT COUNT(*) AS count FROM "UserLevelProgress"
         WHERE "userId" = $1 AND status = 'COMPLETED'`,
        [userId]
      ),
      db.query(`SELECT COUNT(*) AS count FROM "LearningLevel"`),
    ]);

    const completedLevels = parseInt(completedLevelsResult.rows[0]?.count || '0', 10);
    const totalLevels = parseInt(totalLevelsResult.rows[0]?.count || '0', 10);
    const xp = session.user.xp ?? 0;
    const level = Math.floor(xp / 500) + 1;

    const fromLanguage =
      LANGUAGE_NAMES[session.user.language ?? 'de'] ?? session.user.language ?? 'Deutsch';
    const toLanguage =
      LANGUAGE_NAMES[session.user.learningLanguage ?? 'pt-br'] ??
      session.user.learningLanguage ??
      'Português';

    return NextResponse.json(
      {
        userName: session.user.name,
        xp,
        level,
        completedLevels,
        totalLevels,
        fromLanguage,
        toLanguage,
        issuedAt: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Certificate error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
