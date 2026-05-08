import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

// POST purchase a shop item
export async function POST(request: NextRequest) {
  try {
    const session = await getSession(request);

    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const { itemId } = body;

    if (!itemId) {
      return NextResponse.json({ error: 'Item ID required' }, { status: 400 });
    }

    // Get shop item
    const itemResult = await db.query(
      `SELECT * FROM "ShopItem" WHERE id = $1`,
      [itemId]
    );

    if (itemResult.rows.length === 0) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    const item = itemResult.rows[0];

    if (!item.isActive) {
      return NextResponse.json({ error: 'Item not available' }, { status: 400 });
    }

    // Check if already purchased
    const purchaseCheck = await db.query(
      `SELECT id FROM "UserPurchase" WHERE "userId" = $1 AND "shopItemId" = $2`,
      [session.user.id, itemId]
    );

    if (purchaseCheck.rows.length > 0) {
      return NextResponse.json({ error: 'Already purchased' }, { status: 400 });
    }

    // Perform transaction: atomically check XP, deduct and create purchase
    await db.query('BEGIN');
    
    try {
      // Atomic XP deduction — only succeeds if user has enough XP
      const updateResult = await db.query(
        `UPDATE "User" SET xp = xp - $1, "updatedAt" = NOW() WHERE id = $2 AND xp >= $1 RETURNING xp`,
        [item.price, session.user.id]
      );

      if (updateResult.rows.length === 0) {
        await db.query('ROLLBACK');
        return NextResponse.json({
          error: 'Insufficient XP',
          required: item.price,
        }, { status: 400 });
      }

      // Create purchase
      const purchaseResult = await db.query(
        `INSERT INTO "UserPurchase" (id, "userId", "shopItemId", "purchasedAt", equipped)
         VALUES (gen_random_uuid(), $1, $2, NOW(), false)
         RETURNING *`,
        [session.user.id, itemId]
      );

      await db.query('COMMIT');

      return NextResponse.json({ 
        purchase: {
          ...purchaseResult.rows[0],
          shopItem: item
        },
        remainingXP: updateResult.rows[0].xp
      }, { status: 201 });
    } catch (txError) {
      await db.query('ROLLBACK');
      throw txError;
    }
  } catch (error) {
    console.error('Purchase item error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
