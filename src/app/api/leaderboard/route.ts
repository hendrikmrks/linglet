import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { ensurePremiumSettings } from '@/lib/premium-settings';

export const dynamic = 'force-dynamic';

const LIMIT = 10;

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);

    // Estimated rank mode: accessible to all authenticated users (no premium check)
    if (searchParams.get('mode') === 'estimated-rank') {
      const userXp = user.xp ?? 0;

      const [rankResult, totalResult, nearbyResult] = await Promise.all([
        db.query(
          `SELECT COUNT(*)::int AS count FROM "User"
           WHERE xp > $1 AND "isAdmin" IS NOT TRUE AND "isTestUser" IS NOT TRUE`,
          [userXp]
        ),
        db.query(
          `SELECT COUNT(*)::int AS count FROM "User"
           WHERE "isAdmin" IS NOT TRUE AND "isTestUser" IS NOT TRUE`
        ),
        db.query(
          `SELECT xp FROM "User"
           WHERE xp > $1 AND "isAdmin" IS NOT TRUE AND "isTestUser" IS NOT TRUE
           ORDER BY xp ASC LIMIT 1`,
          [userXp]
        ),
      ]);

      return NextResponse.json({
        estimatedRank: (rankResult.rows[0]?.count || 0) + 1,
        totalUsers: totalResult.rows[0]?.count || 1,
        nearbyXp: nearbyResult.rows[0]?.xp ?? null,
        userXp,
      });
    }

    const isPremium = user.plan === 'PREMIUM';
    const settings = await ensurePremiumSettings();

    // Check leaderboard access based on premium settings
    const canSee = isPremium ? settings.canSeeLeaderboardPremium : settings.canSeeLeaderboardFree;
    if (!canSee) {
      return NextResponse.json({ error: 'Premium required' }, { status: 403 });
    }

    // Get top 10 users with their equipped badges
    const result = await db.query(
      `SELECT u.id, u.name, u."firstName", u."showFullName", u.xp, u."streakCount",
              COALESCE(
                json_agg(
                  json_build_object('icon', si.icon, 'name', si.name)
                ) FILTER (WHERE si.id IS NOT NULL),
                '[]'::json
              ) as badges
       FROM "User" u
       LEFT JOIN "UserPurchase" up ON u.id = up."userId" AND up.equipped = true
       LEFT JOIN "ShopItem" si ON up."shopItemId" = si.id AND si.type = 'BADGE'
       WHERE u."isAdmin" IS NOT TRUE AND u."isTestUser" IS NOT TRUE
       GROUP BY u.id
       ORDER BY u.xp DESC, u."streakCount" DESC, u."updatedAt" DESC
       LIMIT $1`,
      [LIMIT]
    );

    // Map entries with display name logic
    const entries = result.rows.map((row: any) => ({
      id: row.id,
      name: row.showFullName ? row.name : (row.firstName || row.name.split(' ')[0]),
      xp: row.xp,
      streakCount: row.streakCount,
      badges: row.badges || [],
    }));

    return NextResponse.json({ entries }, { status: 200 });
  } catch (error) {
    console.error('Leaderboard error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
