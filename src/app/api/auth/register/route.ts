import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { registerSchema } from '@/lib/validators';
import * as bcryptjs from 'bcryptjs';
import { createSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', issues: validation.error.issues },
        { status: 400 }
      );
    }

    const { email, password, firstName, lastName, birthDate, learningLanguage } = validation.data;

    // Check if user already exists
    const existingUserResult = await db.query(
      'SELECT * FROM "User" WHERE email = $1',
      [email]
    );

    if (existingUserResult.rows.length > 0) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await bcryptjs.hash(password, 10);

    // Determine source language based on learning language
    const sourceLanguage = learningLanguage === 'de' ? 'pt-br' : 'de';

    // Create user
    const userResult = await db.query(
      `INSERT INTO "User" (id, email, "passwordHash", name, "firstName", "lastName", "birthDate", language, "learningLanguage", "isAdmin", "createdAt", "updatedAt")
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, false, NOW(), NOW())
       RETURNING *`,
      [email, passwordHash, `${firstName} ${lastName}`.trim(), firstName, lastName, birthDate, sourceLanguage, learningLanguage]
    );

    const user = userResult.rows[0];

    // Initialize learning path progress at level 1.1
    const levelsResult = await db.query(
      'SELECT id FROM "LearningLevel" ORDER BY "orderIndex" ASC'
    );
    const levelIds = levelsResult.rows.map((row: { id: string }) => row.id);
    if (levelIds.length > 0) {
      for (const levelId of levelIds) {
        await db.query(
          `INSERT INTO "UserLevelProgress" (id, "userId", "levelId")
           VALUES ($1, $2, $3)
           ON CONFLICT ("userId", "levelId") DO NOTHING`,
          [`${user.id}-${levelId}`, user.id, levelId]
        );
      }

      await db.query(
        `UPDATE "UserLevelProgress" SET status = 'CURRENT', "updatedAt" = NOW()
         WHERE "userId" = $1 AND "levelId" = $2`,
        [user.id, levelIds[0]]
      );
    }

    // Create session and auto-login
    await createSession(user.id);

    return NextResponse.json(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        plan: user.plan,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
