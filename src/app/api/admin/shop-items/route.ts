import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

// GET all shop items (admin view)
export async function GET(request: NextRequest) {
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
       GROUP BY s.id
       ORDER BY s.type ASC, s."createdAt" DESC`
    );

    const items = result.rows.map((row: any) => ({
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
    }));

    return NextResponse.json({ items }, { status: 200 });
  } catch (error) {
    console.error('Get shop items error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST create new shop item
export async function POST(request: NextRequest) {
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

    if (!name || !description || !type || !icon) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (typeof price !== 'number' || price < 0) {
      return NextResponse.json({ error: 'Invalid price' }, { status: 400 });
    }

    const validTypes = ['BADGE', 'THEME', 'BOOSTER'];
    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: 'Invalid item type' }, { status: 400 });
    }

    const result = await db.query(
      `INSERT INTO "ShopItem" (id, name, description, type, price, icon, "isActive", metadata, "createdAt", "updatedAt")
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
       RETURNING *`,
      [name, description, type, price, icon, isActive !== false, metadata ? JSON.stringify(metadata) : null]
    );

    return NextResponse.json({ item: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Create shop item error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
