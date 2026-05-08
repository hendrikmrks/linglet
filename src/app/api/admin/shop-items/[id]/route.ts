import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

// GET single shop item
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession(request);

    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    if (!session.user.isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const result = await db.query(
      `SELECT s.id, s.name, s.description, s.type, s.price, s.icon, s."isActive", 
              s.metadata, s."createdAt", s."updatedAt",
              COUNT(p.id)::int as purchase_count
       FROM "ShopItem" s
       LEFT JOIN "UserPurchase" p ON s.id = p."shopItemId"
       WHERE s.id = $1
       GROUP BY s.id`,
      [params.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Shop item not found' }, { status: 404 });
    }

    const row = result.rows[0];
    const item = {
      id: row.id,
      name: row.name,
      description: row.description,
      type: row.type,
      price: row.price,
      icon: row.icon,
      isActive: row.isActive,
      metadata: row.metadata,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      _count: {
        purchases: row.purchase_count
      }
    };

    return NextResponse.json({ item }, { status: 200 });
  } catch (error) {
    console.error('Get shop item error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT update shop item
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession(request);

    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    if (!session.user.isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { name, description, type, price, icon, metadata, isActive } = body;

    if (price !== undefined && (typeof price !== 'number' || price < 0)) {
      return NextResponse.json({ error: 'Invalid price' }, { status: 400 });
    }

    if (type !== undefined) {
      const validTypes = ['BADGE', 'THEME', 'BOOSTER'];
      if (!validTypes.includes(type)) {
        return NextResponse.json({ error: 'Invalid item type' }, { status: 400 });
      }
    }

    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramIndex++}`);
      values.push(name);
    }
    if (description !== undefined) {
      updates.push(`description = $${paramIndex++}`);
      values.push(description);
    }
    if (type !== undefined) {
      updates.push(`type = $${paramIndex++}`);
      values.push(type);
    }
    if (price !== undefined) {
      updates.push(`price = $${paramIndex++}`);
      values.push(price);
    }
    if (icon !== undefined) {
      updates.push(`icon = $${paramIndex++}`);
      values.push(icon);
    }
    if (metadata !== undefined) {
      updates.push(`metadata = $${paramIndex++}`);
      values.push(JSON.stringify(metadata));
    }
    if (isActive !== undefined) {
      updates.push(`\"isActive\" = $${paramIndex++}`);
      values.push(isActive);
    }

    updates.push(`\"updatedAt\" = NOW()`);
    values.push(params.id);

    const result = await db.query(
      `UPDATE "ShopItem" SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Shop item not found' }, { status: 404 });
    }

    return NextResponse.json({ item: result.rows[0] }, { status: 200 });
  } catch (error) {
    console.error('Update shop item error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE shop item
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession(request);

    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    if (!session.user.isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const result = await db.query(
      `DELETE FROM "ShopItem" WHERE id = $1 RETURNING id`,
      [params.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Shop item not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Shop item deleted' }, { status: 200 });
  } catch (error) {
    console.error('Delete shop item error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
