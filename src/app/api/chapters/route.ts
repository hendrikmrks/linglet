import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { ensurePremiumSettings } from '@/lib/premium-settings';

export const dynamic = 'force-dynamic';

function normalizeLanguageCode(value: string | null | undefined): string {
  const normalized = (value || '').trim().toLowerCase();
  if (normalized === 'pt') {
    return 'pt-br';
  }
  return normalized;
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);

    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const includeComingSoon = searchParams.get('includeComingSoon') === 'true';
    const now = new Date();

    // IMPORTANT: learningLanguage from query param takes priority
    let learningLanguage = normalizeLanguageCode(searchParams.get('learningLanguage'));
    
    // If no query param, use user's learningLanguage
    if (!learningLanguage) {
      learningLanguage = normalizeLanguageCode(session.user.learningLanguage || session.user.language || 'en');
    }

    // sourceLanguage = user's interface/native language
    let sourceLanguage = normalizeLanguageCode(searchParams.get('sourceLanguage') || session.user.language || 'de');

    // Filter by both targetLanguage AND sourceLanguage to only show
    // chapters relevant to the user's language pair (e.g. de -> en)

    let chapters = await prisma.chapter.findMany({
      where: {
        targetLanguage: learningLanguage,
        sourceLanguage: sourceLanguage,
      },
      include: {
        subchapters: {
          orderBy: { order: 'asc' },
          include: {
            vocabulary: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
      orderBy: { order: 'asc' },
    });
    
    // Fallback for seeded language pairs (DE↔PT) when UI language is not matching source language
    if (chapters.length === 0) {
      if (learningLanguage === 'pt-br') {
        sourceLanguage = 'de';
      } else if (learningLanguage === 'de') {
        sourceLanguage = 'pt-br';
      }

      chapters = await prisma.chapter.findMany({
        where: {
          targetLanguage: learningLanguage,
          sourceLanguage: sourceLanguage,
        },
        include: {
          subchapters: {
            orderBy: { order: 'asc' },
            include: {
              vocabulary: {
                orderBy: { order: 'asc' },
              },
            },
          },
        },
        orderBy: { order: 'asc' },
      });
    }

    // DEFENSIVE: Double-check filtering on result
    chapters = chapters.filter(ch => {
      const chTarget = (ch as any).targetLanguage;
      const chSource = (ch as any).sourceLanguage;
      return chTarget === learningLanguage && chSource === sourceLanguage;
    });

    // Filter and mark chapters based on lock status
    const processedChapters = chapters.map((chapter: any) => {
      const isLocked = chapter.isLocked || false;
      const unlocksAt = chapter.unlocksAt ? new Date(chapter.unlocksAt) : null;
      
      // Check if chapter should be unlocked
      let isAvailable = !isLocked;
      if (isLocked && unlocksAt && now >= unlocksAt) {
        isAvailable = true;
      }

      return {
        ...chapter,
        isLocked,
        unlocksAt: unlocksAt?.toISOString() || null,
        isAvailable,
        // Filter subchapters based on availability
        subchapters: chapter.subchapters.map((sub: any) => {
          const subIsLocked = sub.isLocked || false;
          const subUnlocksAt = sub.unlocksAt ? new Date(sub.unlocksAt) : null;
          
          let subIsAvailable = !subIsLocked;
          if (subIsLocked && subUnlocksAt && now >= subUnlocksAt) {
            subIsAvailable = true;
          }

          return {
            ...sub,
            isLocked: subIsLocked,
            unlocksAt: subUnlocksAt?.toISOString() || null,
            isAvailable: subIsAvailable,
            // If subchapter is locked, don't return vocabulary
            vocabulary: subIsAvailable ? sub.vocabulary : [],
          };
        }),
      };
    });

    // Filter chapters based on availability
    let filteredChapters = processedChapters;
    if (!includeComingSoon) {
      filteredChapters = processedChapters.filter((ch: any) => ch.isAvailable);
    }

    await db.query(`
      CREATE TABLE IF NOT EXISTS "UserSubchapterProgress" (
        id TEXT PRIMARY KEY,
        "userId" TEXT NOT NULL,
        "subchapterId" TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'LOCKED' CHECK (status IN ('LOCKED', 'CURRENT', 'COMPLETED')),
        "bestScore" INT NOT NULL DEFAULT 0,
        attempts INT NOT NULL DEFAULT 0,
        "completedAt" TIMESTAMP NULL,
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW(),
        FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE,
        FOREIGN KEY ("subchapterId") REFERENCES "Subchapter"(id) ON DELETE CASCADE,
        UNIQUE ("userId", "subchapterId")
      )
    `);

    await db.query(`
      CREATE INDEX IF NOT EXISTS "UserSubchapterProgress_userId_idx"
      ON "UserSubchapterProgress"("userId")
    `);

    const subchapterIds = filteredChapters.flatMap((chapter: any) =>
      chapter.subchapters.map((sub: any) => sub.id)
    );

    const progressMap = new Map<string, string>();
    if (subchapterIds.length > 0) {
      const progressResult = await db.query(
        `SELECT "subchapterId", status
         FROM "UserSubchapterProgress"
         WHERE "userId" = $1 AND "subchapterId" = ANY($2::text[])`,
        [session.user.id, subchapterIds]
      );

      for (const row of progressResult.rows) {
        progressMap.set(row.subchapterId, row.status);
      }
    }

    filteredChapters = filteredChapters.map((chapter: any) => {
      const sortedSubchapters = [...chapter.subchapters].sort((a: any, b: any) => a.order - b.order);
      let currentAssigned = false;

      const subchaptersWithStatus = sortedSubchapters.map((subchapter: any) => {
        const persistedStatus = progressMap.get(subchapter.id);
        let status: 'LOCKED' | 'CURRENT' | 'COMPLETED' = 'LOCKED';

        if (!subchapter.isAvailable) {
          status = 'LOCKED';
        } else if (persistedStatus === 'COMPLETED') {
          status = 'COMPLETED';
        } else if (!currentAssigned) {
          status = 'CURRENT';
          currentAssigned = true;
        }

        return {
          ...subchapter,
          status,
        };
      });

      return {
        ...chapter,
        subchapters: subchaptersWithStatus,
      };
    });

    // Enforce premium chapter limits for free users
    const isPremium = session.user.plan === 'PREMIUM';
    const settings = await ensurePremiumSettings();
    const maxChaptersTotal = isPremium ? -1 : settings.maxChaptersTotalFree;

    if (maxChaptersTotal > 0 && filteredChapters.length > maxChaptersTotal) {
      filteredChapters = filteredChapters.map((chapter: any, index: number) => {
        if (index >= maxChaptersTotal) {
          return {
            ...chapter,
            isLocked: true,
            isAvailable: false,
            premiumLocked: true,
            subchapters: chapter.subchapters.map((sub: any) => ({
              ...sub,
              status: 'LOCKED',
              vocabulary: [],
            })),
          };
        }
        return chapter;
      });
    }

    return NextResponse.json({
      chapters: filteredChapters,
      language: learningLanguage,
    }, { status: 200 });
  } catch (error) {
    console.error('Chapters error:', error);
    return NextResponse.json({ error: 'Failed to fetch chapters' }, { status: 500 });
  }
}
