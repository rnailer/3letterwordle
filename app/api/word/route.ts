import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { getDailyWord, isValidDate, todayUTC } from '@/lib/daily';

export const dynamic = 'force-dynamic';

// Returns a hash/ID for today's word. The plaintext answer never leaves the server.
export async function GET(req: NextRequest) {
  const qDate = req.nextUrl.searchParams.get('date');
  const date = qDate && isValidDate(qDate) ? qDate : todayUTC();

  const word = await getDailyWord(date);
  const hash = createHash('sha256').update(word).digest('hex');

  return NextResponse.json({ date, hash });
}
