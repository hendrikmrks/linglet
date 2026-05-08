import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession(request);

    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { language } = body;

    if (!['de', 'en', 'pt-br'].includes(language)) {
      return NextResponse.json(
        { error: 'Invalid language' },
        { status: 400 }
      );
    }

    // Update user language
    const query = `UPDATE "User" SET language = $1, "updatedAt" = NOW() WHERE id = $2 RETURNING *`;
    const result = await db.query(query, [language, session.user.id]);

    const { passwordHash, ...userWithoutPassword } = result.rows[0];

    return NextResponse.json(
      { ...userWithoutPassword, message: 'Language updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Language update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
