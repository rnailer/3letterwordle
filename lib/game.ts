export type LetterState = 'correct' | 'present' | 'absent';

export const WORD_LENGTH = 3;
export const MAX_GUESSES = 6;

export function evaluateGuess(guess: string, answer: string): LetterState[] {
  if (guess.length !== answer.length) {
    throw new Error('Guess and answer must be the same length');
  }

  const g = guess.toLowerCase();
  const a = answer.toLowerCase();
  const result: LetterState[] = new Array(g.length).fill('absent');
  const remaining: Record<string, number> = {};

  // First pass: mark exact matches and count remaining answer letters
  for (let i = 0; i < g.length; i++) {
    if (g[i] === a[i]) {
      result[i] = 'correct';
    } else {
      remaining[a[i]] = (remaining[a[i]] ?? 0) + 1;
    }
  }

  // Second pass: mark present for guess letters that still have remaining count
  for (let i = 0; i < g.length; i++) {
    if (result[i] === 'correct') continue;
    const count = remaining[g[i]] ?? 0;
    if (count > 0) {
      result[i] = 'present';
      remaining[g[i]] = count - 1;
    }
  }

  return result;
}

export function isSolved(states: LetterState[]): boolean {
  return states.length > 0 && states.every((s) => s === 'correct');
}
