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
      `SELECT pr.id, pr."userId", pr.reason, pr.message, pr.status, pr."createdAt", pr."updatedAt",
              u.email, u.name
       FROM "PremiumRequest" pr
       JOIN "User" u ON u.id = pr."userId"
       ORDER BY pr."createdAt" DESC`
    );

    return NextResponse.json({ requests: result.rows }, { status: 200 });
  } catch (error) {
    console.error('Admin premium requests error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
