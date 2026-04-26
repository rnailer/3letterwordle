'use client';

import { useEffect, useRef, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import Modal from '@/components/Modal';
import { MAX_GUESSES } from '@/lib/game';

type Stats = {
  played: number;
  wins: number;
  winRate: number;
  currentStreak: number;
  maxStreak: number;
  distribution: number[];
  lastGameGuessCount: number | null;
};

export type StatsModalProps = {
  open: boolean;
  onClose: () => void;
  refreshKey?: number;
  user: User | null;
  children?: React.ReactNode;
};

function todayLocalDate(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

const ZERO_DISTRIBUTION = Array.from({ length: MAX_GUESSES }, () => 0);

export default function StatsModal({ open, onClose, refreshKey, user, children }: StatsModalProps) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const prevRefreshKey = useRef(refreshKey);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    const date = todayLocalDate();
    fetch(`/api/stats?date=${date}`, { cache: 'no-store' })
      .then((r) => r.json())
      .then((data: Stats) => {
        if (cancelled) return;
        const justFinished = refreshKey !== prevRefreshKey.current;
        prevRefreshKey.current = refreshKey;
        setStats(data);
        setShouldAnimate(justFinished && data.lastGameGuessCount !== null);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [open, refreshKey]);

  const loading = open && stats === null;
  const isEmpty = !!stats && stats.played === 0;

  return (
    <Modal open={open} onClose={onClose} title="Your Stats">
      {loading && (
        <p style={{ fontFamily: 'var(--ff-mono)', fontSize: 13, margin: '8px 0' }}>Loading…</p>
      )}

      {!loading && stats && !isEmpty && (
        <div className="stat-grid">
          <Stat label="Played" value={stats.played} />
          <Stat label="Win %" value={Math.round(stats.winRate * 100)} />
          <Stat label="Streak" value={stats.currentStreak} />
          <Stat label="Best" value={stats.maxStreak} />
        </div>
      )}

      {!loading && stats && (
        <Histogram
          distribution={stats.distribution ?? ZERO_DISTRIBUTION}
          highlightRow={stats.lastGameGuessCount}
          animate={shouldAnimate}
          empty={isEmpty}
        />
      )}

      {!loading && isEmpty && (
        <p className="histo-empty">Solve today&rsquo;s word and your streak starts.</p>
      )}

      {children}

      {user && (
        <form action="/auth/signout" method="post" style={{ marginTop: 14 }}>
          <p
            style={{
              fontFamily: 'var(--ff-mono)',
              fontSize: 11,
              letterSpacing: '0.06em',
              color: 'var(--c-green)',
              margin: '0 0 6px',
            }}
          >
            Signed in as {user.email}
          </p>
          <button type="submit" className="kit-btn small">SIGN OUT</button>
        </form>
      )}
    </Modal>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="stat">
      <div className="n">{value}</div>
      <div className="l">{label}</div>
    </div>
  );
}

type HistogramProps = {
  distribution: number[];
  highlightRow: number | null;
  animate: boolean;
  empty: boolean;
};

function Histogram({ distribution, highlightRow, animate, empty }: HistogramProps) {
  const max = Math.max(1, ...distribution);
  return (
    <>
      <div className="histo-label">Guess distribution</div>
      <div className="histo">
        {distribution.map((count, i) => {
          const idx = i + 1;
          const isHighlight = idx === highlightRow;
          const isZero = count === 0;
          const pct = (count / max) * 100;
          const cls = ['hrow'];
          if (isHighlight) cls.push('highlight');
          if (isZero) cls.push('zero');
          if (isHighlight && animate) cls.push('animate');
          return (
            <div key={idx} className={cls.join(' ')}>
              <div className="idx">{idx}</div>
              <div className="bar">
                <div className="fill" style={{ width: `${pct}%` }} />
              </div>
              <div className="v">{empty ? '—' : count}</div>
            </div>
          );
        })}
      </div>
    </>
  );
}
