import { NextRequest, NextResponse } from 'next/server';
import { evaluateGuess, isSolved, MAX_GUESSES, WORD_LENGTH } from '@/lib/game';
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

  const payload = body as { guess?: unknown; date?: unknown; priorGuesses?: unknown } | null;
  const guessRaw = typeof payload?.guess === 'string' ? payload.guess.trim().toLowerCase() : '';
  const date = typeof payload?.date === 'string' ? payload.date : '';
  // Number of guesses already submitted *before* this one. 0 on the first
  // submission, MAX_GUESSES - 1 (= 5) on the last allowed attempt.
  // Anything missing/invalid falls back to 0 — the safe default that keeps
  // the answer hidden, so a malformed client can never trick us into
  // revealing today's word.
  const rawPrior = payload?.priorGuesses;
  const priorGuesses =
    typeof rawPrior === 'number' && Number.isInteger(rawPrior) && rawPrior >= 0 && rawPrior < MAX_GUESSES
      ? rawPrior
      : 0;

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
  // The 6th submission (priorGuesses === 5) is the player's final attempt —
  // if they miss, the game is over and we reveal the answer so the lose
  // panel can show it. On guesses 1–5, answer stays hidden.
  const isFinalAttempt = priorGuesses === MAX_GUESSES - 1;

  return NextResponse.json({
    result,
    solved,
    answer: solved || (!solved && isFinalAttempt) ? answer : null,
  });
}
