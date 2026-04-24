'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

type Stats = {
  played: number;
  wins: number;
  winRate: number;
  currentStreak: number;
  maxStreak: number;
};

export type StatsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  refreshKey?: number;
  children?: React.ReactNode;
};

export default function StatsModal({ open, onOpenChange, refreshKey, children }: StatsModalProps) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setLoading(true);
    fetch('/api/stats', { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setStats(data);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open, refreshKey]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Statistics</DialogTitle>
          <DialogDescription>Your play history on this device.</DialogDescription>
        </DialogHeader>

        {loading && <p className="text-sm text-muted-foreground">Loading…</p>}

        {!loading && stats && (
          <div className="grid grid-cols-4 gap-4 py-2 text-center">
            <Stat label="Played" value={stats.played} />
            <Stat label="Win %" value={Math.round(stats.winRate * 100)} />
            <Stat label="Streak" value={stats.currentStreak} />
            <Stat label="Max" value={stats.maxStreak} />
          </div>
        )}

        {children}
      </DialogContent>
    </Dialog>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col items-center">
      <div className="text-3xl font-bold tabular-nums">{value}</div>
      <div className="text-xs uppercase text-muted-foreground">{label}</div>
    </div>
  );
}
