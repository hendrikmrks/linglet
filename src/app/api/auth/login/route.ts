import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { loginSchema } from '@/lib/validators';
import * as bcryptjs from 'bcryptjs';
import { createSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', issues: validation.error.issues },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    // Find user
    const result = await db.query(
      'SELECT * FROM "User" WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const user = result.rows[0];

    // Verify password
    const passwordMatch = await bcryptjs.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create session
    await createSession(user.id);

    return NextResponse.json(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        plan: user.plan,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
