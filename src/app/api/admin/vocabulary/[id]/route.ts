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

// PATCH update vocabulary
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
    const { word, translation, example, translatedExample, order, subchapterId } = body;

    const updateData: any = {};
    if (word !== undefined) updateData.word = word;
    if (translation !== undefined) updateData.translation = translation;
    if (example !== undefined) updateData.example = example;
    if (translatedExample !== undefined) updateData.translatedExample = translatedExample;
    if (order !== undefined) updateData.order = order;
    if (subchapterId !== undefined) updateData.subchapterId = subchapterId;

    const vocabulary = await prisma.vocabulary.update({
      where: { id },
      data: updateData,
      include: {
        subchapter: {
          include: {
            chapter: true,
          },
        },
      },
    });

    return NextResponse.json({ vocabulary });
  } catch (error: any) {
    console.error('Failed to update vocabulary:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Vocabulary not found' }, { status: 404 });
    }
    
    return NextResponse.json({ error: 'Failed to update vocabulary' }, { status: 500 });
  }
}

// DELETE vocabulary
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

    await prisma.vocabulary.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Failed to delete vocabulary:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Vocabulary not found' }, { status: 404 });
    }
    
    return NextResponse.json({ error: 'Failed to delete vocabulary' }, { status: 500 });
  }
}
