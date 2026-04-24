'use client';

import { useEffect } from 'react';
import type { LetterState } from '@/lib/game';

const ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['Enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'Backspace'],
];

const STATE_CLASS: Record<LetterState, string> = {
  correct: 'bg-green-600 text-white hover:bg-green-600',
  present: 'bg-yellow-500 text-white hover:bg-yellow-500',
  absent: 'bg-neutral-500 text-white hover:bg-neutral-500 dark:bg-neutral-700',
};

export type KeyboardProps = {
  letterStates: Record<string, LetterState>;
  onKey: (key: string) => void;
  disabled?: boolean;
};

export default function Keyboard({ letterStates, onKey, disabled }: KeyboardProps) {
  useEffect(() => {
    if (disabled) return;
    const handler = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === 'Enter' || e.key === 'Backspace') {
        onKey(e.key);
        return;
      }
      if (/^[a-zA-Z]$/.test(e.key)) {
        onKey(e.key.toLowerCase());
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onKey, disabled]);

  return (
    <div className="flex flex-col gap-1.5 w-full max-w-lg">
      {ROWS.map((row, i) => (
        <div key={i} className="flex gap-1.5 justify-center">
          {row.map((key) => {
            const isSpecial = key === 'Enter' || key === 'Backspace';
            const state = letterStates[key];
            const stateClass = state ? STATE_CLASS[state] : 'bg-neutral-200 dark:bg-neutral-600 text-foreground hover:bg-neutral-300';
            const label = key === 'Backspace' ? '⌫' : key === 'Enter' ? 'Enter' : key.toUpperCase();
            return (
              <button
                key={key}
                type="button"
                onClick={() => !disabled && onKey(key)}
                disabled={disabled}
                className={`h-14 rounded font-semibold uppercase text-sm transition-colors disabled:opacity-60 ${
                  isSpecial ? 'px-3 text-xs' : 'flex-1 min-w-[2rem]'
                } ${stateClass}`}
              >
                {label}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
