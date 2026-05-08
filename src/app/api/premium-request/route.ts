import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);

    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Check if user has a pending premium request
    const existingRequest = await db.query(
      'SELECT id, status FROM "PremiumRequest" WHERE "userId" = $1 AND status IN ($2, $3)',
      [session.user.id, 'PENDING', 'APPROVED']
    );

    return NextResponse.json(
      { hasPendingRequest: existingRequest.rows.length > 0 },
      { status: 200 }
    );
  } catch (error) {
    console.error('Premium request check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession(request);

    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Check if user already has a pending premium request
    const existingRequest = await db.query(
      'SELECT id FROM "PremiumRequest" WHERE "userId" = $1 AND status = $2',
      [session.user.id, 'PENDING']
    );

    if (existingRequest.rows.length > 0) {
      return NextResponse.json(
        { error: 'You already have a pending premium request' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { reason, message } = body;

    // Insert premium request into database
    const query = `
      INSERT INTO "PremiumRequest" (id, "userId", reason, message, status, "createdAt", "updatedAt")
      VALUES (gen_random_uuid()::text, $1, $2, $3, 'PENDING', NOW(), NOW())
      RETURNING *
    `;

    const result = await db.query(query, [session.user.id, reason || null, message || null]);

    return NextResponse.json(
      {
        message: 'Premium request submitted successfully',
        data: result.rows[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Premium request error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
