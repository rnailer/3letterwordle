import { MAX_GUESSES, WORD_LENGTH, type LetterState } from '@/lib/game';

export type BoardRow = {
  letters: string;
  states: LetterState[] | null;
};

export type BoardProps = {
  guesses: BoardRow[];
  current: string;
  shakingRow: number | null;
};

const STATE_CLASS: Record<LetterState, string> = {
  correct: 'bg-green-600 border-green-600 text-white',
  present: 'bg-yellow-500 border-yellow-500 text-white',
  absent: 'bg-neutral-500 border-neutral-500 text-white dark:bg-neutral-700 dark:border-neutral-700',
};

function Tile({
  letter,
  state,
  filled,
}: {
  letter: string;
  state: LetterState | null;
  filled: boolean;
}) {
  const base =
    'w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center text-3xl sm:text-4xl font-bold uppercase select-none rounded-md border-2 transition-colors';
  if (state) {
    return <div className={`${base} ${STATE_CLASS[state]}`}>{letter}</div>;
  }
  const empty = filled
    ? 'border-neutral-500 dark:border-neutral-400 text-foreground'
    : 'border-neutral-300 dark:border-neutral-700 text-foreground';
  return <div className={`${base} ${empty}`}>{letter}</div>;
}

export default function Board({ guesses, current, shakingRow }: BoardProps) {
  const rows: BoardRow[] = [];
  for (let i = 0; i < MAX_GUESSES; i++) {
    if (i < guesses.length) {
      rows.push(guesses[i]);
    } else if (i === guesses.length) {
      rows.push({ letters: current.padEnd(WORD_LENGTH, ' '), states: null });
    } else {
      rows.push({ letters: ' '.repeat(WORD_LENGTH), states: null });
    }
  }

  return (
    <div
      className="flex flex-col gap-2 select-none"
      style={{ WebkitTouchCallout: 'none', WebkitUserSelect: 'none' }}
    >
      {rows.map((row, i) => {
        const shaking = shakingRow === i ? 'animate-[wiggle_0.4s_ease-in-out]' : '';
        return (
          <div key={i} className={`flex gap-2 justify-center ${shaking}`}>
            {Array.from({ length: WORD_LENGTH }).map((_, j) => {
              const letter = row.letters[j]?.trim() ?? '';
              return (
                <Tile
                  key={j}
                  letter={letter}
                  state={row.states ? row.states[j] : null}
                  filled={letter !== ''}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
