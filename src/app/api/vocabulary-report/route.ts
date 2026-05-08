import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

const ALLOWED_ISSUE_TYPES = new Set(['WORD', 'TRANSLATION']);

export async function POST(request: NextRequest) {
  try {
    const session = await getSession(request);

    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const vocabularyId = body?.vocabularyId as string | undefined;
    const issueType = body?.issueType as string | undefined;
    const reason = body?.reason as string | undefined;
    const comment = body?.comment as string | undefined;

    if (!vocabularyId || !issueType || !reason) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!ALLOWED_ISSUE_TYPES.has(issueType)) {
      return NextResponse.json({ error: 'Invalid issue type' }, { status: 400 });
    }

    const vocabResult = await db.query(
      `SELECT v.id as "vocabularyId", v.word, v.translation,
              s.id as "subchapterId",
              c.id as "chapterId", c."sourceLanguage", c."targetLanguage"
       FROM "Vocabulary" v
       JOIN "Subchapter" s ON s.id = v."subchapterId"
       JOIN "Chapter" c ON c.id = s."chapterId"
       WHERE v.id = $1`,
      [vocabularyId]
    );

    const vocab = vocabResult.rows[0];

    if (!vocab) {
      return NextResponse.json({ error: 'Vocabulary not found' }, { status: 404 });
    }

    const insertResult = await db.query(
      `INSERT INTO "VocabularyReport" (
         id, "userId", "vocabularyId", "chapterId", "subchapterId",
         "issueType", reason, comment, word, translation, "sourceLanguage", "targetLanguage",
         status, "createdAt", "updatedAt"
       ) VALUES (
         gen_random_uuid()::text, $1, $2, $3, $4,
         $5, $6, $7, $8, $9, $10, $11,
         'OPEN', NOW(), NOW()
       )
       RETURNING id`,
      [
        session.user.id,
        vocab.vocabularyId,
        vocab.chapterId,
        vocab.subchapterId,
        issueType,
        reason,
        comment || null,
        vocab.word,
        vocab.translation,
        vocab.sourceLanguage,
        vocab.targetLanguage,
      ]
    );

    return NextResponse.json({ reportId: insertResult.rows[0]?.id }, { status: 201 });
  } catch (error) {
    console.error('Vocabulary report error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
