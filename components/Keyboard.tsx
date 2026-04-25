'use client';

import type { LetterState } from '@/lib/game';

const ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['Enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'Backspace'],
];

export type KeyboardProps = {
  letterStates: Record<string, LetterState>;
  onKey: (key: string) => void;
  disabled?: boolean;
  pressedKey?: string | null;
};

export default function Keyboard({ letterStates, onKey, disabled, pressedKey }: KeyboardProps) {
  return (
    <div className="kb">
      {ROWS.map((row, i) => (
        <div key={i} className="kb-row">
          {row.map((key) => {
            const wide = key === 'Enter' || key === 'Backspace';
            const state = letterStates[key];
            const cls = ['key'];
            if (wide) cls.push('wide');
            if (state) cls.push(state);
            if (pressedKey === key) cls.push('pressed');
            const label = key === 'Backspace' ? '⌫' : key === 'Enter' ? 'Enter' : key.toUpperCase();
            return (
              <button
                key={key}
                type="button"
                className={cls.join(' ')}
                onClick={() => !disabled && onKey(key)}
                disabled={disabled}
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
