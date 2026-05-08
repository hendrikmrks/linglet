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

// GET all subchapters (optionally filtered by chapterId)
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser();
    
    if (!user || !(user as any).isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const chapterId = searchParams.get('chapterId');

    const subchapters = await prisma.subchapter.findMany({
      where: chapterId ? { chapterId } : undefined,
      include: {
        chapter: true,
        vocabulary: {
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json({ subchapters });
  } catch (error) {
    console.error('Failed to fetch subchapters:', error);
    return NextResponse.json({ error: 'Failed to fetch subchapters' }, { status: 500 });
  }
}

// POST create new subchapter
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser();
    
    if (!user || !(user as any).isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { chapterId, title, description, isLocked, unlocksAt, insertAfterSubchapterId, order } = body;

    if (!chapterId || !title) {
      return NextResponse.json({ error: 'ChapterId and title are required' }, { status: 400 });
    }

    // Check if chapter exists
    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
    });

    if (!chapter) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
    }

    // If order not provided, get max order + 1 or insert after specified subchapter
    let subchapterOrder = order;
    if (subchapterOrder === undefined || subchapterOrder === null) {
      if (insertAfterSubchapterId) {
        const afterSubchapter = await prisma.subchapter.findUnique({
          where: { id: insertAfterSubchapterId },
          select: { order: true },
        });
        if (afterSubchapter) {
          subchapterOrder = afterSubchapter.order + 1;
        } else {
          const maxOrder = await prisma.subchapter.findFirst({
            where: { chapterId },
            orderBy: { order: 'desc' },
            select: { order: true },
          });
          subchapterOrder = (maxOrder?.order || 0) + 1;
        }
      } else {
        const maxOrder = await prisma.subchapter.findFirst({
          where: { chapterId },
          orderBy: { order: 'desc' },
          select: { order: true },
        });
        subchapterOrder = (maxOrder?.order || 0) + 1;
      }
    }

    const subchapter = await prisma.subchapter.create({
      data: {
        chapterId,
        title,
        description,
        isLocked: isLocked || false,
        unlocksAt: unlocksAt || null,
        order: subchapterOrder,
      },
      include: {
        chapter: true,
        vocabulary: true,
      },
    });

    return NextResponse.json({ subchapter }, { status: 201 });
  } catch (error: any) {
    console.error('Failed to create subchapter:', error);
    
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'A subchapter with this order already exists for this chapter' }, { status: 409 });
    }
    
    return NextResponse.json({ error: 'Failed to create subchapter' }, { status: 500 });
  }
}
