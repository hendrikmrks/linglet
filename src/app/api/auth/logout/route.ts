import { NextRequest, NextResponse } from 'next/server';
import { deleteSession, clearSessionCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('sessionToken')?.value;

    if (sessionToken) {
      await deleteSession(sessionToken);
    }

    await clearSessionCookie();

    return NextResponse.json(
      { message: 'Logged out successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
