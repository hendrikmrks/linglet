import { NextResponse } from 'next/server';
import { ensurePremiumSettings } from '@/lib/premium-settings';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settings = await ensurePremiumSettings();
    return NextResponse.json({ settings }, { status: 200 });
  } catch (error) {
    console.error('Premium settings error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
