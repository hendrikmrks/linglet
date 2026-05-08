import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { mapFaqRow, normalizeFaqLanguage } from '@/lib/faq';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const language = normalizeFaqLanguage(request.nextUrl.searchParams.get('language'));

    const result = await db.query(
      `SELECT id, question, answer, "order", language, "isActive", "createdAt", "updatedAt"
       FROM "Faq"
       WHERE "isActive" = true AND language = $1
       ORDER BY "order" ASC, "createdAt" ASC`,
      [language]
    );

    return NextResponse.json({ faqs: result.rows.map(mapFaqRow) }, { status: 200 });
  } catch (error) {
    console.error('Get FAQ error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
