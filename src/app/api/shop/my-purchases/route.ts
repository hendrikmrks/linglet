import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET user's purchased items
export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);

    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const result = await db.query(
      `SELECT p.id, p."userId", p."shopItemId", p."purchasedAt", p.equipped,
              s.id as "shopItem_id", s.name as "shopItem_name", s.description as "shopItem_description",
              s.type as "shopItem_type", s.price as "shopItem_price", s.icon as "shopItem_icon",
              s."isActive" as "shopItem_isActive", s.metadata as "shopItem_metadata",
              s."createdAt" as "shopItem_createdAt", s."updatedAt" as "shopItem_updatedAt"
       FROM "UserPurchase" p
       JOIN "ShopItem" s ON p."shopItemId" = s.id
       WHERE p."userId" = $1
       ORDER BY p."purchasedAt" DESC`,
      [session.user.id]
    );

    // Parse metadata for each item
    const purchasesWithMetadata = result.rows.map((row: any) => ({
      id: row.id,
      userId: row.userId,
      shopItemId: row.shopItemId,
      purchasedAt: row.purchasedAt,
      equipped: row.equipped,
      shopItem: {
        id: row.shopItem_id,
        name: row.shopItem_name,
        description: row.shopItem_description,
        type: row.shopItem_type,
        price: row.shopItem_price,
        icon: row.shopItem_icon,
        isActive: row.shopItem_isActive,
        metadata: row.shopItem_metadata ? JSON.parse(row.shopItem_metadata) : null,
        createdAt: row.shopItem_createdAt,
        updatedAt: row.shopItem_updatedAt
      }
    }));

    return NextResponse.json({ purchases: purchasesWithMetadata }, { status: 200 });
  } catch (error) {
    console.error('Get purchases error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
