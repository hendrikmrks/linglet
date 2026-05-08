import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

const ALLOWED_STATUSES = new Set(['RESOLVED']);

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession(request);

    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    if (!session.user.isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json().catch(() => ({}));
    const status = (body?.status as string | undefined) || 'RESOLVED';

    if (!ALLOWED_STATUSES.has(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const result = await db.query(
      `UPDATE "VocabularyReport" SET status = $1, "updatedAt" = NOW()
       WHERE id = $2
       RETURNING id`,
      [status, params.id]
    );

    const updated = result.rows[0];
    if (!updated) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    return NextResponse.json({ report: updated }, { status: 200 });
  } catch (error) {
    console.error('Admin update vocabulary report error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
