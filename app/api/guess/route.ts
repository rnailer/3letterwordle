import { NextRequest, NextResponse } from 'next/server';
import { evaluateGuess, isSolved, WORD_LENGTH } from '@/lib/game';
import { isValidGuess } from '@/lib/words';
import { getDailyWord, isValidDate } from '@/lib/daily';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const payload = body as { guess?: unknown; date?: unknown } | null;
  const guessRaw = typeof payload?.guess === 'string' ? payload.guess.trim().toLowerCase() : '';
  const date = typeof payload?.date === 'string' ? payload.date : '';

  if (!new RegExp(`^[a-z]{${WORD_LENGTH}}$`).test(guessRaw)) {
    return NextResponse.json({ error: 'Guess must be a 3-letter word' }, { status: 400 });
  }
  if (!isValidDate(date)) {
    return NextResponse.json({ error: 'Invalid date' }, { status: 400 });
  }
  if (!isValidGuess(guessRaw)) {
    return NextResponse.json({ error: 'Not in word list' }, { status: 400 });
  }

  const answer = await getDailyWord(date);
  const result = evaluateGuess(guessRaw, answer);
  const solved = isSolved(result);

  // The answer is only disclosed if the player already solved it this turn.
  return NextResponse.json({
    result,
    solved,
    answer: solved ? answer : null,
  });
}
