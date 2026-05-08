import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { db } from './db';

const SESSION_COOKIE_NAME = 'sessionToken';
const SESSION_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

/**
 * Generate a session token using Web Crypto API (Edge runtime compatible)
 */
function generateSessionToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Generate a cuid-like ID
 */
function generateId(): string {
  const timestamp = Date.now().toString(36);
  const randomPart = generateSessionToken().substring(0, 16);
  return `c${timestamp}${randomPart}`;
}

/**
 * Create a new session for a user
 */
export async function createSession(userId: string) {
  const id = generateId();
  const sessionToken = generateSessionToken();
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE * 1000);

  const result = await db.query(
    `INSERT INTO "Session" ("id", "sessionToken", "userId", "expiresAt", "createdAt", "updatedAt")
     VALUES ($1, $2, $3, $4, NOW(), NOW())
     RETURNING *`,
    [id, sessionToken, userId, expiresAt]
  );

  const session = result.rows[0];

  // Set httpOnly cookie
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });

  return session;
}

/**
 * Get session from request
 */
export async function getSession(req: NextRequest) {
  const sessionToken = req.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionToken) {
    return null;
  }

  const result = await db.query(
    `SELECT s."sessionToken", s."userId", s."expiresAt", s."createdAt", s."updatedAt",
            u.id as "user_id", u.email, u.name, u."firstName", u."showFullName", u.plan, u."isAdmin", u.xp, u."streakCount", u."learningLanguage", u.language, u."onboardingComplete"
     FROM "Session" s
     JOIN "User" u ON s."userId" = u.id
     WHERE s."sessionToken" = $1`,
    [sessionToken]
  );

  if (result.rows.length === 0) {
    return null;
  }

  const row = result.rows[0];
  const expiresAt = new Date(row.expiresAt);

  if (expiresAt < new Date()) {
    await db.query('DELETE FROM "Session" WHERE "sessionToken" = $1', [sessionToken]);
    return null;
  }

  return {
    sessionToken: row.sessionToken,
    userId: row.userId,
    expiresAt: row.expiresAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    user: {
      id: row.user_id,
      email: row.email,
      name: row.name,
      firstName: row.firstName,
      showFullName: row.showFullName,
      plan: row.plan,
      isAdmin: row.isAdmin,
      xp: row.xp,
      streakCount: row.streakCount,
      learningLanguage: row.learningLanguage,
      language: row.language,
      onboardingComplete: row.onboardingComplete
    }
  };
}

/**
 * Get current user from request
 */
export async function getCurrentUser(req: NextRequest) {
  const session = await getSession(req);
  return session?.user || null;
}

/**
 * Delete session
 */
export async function deleteSession(sessionToken: string) {
  try {
    await db.query(
      'DELETE FROM "Session" WHERE "sessionToken" = $1',
      [sessionToken]
    );
  } catch (error) {
    // Session might not exist
  }
}

/**
 * Require authentication
 */
export function requireAuth(user: any) {
  if (!user) {
    throw new Response('Unauthorized', { status: 401 });
  }
  return user;
}

/**
 * Clear session cookie
 */
export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
