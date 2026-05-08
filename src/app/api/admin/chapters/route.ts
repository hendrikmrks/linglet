import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { cookies } from 'next/headers';

async function getAuthUser() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('sessionToken')?.value;
  
  if (!sessionToken) {
    return null;
  }

  const session = await prisma.session.findUnique({
    where: { sessionToken },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date()) {
    return null;
  }

  return session.user;
}

// GET all chapters
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser();
    
    if (!user || !(user as any).isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language');

    const chapters = await prisma.chapter.findMany({
      where: language ? { language } : undefined,
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

    return NextResponse.json({ chapters });
  } catch (error) {
    console.error('Failed to fetch chapters:', error);
    return NextResponse.json({ error: 'Failed to fetch chapters' }, { status: 500 });
  }
}

// POST create new chapter
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser();
    
    if (!user || !(user as any).isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { title, description, language, sourceLanguage, targetLanguage, isFeatured, isLocked, unlocksAt, insertAfterChapterId, order } = body;

    if (!title || !language) {
      return NextResponse.json({ error: 'Title and language are required' }, { status: 400 });
    }

    // If order not provided, get max order + 1 or insert after specified chapter
    let chapterOrder = order;
    if (chapterOrder === undefined || chapterOrder === null) {
      if (insertAfterChapterId) {
        const afterChapter = await prisma.chapter.findUnique({
          where: { id: insertAfterChapterId },
          select: { order: true },
        });
        if (afterChapter) {
          chapterOrder = afterChapter.order + 1;
        } else {
          const maxOrder = await prisma.chapter.findFirst({
            where: { language },
            orderBy: { order: 'desc' },
            select: { order: true },
          });
          chapterOrder = (maxOrder?.order || 0) + 1;
        }
      } else {
        const maxOrder = await prisma.chapter.findFirst({
          where: { language },
          orderBy: { order: 'desc' },
          select: { order: true },
        });
        chapterOrder = (maxOrder?.order || 0) + 1;
      }
    }

    const chapter = await prisma.chapter.create({
      data: {
        title,
        description,
        language,
        sourceLanguage: sourceLanguage || 'de',
        targetLanguage: targetLanguage || language,
        isFeatured: isFeatured || false,
        isLocked: isLocked || false,
        unlocksAt: unlocksAt || null,
        order: chapterOrder,
      },
      include: {
        subchapters: true,
      },
    });

    return NextResponse.json({ chapter }, { status: 201 });
  } catch (error: any) {
    console.error('Failed to create chapter:', error);
    
    // Check for unique constraint violation
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'A chapter with this order already exists for this language' }, { status: 409 });
    }
    
    return NextResponse.json({ error: 'Failed to create chapter' }, { status: 500 });
  }
}
