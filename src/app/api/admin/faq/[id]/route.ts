import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { mapFaqRow, validateUpdateFaqInput } from '@/lib/faq';

export const dynamic = 'force-dynamic';

async function ensureAdmin(request: NextRequest) {
  const session = await getSession(request);

  if (!session?.user?.isAdmin) {
    return null;
  }

  return session;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await ensureAdmin(request);

    if (!session) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const parsed = validateUpdateFaqInput(body);

    if ('error' in parsed) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const faqUpdate = parsed.value;
    const updates: string[] = [];
    const values: Array<string | number | boolean> = [];
    let paramIndex = 1;

    if (faqUpdate.question !== undefined) {
      updates.push(`question = $${paramIndex++}`);
      values.push(faqUpdate.question);
    }

    if (faqUpdate.answer !== undefined) {
      updates.push(`answer = $${paramIndex++}`);
      values.push(faqUpdate.answer);
    }

    if (faqUpdate.order !== undefined) {
      updates.push(`"order" = $${paramIndex++}`);
      values.push(faqUpdate.order);
    }

    if (faqUpdate.language !== undefined) {
      updates.push(`language = $${paramIndex++}`);
      values.push(faqUpdate.language);
    }

    if (faqUpdate.isActive !== undefined) {
      updates.push(`"isActive" = $${paramIndex++}`);
      values.push(faqUpdate.isActive);
    }

    updates.push(`"updatedAt" = NOW()`);
    values.push(params.id);

    const result = await db.query(
      `UPDATE "Faq"
       SET ${updates.join(', ')}
       WHERE id = $${paramIndex}
       RETURNING id, question, answer, "order", language, "isActive", "createdAt", "updatedAt"`,
      values
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'FAQ not found' }, { status: 404 });
    }

    return NextResponse.json({ faq: mapFaqRow(result.rows[0]) }, { status: 200 });
  } catch (error) {
    console.error('Admin FAQ update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await ensureAdmin(request);

    if (!session) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const result = await db.query(
      `DELETE FROM "Faq" WHERE id = $1 RETURNING id`,
      [params.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'FAQ not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Admin FAQ delete error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
