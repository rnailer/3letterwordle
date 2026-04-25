'use client';

export type HeaderProps = {
  onHow: () => void;
  onStats: () => void;
};

export function Header({ onHow, onStats }: HeaderProps) {
  return (
    <header className="kit-header">
      <div className="kit-logo">
        <div className="lt y">3</div>
        <div className="lt s">L</div>
        <div className="lt g">W</div>
        <div className="name">daily</div>
      </div>
      <div className="kit-header-right">
        <button type="button" className="kit-btn small" onClick={onHow}>HOW</button>
        <button type="button" className="kit-btn small" onClick={onStats}>STATS</button>
      </div>
    </header>
  );
}

export type PuzzleChipsProps = {
  date: string;
};

export function PuzzleChips({ date }: PuzzleChipsProps) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
      <span className="chip"><span className="num">#{date.slice(-2)}</span>DAILY</span>
      <span className="chip s">3 LETTERS</span>
      <span className="chip g">6 TRIES</span>
    </div>
  );
}

export type OutcomeProps = {
  solved: boolean;
  guesses: number;
  answer: string | null;
  countdown: string | null;
};

export function Outcome({ solved, guesses, answer, countdown }: OutcomeProps) {
  return (
    <div className="outcome">
      <div className="script">{solved ? 'Nice.' : 'Tough one.'}</div>
      <div className="sub">
        {solved
          ? <>Solved in {guesses} / 6</>
          : <>The word was <span className="word">{(answer || '').toUpperCase()}</span></>}
      </div>
      {countdown && <div className="countdown">Next word in {countdown}</div>}
    </div>
  );
}
