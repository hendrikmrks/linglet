import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { ensurePremiumSettings } from '@/lib/premium-settings';

export const dynamic = 'force-dynamic';

const INT_FIELDS = [
  'maxChaptersPerDayFree',
  'maxChaptersPerDayPremium',
  'maxSubchaptersPerDayFree',
  'maxSubchaptersPerDayPremium',
  'maxChaptersTotalFree',
  'maxLessonsPerDayFree',
  'maxLessonsPerDayPremium',
];

const FLOAT_FIELDS = ['xpMultiplierPremium'];

const BOOL_FIELDS = ['canSeeLeaderboardFree', 'canSeeLeaderboardPremium'];

function parseInteger(value: unknown) {
  if (typeof value === 'number' && Number.isInteger(value)) return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number.parseInt(value, 10);
    if (Number.isInteger(parsed)) return parsed;
  }
  return null;
}

function parseFloatValue(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number.parseFloat(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

function parseBoolean(value: unknown) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    if (value.toLowerCase() === 'true') return true;
    if (value.toLowerCase() === 'false') return false;
  }
  return null;
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);

    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    if (!session.user.isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const settings = await ensurePremiumSettings();

    return NextResponse.json({ settings }, { status: 200 });
  } catch (error) {
    console.error('Admin premium settings error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession(request);

    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    if (!session.user.isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const updates: Record<string, number | boolean> = {};

    for (const field of INT_FIELDS) {
      if (body?.[field] === undefined) continue;
      const parsed = parseInteger(body[field]);
      if (parsed === null) {
        return NextResponse.json({ error: `Invalid ${field}` }, { status: 400 });
      }
      updates[field] = parsed;
    }

    for (const field of FLOAT_FIELDS) {
      if (body?.[field] === undefined) continue;
      const parsed = parseFloatValue(body[field]);
      if (parsed === null) {
        return NextResponse.json({ error: `Invalid ${field}` }, { status: 400 });
      }
      updates[field] = parsed;
    }

    for (const field of BOOL_FIELDS) {
      if (body?.[field] === undefined) continue;
      const parsed = parseBoolean(body[field]);
      if (parsed === null) {
        return NextResponse.json({ error: `Invalid ${field}` }, { status: 400 });
      }
      updates[field] = parsed;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    await ensurePremiumSettings();

    const columns = Object.keys(updates);
    const values = columns.map((column) => updates[column]);
    const setClauses = columns.map((column, index) => `"${column}" = $${index + 1}`);

    const query = `
      UPDATE "PremiumSettings"
      SET ${setClauses.join(', ')}, "updatedAt" = NOW()
      WHERE id = $${columns.length + 1}
      RETURNING *
    `;

    const result = await db.query(query, [...values, 'default']);

    return NextResponse.json({ settings: result.rows[0] }, { status: 200 });
  } catch (error) {
    console.error('Admin premium settings update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
