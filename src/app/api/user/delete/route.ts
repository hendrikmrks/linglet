import { cookies } from 'next/headers';
import { db } from '@/lib/db';

export async function DELETE(_request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('sessionToken')?.value;

    if (!sessionToken) {
      return Response.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Find session
    const sessionResult = await db.query('SELECT * FROM "Session" WHERE "sessionToken" = $1', [sessionToken]);
    const session = sessionResult.rows[0];

    if (!session) {
      return Response.json({ error: 'Invalid session' }, { status: 401 });
    }

    // Delete user data (sessions, premium requests, then user)
    await db.query('DELETE FROM "Session" WHERE "userId" = $1', [session.userId]);
    await db.query('DELETE FROM "PremiumRequest" WHERE "userId" = $1', [session.userId]);
    await db.query('DELETE FROM "User" WHERE id = $1', [session.userId]);

    // Clear session cookie
    cookieStore.delete('sessionToken');

    return Response.json({ success: true });
  } catch (error) {
    console.error('Delete account error:', error);
    return Response.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    );
  }
}
