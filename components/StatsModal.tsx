'use client';

import { useEffect, useState } from 'react';
import Modal from '@/components/Modal';

type Stats = {
  played: number;
  wins: number;
  winRate: number;
  currentStreak: number;
  maxStreak: number;
};

export type StatsModalProps = {
  open: boolean;
  onClose: () => void;
  refreshKey?: number;
  children?: React.ReactNode;
};

export default function StatsModal({ open, onClose, refreshKey, children }: StatsModalProps) {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    fetch('/api/stats', { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setStats(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [open, refreshKey]);

  const loading = open && stats === null;

  return (
    <Modal open={open} onClose={onClose} title="Your Stats">
      {loading && (
        <p style={{ fontFamily: 'var(--ff-mono)', fontSize: 13, margin: '8px 0' }}>Loading…</p>
      )}

      {!loading && stats && stats.played === 0 && (
        <div className="empty-stats">
          <div className="glyph">0/0</div>
          <h3>No games yet.</h3>
          <p>Solve today&rsquo;s word and your streak starts.</p>
        </div>
      )}

      {!loading && stats && stats.played > 0 && (
        <div className="stat-grid">
          <Stat label="Played" value={stats.played} />
          <Stat label="Win %" value={Math.round(stats.winRate * 100)} />
          <Stat label="Streak" value={stats.currentStreak} />
          <Stat label="Best" value={stats.maxStreak} />
        </div>
      )}

      {children}
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
