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

// PATCH update subchapter
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser();
    
    if (!user || !(user as any).isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { title, description, order, chapterId, isLocked, unlocksAt } = body;

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (order !== undefined) updateData.order = order;
    if (chapterId !== undefined) updateData.chapterId = chapterId;
    if (isLocked !== undefined) updateData.isLocked = isLocked;
    if (unlocksAt !== undefined) updateData.unlocksAt = unlocksAt;

    const subchapter = await prisma.subchapter.update({
      where: { id },
      data: updateData,
      include: {
        chapter: true,
        vocabulary: {
          orderBy: { order: 'asc' },
        },
      },
    });

    return NextResponse.json({ subchapter });
  } catch (error: any) {
    console.error('Failed to update subchapter:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Subchapter not found' }, { status: 404 });
    }
    
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'A subchapter with this order already exists for this chapter' }, { status: 409 });
    }
    
    return NextResponse.json({ error: 'Failed to update subchapter' }, { status: 500 });
  }
}

// DELETE subchapter
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser();
    
    if (!user || !(user as any).isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await params;

    await prisma.subchapter.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Failed to delete subchapter:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Subchapter not found' }, { status: 404 });
    }
    
    return NextResponse.json({ error: 'Failed to delete subchapter' }, { status: 500 });
  }
}
