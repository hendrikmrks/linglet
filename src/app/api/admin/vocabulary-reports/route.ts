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
      `SELECT r.id, r."userId", r."vocabularyId", r."chapterId", r."subchapterId",
              r."issueType", r.reason, r.comment, r.word, r.translation,
              r."sourceLanguage", r."targetLanguage", r.status, r."createdAt",
              u.email, u.name,
              c.title as "chapterTitle",
              s.title as "subchapterTitle"
       FROM "VocabularyReport" r
       JOIN "User" u ON u.id = r."userId"
       JOIN "Chapter" c ON c.id = r."chapterId"
       JOIN "Subchapter" s ON s.id = r."subchapterId"
       WHERE r.status = 'OPEN'
       ORDER BY r."createdAt" DESC`
    );

    return NextResponse.json({ reports: result.rows }, { status: 200 });
  } catch (error) {
    console.error('Admin vocabulary reports error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
