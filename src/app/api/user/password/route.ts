import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { changePasswordSchema } from '@/lib/validators';
import * as bcryptjs from 'bcryptjs';

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
    const validation = changePasswordSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', issues: validation.error.issues },
        { status: 400 }
      );
    }

    const { currentPassword, newPassword } = validation.data;

    // Fetch user with password hash
    const userResult = await db.query(
      'SELECT "passwordHash" FROM "User" WHERE id = $1',
      [session.user.id]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const currentPasswordHash = userResult.rows[0].passwordHash;

    // Verify current password
    const passwordMatch = await bcryptjs.compare(
      currentPassword,
      currentPasswordHash
    );

    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 401 }
      );
    }

    // Hash new password
    const newPasswordHash = await bcryptjs.hash(newPassword, 10);

    // Update password using raw SQL to avoid issues with custom prisma wrapper
    await db.query(
      'UPDATE "User" SET "passwordHash" = $1, "updatedAt" = NOW() WHERE id = $2',
      [newPasswordHash, session.user.id]
    );

    return NextResponse.json(
      { message: 'Password changed successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
