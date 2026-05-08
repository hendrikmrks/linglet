import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET available shop items for users
export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);

    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get all active shop items with purchase status
    const result = await db.query(
      `SELECT s.*, 
              CASE WHEN p.id IS NOT NULL THEN true ELSE false END as "isPurchased"
       FROM "ShopItem" s
       LEFT JOIN "UserPurchase" p ON s.id = p."shopItemId" AND p."userId" = $1
       WHERE s."isActive" = true
       ORDER BY s.type ASC, s.price ASC`,
      [session.user.id]
    );

    // Get user's XP
    const userResult = await db.query(
      `SELECT xp FROM "User" WHERE id = $1`,
      [session.user.id]
    );

    const itemsWithStatus = result.rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      type: row.type,
      price: row.price,
      icon: row.icon,
      isActive: row.isActive,
      metadata: row.metadata ? JSON.parse(row.metadata) : null,
      isPurchased: row.isPurchased,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    }));

    return NextResponse.json({ 
      items: itemsWithStatus,
      userXP: userResult.rows[0]?.xp || 0
    }, { status: 200 });
  } catch (error) {
    console.error('Get shop items error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
