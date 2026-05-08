import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

const ALLOWED_PLANS = new Set(['FREE', 'PREMIUM']);

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession(request);

    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    if (!session.user.isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const plan = body?.plan as string | undefined;

    if (!plan || !ALLOWED_PLANS.has(plan)) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    const updateResult = await db.query(
      `UPDATE "User" SET plan = $1, "updatedAt" = NOW() WHERE id = $2 RETURNING id, email, name, plan, "isAdmin"`,
      [plan, params.id]
    );

    return NextResponse.json({ user: updateResult.rows[0] }, { status: 200 });
  } catch (error) {
    console.error('Admin update user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession(request);

    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    if (!session.user.isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (params.id === session.user.id) {
      return NextResponse.json({ error: 'Cannot delete yourself' }, { status: 400 });
    }

    const targetResult = await db.query(
      'SELECT "isAdmin" FROM "User" WHERE id = $1',
      [params.id]
    );
    const targetIsAdmin = targetResult.rows[0]?.isAdmin === true;

    if (targetIsAdmin) {
      const adminCountResult = await db.query(
        'SELECT COUNT(*)::int AS count FROM "User" WHERE "isAdmin" = true'
      );
      if (Number(adminCountResult.rows[0]?.count || 0) <= 1) {
        return NextResponse.json({ error: 'Cannot delete last admin' }, { status: 400 });
      }
    }

    await db.query('DELETE FROM "Session" WHERE "userId" = $1', [params.id]);
    await db.query('DELETE FROM "PremiumRequest" WHERE "userId" = $1', [params.id]);
    await db.query('DELETE FROM "UserLevelProgress" WHERE "userId" = $1', [params.id]);
    await db.query('DELETE FROM "User" WHERE id = $1', [params.id]);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Admin delete user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
