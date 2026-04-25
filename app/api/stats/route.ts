import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase, hasSupabaseCredentials } from '@/lib/supabase';
import { getServerUserId } from '@/lib/auth';
import { PLAYER_COOKIE } from '@/lib/cookies';
import { isValidDate } from '@/lib/daily';
import { MAX_GUESSES } from '@/lib/game';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const playerId = req.cookies.get(PLAYER_COOKIE)?.value;
  if (!playerId) {
    return NextResponse.json({ error: 'Missing player cookie' }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  const { date, guesses, solved } = (body ?? {}) as {
    date?: unknown;
    guesses?: unknown;
    solved?: unknown;
  };

  if (typeof date !== 'string' || !isValidDate(date)) {
    return NextResponse.json({ error: 'Invalid date' }, { status: 400 });
  }
  if (typeof guesses !== 'number' || !Number.isInteger(guesses) || guesses < 1 || guesses > MAX_GUESSES) {
    return NextResponse.json({ error: 'Invalid guesses count' }, { status: 400 });
  }
  if (typeof solved !== 'boolean') {
    return NextResponse.json({ error: 'Invalid solved flag' }, { status: 400 });
  }

  if (!hasSupabaseCredentials()) {
    return NextResponse.json({ ok: false, reason: 'supabase-not-configured' });
  }

  const userId = await getServerUserId();
  const supabase = createServerSupabase();
  const { error } = await supabase
    .from('plays')
    .upsert(
      { player_id: playerId, date, guesses, solved, user_id: userId },
      { onConflict: 'player_id,date' },
    );
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

export async function GET(req: NextRequest) {
  const playerId = req.cookies.get(PLAYER_COOKIE)?.value;
  const empty = { plays: [], played: 0, wins: 0, winRate: 0, currentStreak: 0, maxStreak: 0 };

  if (!hasSupabaseCredentials()) {
    return NextResponse.json(empty);
  }

  const userId = await getServerUserId();
  if (!userId && !playerId) {
    return NextResponse.json(empty);
  }

  const supabase = createServerSupabase();
  // Logged-in users see all plays attached to their account (across devices).
  // Anonymous users see only the current device's plays.
  const query = supabase
    .from('plays')
    .select('date, guesses, solved')
    .order('date', { ascending: false })
    .limit(365);
  const { data, error } = userId
    ? await query.eq('user_id', userId)
    : await query.eq('player_id', playerId!);

  if (error || !data) {
    return NextResponse.json(empty);
  }

  const played = data.length;
  const wins = data.filter((p) => p.solved).length;
  const winRate = played > 0 ? wins / played : 0;

  // data is ordered newest-first; walk forwards for current streak
  let currentStreak = 0;
  for (const p of data) {
    if (p.solved) currentStreak++;
    else break;
  }

  const sorted = [...data].sort((a, b) => (a.date < b.date ? -1 : 1));
  let maxStreak = 0;
  let run = 0;
  let prev: string | null = null;
  for (const p of sorted) {
    const consecutive =
      prev !== null &&
      new Date(p.date).getTime() - new Date(prev).getTime() === 86_400_000;
    if (p.solved) {
      run = consecutive ? run + 1 : 1;
      if (run > maxStreak) maxStreak = run;
    } else {
      run = 0;
    }
    prev = p.date;
  }

  return NextResponse.json({
    plays: data,
    played,
    wins,
    winRate,
    currentStreak,
    maxStreak,
  });
}
