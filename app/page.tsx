'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Board, { type BoardRow } from '@/components/Board';
import Keyboard from '@/components/Keyboard';
import ShareButton from '@/components/ShareButton';
import StatsModal from '@/components/StatsModal';
import { Button } from '@/components/ui/button';
import { MAX_GUESSES, WORD_LENGTH, type LetterState } from '@/lib/game';

type GuessRecord = {
  letters: string;
  states: LetterState[];
};

type Saved = {
  date: string;
  guesses: GuessRecord[];
  finished: boolean;
  solved: boolean;
  answer: string | null;
};

const STORAGE_PREFIX = 'w3:';

function todayLocalDate(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function storageKey(date: string) {
  return `${STORAGE_PREFIX}${date}`;
}

// Remove any saved-game entries from prior days so localStorage doesn't grow forever.
function pruneStaleSaves(today: string) {
  const keepKey = storageKey(today);
  const toRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith(STORAGE_PREFIX) && k !== keepKey) {
      toRemove.push(k);
    }
  }
  for (const k of toRemove) localStorage.removeItem(k);
}

function NextPuzzleCountdown() {
  const [left, setLeft] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const midnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        0, 0, 0, 0,
      );
      const ms = midnight.getTime() - now.getTime();
      const h = Math.floor(ms / 3_600_000);
      const m = Math.floor((ms % 3_600_000) / 60_000);
      setLeft(`${h}h ${m}m`);
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  if (!left) return null;
  return (
    <p className="text-sm text-muted-foreground tabular-nums">Next puzzle in {left}</p>
  );
}

export default function Home() {
  const [date] = useState(() => todayLocalDate());
  const [guesses, setGuesses] = useState<GuessRecord[]>([]);
  const [current, setCurrent] = useState('');
  const [finished, setFinished] = useState(false);
  const [solved, setSolved] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [shakingRow, setShakingRow] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const [statsRefreshKey, setStatsRefreshKey] = useState(0);

  // Hydrate from localStorage and prune stale entries
  useEffect(() => {
    try {
      pruneStaleSaves(date);
      const raw = localStorage.getItem(storageKey(date));
      if (!raw) return;
      const saved: Saved = JSON.parse(raw);
      if (saved.date !== date) return;
      setGuesses(saved.guesses);
      setFinished(saved.finished);
      setSolved(saved.solved);
      setAnswer(saved.answer);
    } catch {
      // ignore
    }
  }, [date]);

  // Persist to localStorage
  useEffect(() => {
    if (guesses.length === 0 && !finished) return;
    const payload: Saved = { date, guesses, finished, solved, answer };
    try {
      localStorage.setItem(storageKey(date), JSON.stringify(payload));
    } catch {
      // ignore
    }
  }, [date, guesses, finished, solved, answer]);

  const letterStates = useMemo(() => {
    const order: Record<LetterState, number> = { correct: 3, present: 2, absent: 1 };
    const map: Record<string, LetterState> = {};
    for (const g of guesses) {
      for (let i = 0; i < g.letters.length; i++) {
        const l = g.letters[i];
        const s = g.states[i];
        if (!map[l] || order[s] > order[map[l]]) {
          map[l] = s;
        }
      }
    }
    return map;
  }, [guesses]);

  const shake = useCallback((rowIndex: number, msg: string) => {
    setShakingRow(rowIndex);
    setError(msg);
    setTimeout(() => setShakingRow(null), 400);
    setTimeout(() => setError((e) => (e === msg ? null : e)), 1800);
  }, []);

  // Records the finished game, then opens the stats modal with a refresh cue.
  const recordAndShowStats = useCallback(
    async (finalGuessCount: number, didSolve: boolean) => {
      try {
        await fetch('/api/stats', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ date, guesses: finalGuessCount, solved: didSolve }),
        });
      } catch {
        // ignore — stats are best-effort
      }
      setStatsRefreshKey((k) => k + 1);
      setStatsOpen(true);
    },
    [date],
  );

  const submit = useCallback(async () => {
    if (finished || submitting) return;
    if (current.length !== WORD_LENGTH) {
      shake(guesses.length, 'Not enough letters');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/guess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guess: current, date }),
      });
      const data = await res.json();
      if (!res.ok) {
        shake(guesses.length, data?.error ?? 'Invalid guess');
        return;
      }
      const nextGuesses = [...guesses, { letters: current, states: data.result as LetterState[] }];
      setGuesses(nextGuesses);
      setCurrent('');
      if (data.solved) {
        setFinished(true);
        setSolved(true);
        setAnswer(data.answer ?? current);
        await new Promise((r) => setTimeout(r, 900));
        recordAndShowStats(nextGuesses.length, true);
      } else if (nextGuesses.length >= MAX_GUESSES) {
        setFinished(true);
        setSolved(false);
        await new Promise((r) => setTimeout(r, 900));
        recordAndShowStats(nextGuesses.length, false);
      }
    } catch {
      shake(guesses.length, 'Network error');
    } finally {
      setSubmitting(false);
    }
  }, [current, date, finished, guesses, recordAndShowStats, shake, submitting]);

  const onKey = useCallback(
    (key: string) => {
      if (finished) return;
      if (key === 'Enter') {
        submit();
        return;
      }
      if (key === 'Backspace') {
        setCurrent((c) => c.slice(0, -1));
        return;
      }
      if (/^[a-z]$/.test(key) && current.length < WORD_LENGTH) {
        setCurrent((c) => (c.length < WORD_LENGTH ? c + key : c));
      }
    },
    [current.length, finished, submit],
  );

  const boardRows: BoardRow[] = guesses.map((g) => ({ letters: g.letters, states: g.states }));

  return (
    <>
      <header className="w-full border-b border-neutral-200 dark:border-neutral-800">
        <div className="mx-auto max-w-2xl px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight">3 Letter Wordle</h1>
          <Button variant="outline" size="sm" onClick={() => setStatsOpen(true)}>
            Stats
          </Button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-between gap-6 px-4 py-6 max-w-2xl w-full mx-auto">
        <div className="flex flex-col items-center gap-4 w-full">
          <div className="h-6 text-sm text-red-500 dark:text-red-400" role="status" aria-live="polite">
            {error}
          </div>
          <div className={finished ? 'opacity-80' : undefined}>
            <Board guesses={boardRows} current={current} shakingRow={shakingRow} />
          </div>
          {finished && (
            <div className="flex flex-col items-center gap-2 mt-2">
              {solved ? (
                <p className="text-lg font-semibold">
                  Solved in {guesses.length}!{' '}
                  {answer && <span className="uppercase">{answer}</span>}
                </p>
              ) : (
                <p className="text-lg font-semibold">Better luck tomorrow.</p>
              )}
              <NextPuzzleCountdown />
              <ShareButton
                date={date}
                results={guesses.map((g) => g.states)}
                solved={solved}
              />
            </div>
          )}
        </div>

        <Keyboard letterStates={letterStates} onKey={onKey} disabled={finished || submitting} />
      </main>

      <StatsModal
        open={statsOpen}
        onOpenChange={setStatsOpen}
        refreshKey={statsRefreshKey}
      >
        {finished && (
          <div className="flex flex-col items-center gap-3 pt-2">
            <NextPuzzleCountdown />
            <ShareButton
              date={date}
              results={guesses.map((g) => g.states)}
              solved={solved}
            />
          </div>
        )}
      </StatsModal>
    </>
  );
}
