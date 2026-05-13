import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';

async function getAuthUser() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('sessionToken')?.value;
  
  if (!sessionToken) {
    return null;
  }

  const sessionResult = await db.query(
    'SELECT s.*, u.* FROM "Session" s JOIN "User" u ON s."userId" = u.id WHERE s."sessionToken" = $1 AND s."expiresAt" > NOW()',
    [sessionToken]
  );

  if (sessionResult.rows.length === 0) {
    return null;
  }

  return sessionResult.rows[0];
}

// GET all vocabulary (optionally filtered by subchapterId)
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser();
    
    if (!user || !(user as any).isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const subchapterId = searchParams.get('subchapterId');

    let query: string;
    let params: any[];
    if (subchapterId) {
      query = `
        SELECT v.*, 
               s.id as "subchapter_id", s.title as "subchapter_title", 
               c.id as "chapter_id", c.title as "chapter_title"
        FROM "Vocabulary" v
        JOIN "Subchapter" s ON v."subchapterId" = s.id
        JOIN "Chapter" c ON s."chapterId" = c.id
        WHERE v."subchapterId" = $1
        ORDER BY v.order ASC
      `;
      params = [subchapterId];
    } else {
      query = `
        SELECT v.*, 
               s.id as "subchapter_id", s.title as "subchapter_title",
               c.id as "chapter_id", c.title as "chapter_title"
        FROM "Vocabulary" v
        JOIN "Subchapter" s ON v."subchapterId" = s.id
        JOIN "Chapter" c ON s."chapterId" = c.id
        ORDER BY v.order ASC
      `;
      params = [];
    }

    const result = await db.query(query, params);
    
    // Transform to match expected structure
    const vocabulary = result.rows.map((row: any) => ({
      id: row.id,
      subchapterId: row.subchapterId,
      word: row.word,
      translation: row.translation,
      example: row.example,
      translatedExample: row.translatedExample,
      alternativeAnswers: row.alternativeAnswers ?? [],
      order: row.order,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      subchapter: {
        id: row.subchapter_id,
        title: row.subchapter_title,
        chapter: {
          id: row.chapter_id,
          title: row.chapter_title
        }
      }
    }));

    return NextResponse.json({ vocabulary });
  } catch (error) {
    console.error('Failed to fetch vocabulary:', error);
    return NextResponse.json({ error: 'Failed to fetch vocabulary' }, { status: 500 });
  }
}

// POST create new vocabulary
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser();
    
    if (!user || !(user as any).isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { subchapterId, word, translation, example, translatedExample, order } = body;
    const alternativeAnswers = Array.isArray(body.alternativeAnswers)
      ? body.alternativeAnswers
          .filter((answer: unknown): answer is string => typeof answer === 'string')
          .map((answer: string) => answer.trim())
          .filter(Boolean)
      : [];

    if (!subchapterId || !word || !translation) {
      return NextResponse.json({ error: 'SubchapterId, word, and translation are required' }, { status: 400 });
    }

    // Check if subchapter exists
    const subchapterResult = await db.query(
      'SELECT * FROM "Subchapter" WHERE id = $1',
      [subchapterId]
    );

    if (subchapterResult.rows.length === 0) {
      return NextResponse.json({ error: 'Subchapter not found' }, { status: 404 });
    }

    // If order not provided, get max order + 1
    let vocabOrder = order;
    if (vocabOrder === undefined || vocabOrder === null) {
      const maxOrderResult = await db.query(
        'SELECT MAX(order) as max_order FROM "Vocabulary" WHERE "subchapterId" = $1',
        [subchapterId]
      );
      vocabOrder = (maxOrderResult.rows[0]?.max_order || 0) + 1;
    }

    const insertResult = await db.query(
      `INSERT INTO "Vocabulary" ("subchapterId", word, translation, example, "translatedExample", "alternativeAnswers", "order", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
       RETURNING *`,
      [subchapterId, word, translation, example, translatedExample, alternativeAnswers, vocabOrder]
    );

    const vocabulary = insertResult.rows[0];

    // Fetch related data
    const fullResult = await db.query(
      `SELECT v.*, 
              s.id as "subchapter_id", s.title as "subchapter_title",
              c.id as "chapter_id", c.title as "chapter_title"
       FROM "Vocabulary" v
       JOIN "Subchapter" s ON v."subchapterId" = s.id
       JOIN "Chapter" c ON s."chapterId" = c.id
       WHERE v.id = $1`,
      [vocabulary.id]
    );

    const row = fullResult.rows[0];
    const result = {
      id: row.id,
      subchapterId: row.subchapterId,
      word: row.word,
      translation: row.translation,
      example: row.example,
      translatedExample: row.translatedExample,
      alternativeAnswers: row.alternativeAnswers ?? [],
      order: row.order,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      subchapter: {
        id: row.subchapter_id,
        title: row.subchapter_title,
        chapter: {
          id: row.chapter_id,
          title: row.chapter_title
        }
      }
    };

    return NextResponse.json({ vocabulary: result }, { status: 201 });
  } catch (error: any) {
    console.error('Failed to create vocabulary:', error);
    return NextResponse.json({ error: 'Failed to create vocabulary' }, { status: 500 });
  }
}
