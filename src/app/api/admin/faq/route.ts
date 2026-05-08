import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { mapFaqRow, validateCreateFaqInput } from '@/lib/faq';

export const dynamic = 'force-dynamic';

async function ensureAdmin(request: NextRequest) {
  const session = await getSession(request);

  if (!session?.user?.isAdmin) {
    return null;
  }

  return session;
}

export async function GET(request: NextRequest) {
  try {
    const session = await ensureAdmin(request);

    if (!session) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const result = await db.query(
      `SELECT id, question, answer, "order", language, "isActive", "createdAt", "updatedAt"
       FROM "Faq"
       ORDER BY language ASC, "order" ASC, "createdAt" ASC`
    );

    return NextResponse.json({ faqs: result.rows.map(mapFaqRow) }, { status: 200 });
  } catch (error) {
    console.error('Admin FAQ list error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await ensureAdmin(request);

    if (!session) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const parsed = validateCreateFaqInput(body);

    if ('error' in parsed) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const result = await db.query(
      `INSERT INTO "Faq" (id, question, answer, "order", language, "isActive", "createdAt", "updatedAt")
       VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, NOW(), NOW())
       RETURNING id, question, answer, "order", language, "isActive", "createdAt", "updatedAt"`,
      [
        parsed.value.question,
        parsed.value.answer,
        parsed.value.order,
        parsed.value.language,
        parsed.value.isActive,
      ]
    );

    return NextResponse.json({ faq: mapFaqRow(result.rows[0]) }, { status: 201 });
  } catch (error) {
    console.error('Admin FAQ create error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
