import { MAX_GUESSES, WORD_LENGTH, type LetterState } from '@/lib/game';

export type BoardRow = {
  letters: string;
  states: LetterState[] | null;
};

export type BoardProps = {
  guesses: BoardRow[];
  current: string;
  shakingRow: number | null;
  winningRow: number | null;
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
  const cls = ['tile'];
  if (state) cls.push(state);
  else if (filled) cls.push('filled');
  else if (!letter) cls.push('empty');
  return <div className={cls.join(' ')}>{letter || ''}</div>;
}

export default function Board({ guesses, current, shakingRow, winningRow }: BoardProps) {
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
    <div className="board">
      {rows.map((row, i) => {
        const cls = ['board-row'];
        if (shakingRow === i) cls.push('shake');
        if (winningRow === i) cls.push('win');
        return (
          <div key={i} className={cls.join(' ')}>
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
