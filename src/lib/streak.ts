import { db } from './db';

const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

function getUtcDayNumber(date: Date) {
  return Math.floor(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) / MILLISECONDS_PER_DAY);
}

export function calculateStreakUpdate(currentStreak: number, lastUpdatedAt: Date | null, now = new Date()) {
  const safeCurrentStreak = Number.isFinite(currentStreak) ? Math.max(0, Math.trunc(currentStreak)) : 0;

  if (safeCurrentStreak === 0 || !lastUpdatedAt) {
    return {
      shouldUpdate: true,
      nextStreakCount: 1,
    };
  }

  const dayDifference = getUtcDayNumber(now) - getUtcDayNumber(lastUpdatedAt);

  if (dayDifference <= 0) {
    return {
      shouldUpdate: false,
      nextStreakCount: safeCurrentStreak,
    };
  }

  if (dayDifference === 1) {
    return {
      shouldUpdate: true,
      nextStreakCount: safeCurrentStreak + 1,
    };
  }

  return {
    shouldUpdate: true,
    nextStreakCount: 1,
  };
}

export async function updateStreak(userId: string, now = new Date()) {
  const client = await db.connect();

  try {
    await client.query('BEGIN');

    const userResult = await client.query(
      'SELECT "streakCount", "streakUpdatedAt" FROM "User" WHERE id = $1 FOR UPDATE',
      [userId]
    );

    if (userResult.rows.length === 0) {
      throw new Error(`User not found: ${userId}`);
    }

    const currentStreak = Number(userResult.rows[0]?.streakCount || 0);
    const lastUpdatedAt = userResult.rows[0]?.streakUpdatedAt
      ? new Date(userResult.rows[0].streakUpdatedAt)
      : null;

    const { shouldUpdate, nextStreakCount } = calculateStreakUpdate(currentStreak, lastUpdatedAt, now);

    if (!shouldUpdate) {
      await client.query('COMMIT');
      return {
        streakCount: currentStreak,
        streakUpdatedAt: lastUpdatedAt,
        updated: false,
      };
    }

    const updateResult = await client.query(
      `UPDATE "User"
       SET "streakCount" = $1,
           "streakUpdatedAt" = $2,
           "updatedAt" = NOW()
       WHERE id = $3
       RETURNING "streakCount", "streakUpdatedAt"`,
      [nextStreakCount, now.toISOString(), userId]
    );

    await client.query('COMMIT');

    return {
      streakCount: Number(updateResult.rows[0]?.streakCount || nextStreakCount),
      streakUpdatedAt: updateResult.rows[0]?.streakUpdatedAt
        ? new Date(updateResult.rows[0].streakUpdatedAt)
        : now,
      updated: true,
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
