import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

// POST equip/unequip item
export async function POST(request: NextRequest) {
  try {
    const session = await getSession(request);

    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const { itemId, equipped } = body;

    if (!itemId || typeof equipped !== 'boolean') {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    }

    // Check if user owns this item and get shop item type
    const purchaseResult = await db.query(
      `SELECT p.*, s.type as "shopItemType"
       FROM "UserPurchase" p
       JOIN "ShopItem" s ON p."shopItemId" = s.id
       WHERE p."userId" = $1 AND p."shopItemId" = $2`,
      [session.user.id, itemId]
    );

    if (purchaseResult.rows.length === 0) {
      return NextResponse.json({ error: 'Item not purchased' }, { status: 404 });
    }

    const purchase = purchaseResult.rows[0];

    // If equipping, unequip other items of the same type
    if (equipped) {
      await db.query(
        `UPDATE "UserPurchase" p
         SET equipped = false
         FROM "ShopItem" s
         WHERE p."shopItemId" = s.id
           AND p."userId" = $1
           AND s.type = $2
           AND p.equipped = true`,
        [session.user.id, purchase.shopItemType]
      );
    }

    // Update this item
    await db.query(
      `UPDATE "UserPurchase"
       SET equipped = $1
       WHERE "userId" = $2 AND "shopItemId" = $3`,
      [equipped, session.user.id, itemId]
    );

    // Get updated purchase with shop item details
    const updatedResult = await db.query(
      `SELECT p.id, p."userId", p."shopItemId", p."purchasedAt", p.equipped,
              s.id as "shopItem_id", s.name as "shopItem_name", s.description as "shopItem_description",
              s.type as "shopItem_type", s.price as "shopItem_price", s.icon as "shopItem_icon",
              s."isActive" as "shopItem_isActive", s.metadata as "shopItem_metadata",
              s."createdAt" as "shopItem_createdAt", s."updatedAt" as "shopItem_updatedAt"
       FROM "UserPurchase" p
       JOIN "ShopItem" s ON p."shopItemId" = s.id
       WHERE p."userId" = $1 AND p."shopItemId" = $2`,
      [session.user.id, itemId]
    );

    const row = updatedResult.rows[0];
    const updatedPurchase = {
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
    };

    return NextResponse.json({ purchase: updatedPurchase }, { status: 200 });
  } catch (error) {
    console.error('Equip item error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
