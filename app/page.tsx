'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Board, { type BoardRow } from '@/components/Board';
import Keyboard from '@/components/Keyboard';
import ShareButton from '@/components/ShareButton';
import StatsModal from '@/components/StatsModal';
import HowToModal from '@/components/HowToModal';
import { Header, Outcome, PuzzleChips } from '@/components/Chrome';
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

function useCountdown(): string | null {
  const [left, setLeft] = useState<string | null>(null);
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
      const ms = midnight.getTime() - now.getTime();
      const h = Math.floor(ms / 3_600_000);
      const m = Math.floor((ms % 3_600_000) / 60_000);
      setLeft(`${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m`);
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);
  return left;
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
  const [winningRow, setWinningRow] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const [howOpen, setHowOpen] = useState(false);
  const [statsRefreshKey, setStatsRefreshKey] = useState(0);
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  const countdown = useCountdown();

  useEffect(() => {
    let saved: Saved | null = null;
    try {
      pruneStaleSaves(date);
      const raw = localStorage.getItem(storageKey(date));
      if (raw) {
        const parsed: Saved = JSON.parse(raw);
        if (parsed.date === date) saved = parsed;
      }
    } catch {
      // ignore
    }
    if (!saved) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot localStorage hydration on mount
    setGuesses(saved.guesses);
    setFinished(saved.finished);
    setSolved(saved.solved);
    setAnswer(saved.answer);
  }, [date]);

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
    setTimeout(() => setShakingRow(null), 420);
    setTimeout(() => setError((e) => (e === msg ? null : e)), 1800);
  }, []);

  const recordAndShowStats = useCallback(
    async (finalGuessCount: number, didSolve: boolean) => {
      try {
        await fetch('/api/stats', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ date, guesses: finalGuessCount, solved: didSolve }),
        });
      } catch {
        // best-effort
      }
      setStatsRefreshKey((k) => k + 1);
      setStatsOpen(true);
    },
    [date],
  );

  const submit = useCallback(async () => {
    if (finished || submitting) return;
    if (current.length !== WORD_LENGTH) {
      shake(guesses.length, 'NOT ENOUGH LETTERS');
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
        const msg = data?.error === 'Not in word list' ? 'NOT A WORD' : (data?.error ?? 'INVALID GUESS').toUpperCase();
        shake(guesses.length, msg);
        return;
      }
      const nextGuesses = [...guesses, { letters: current, states: data.result as LetterState[] }];
      setGuesses(nextGuesses);
      setCurrent('');
      if (data.solved) {
        setSolved(true);
        setAnswer(data.answer ?? current);
        setWinningRow(nextGuesses.length - 1);
        await new Promise((r) => setTimeout(r, 900));
        setFinished(true);
        recordAndShowStats(nextGuesses.length, true);
      } else if (nextGuesses.length >= MAX_GUESSES) {
        await new Promise((r) => setTimeout(r, 500));
        setFinished(true);
        setSolved(false);
        recordAndShowStats(nextGuesses.length, false);
      }
    } catch {
      shake(guesses.length, 'NETWORK ERROR');
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

  const onKeyRef = useRef(onKey);
  useEffect(() => {
    onKeyRef.current = onKey;
  }, [onKey]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (statsOpen || howOpen || finished) return;

      const target = e.target as HTMLElement | null;
      if (target) {
        const tag = target.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable) return;
      }

      let mapped: string | null = null;
      if (e.key === 'Enter') {
        mapped = 'Enter';
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        mapped = 'Backspace';
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        mapped = e.key.toLowerCase();
      }

      if (mapped !== null) {
        e.preventDefault();
        onKeyRef.current(mapped);
        const k = mapped;
        setPressedKey(k);
        window.setTimeout(() => {
          setPressedKey((cur) => (cur === k ? null : cur));
        }, 150);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [statsOpen, howOpen, finished]);

  const boardRows: BoardRow[] = guesses.map((g) => ({ letters: g.letters, states: g.states }));

  return (
    <>
      <div className="kit-page">
        <Header onHow={() => setHowOpen(true)} onStats={() => setStatsOpen(true)} />

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, width: '100%' }}>
          <PuzzleChips date={date} />
          <div className="err" aria-live="polite" role="status">
            {error && <span className="err-pill">{error}</span>}
          </div>
          <Board
            guesses={boardRows}
            current={current}
            shakingRow={shakingRow}
            winningRow={winningRow}
          />
        </div>

        {finished && (
          <Outcome
            solved={solved}
            guesses={guesses.length}
            answer={answer}
            countdown={countdown}
          />
        )}

        {finished && (
          <ShareButton
            date={date}
            results={guesses.map((g) => g.states)}
            solved={solved}
          />
        )}

        <Keyboard
          letterStates={letterStates}
          onKey={onKey}
          disabled={finished || submitting}
          pressedKey={pressedKey}
        />
      </div>

      <StatsModal
        open={statsOpen}
        onClose={() => setStatsOpen(false)}
        refreshKey={statsRefreshKey}
      />
      <HowToModal open={howOpen} onClose={() => setHowOpen(false)} />
    </>
  );
}
