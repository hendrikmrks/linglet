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

    if (!session.user.isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const result = await db.query(
      `SELECT id, email, name, plan, "isAdmin", xp, "streakCount", "learningLanguage", language, "createdAt", "updatedAt"
       FROM "User"
       WHERE "isTestUser" IS NOT TRUE
       ORDER BY "createdAt" ASC`
    );

    return NextResponse.json({ users: result.rows }, { status: 200 });
  } catch (error) {
    console.error('Admin users error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
