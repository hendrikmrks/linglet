import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db, prisma } from '@/lib/db';
import { updateProfileSchema } from '@/lib/validators';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);

    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const response: Record<string, unknown> = { ...session.user };

    // For free users, compute missed XP this week as a premium nudge
    if (session.user.plan === 'FREE') {
      try {
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - ((weekStart.getDay() + 6) % 7));
        weekStart.setHours(0, 0, 0, 0);

        const result = await db.query(
          `SELECT COUNT(*)::int AS count FROM "UserSubchapterProgress"
           WHERE "userId" = $1 AND status = 'COMPLETED' AND "completedAt" >= $2`,
          [session.user.id, weekStart.toISOString()]
        );
        const lessonsThisWeek = result.rows[0]?.count || 0;
        // avgXP ≈ 20 (between MIN 10 and MAX 30), missed bonus = 50% of that
        response.missedXpThisWeek = Math.round(lessonsThisWeek * 20 * 0.5);
      } catch {
        response.missedXpThisWeek = 0;
      }
    }

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession(request);

    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate input
    const validation = updateProfileSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', issues: validation.error.issues },
        { status: 400 }
      );
    }

    const { name, avatarUrl, learningLanguage, showFullName } = validation.data;
    const requestedLearningLanguage = learningLanguage || session.user.learningLanguage || 'en';
    const currentLearningLanguage = session.user.learningLanguage || 'en';
    const isLearningLanguageChanged = requestedLearningLanguage !== currentLearningLanguage;

    // Update user
    if (isLearningLanguageChanged) {
      await db.query(
        'UPDATE "UserLevelProgress" SET status = $1, "updatedAt" = NOW() WHERE "userId" = $2',
        ['LOCKED', session.user.id]
      );

      const firstLevelResult = await db.query(
        'SELECT id FROM "LearningLevel" ORDER BY "orderIndex" ASC LIMIT 1'
      );
      const firstLevelId = firstLevelResult.rows[0]?.id;

      if (firstLevelId) {
        await db.query(
          `INSERT INTO "UserLevelProgress" (id, "userId", "levelId", status, "createdAt", "updatedAt")
           VALUES ($1, $2, $3, 'CURRENT', NOW(), NOW())
           ON CONFLICT ("userId", "levelId")
           DO UPDATE SET status = 'CURRENT', "updatedAt" = NOW()`,
          [`${session.user.id}-${firstLevelId}`, session.user.id, firstLevelId]
        );
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        avatarUrl: avatarUrl || null,
        learningLanguage: requestedLearningLanguage,
        showFullName: showFullName !== undefined ? showFullName : undefined,
        xp: isLearningLanguageChanged ? 0 : session.user.xp,
      },
    });

    const { passwordHash, ...userWithoutPassword } = updatedUser;

    return NextResponse.json(userWithoutPassword, { status: 200 });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
