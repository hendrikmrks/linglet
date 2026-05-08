import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

const ALLOWED_STATUSES = new Set(['PENDING', 'APPROVED', 'REJECTED']);

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
    const status = body?.status as string | undefined;

    if (!status || !ALLOWED_STATUSES.has(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const requestResult = await db.query(
      `UPDATE "PremiumRequest" SET status = $1, "updatedAt" = NOW()
       WHERE id = $2
       RETURNING id, "userId", status`,
      [status, params.id]
    );

    const updatedRequest = requestResult.rows[0];
    if (!updatedRequest) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    if (status === 'APPROVED') {
      await db.query(
        'UPDATE "User" SET plan = $1, "updatedAt" = NOW() WHERE id = $2',
        ['PREMIUM', updatedRequest.userId]
      );
    }

    return NextResponse.json({ request: updatedRequest }, { status: 200 });
  } catch (error) {
    console.error('Admin update premium request error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
