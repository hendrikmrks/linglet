import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession(request);

    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const { language, learningLanguage } = body;

    const validLanguages = ['de', 'en', 'pt-br'];
    if (!validLanguages.includes(language) || !validLanguages.includes(learningLanguage)) {
      return NextResponse.json({ error: 'Invalid language' }, { status: 400 });
    }

    if (language === learningLanguage) {
      return NextResponse.json({ error: 'Native and learning language must differ' }, { status: 400 });
    }

    await db.query(
      `UPDATE "User"
       SET language = $1, "learningLanguage" = $2, "onboardingComplete" = true, "updatedAt" = NOW()
       WHERE id = $3`,
      [language, learningLanguage, session.user.id]
    );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Onboarding error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
