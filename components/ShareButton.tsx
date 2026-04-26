'use client';

import { useState } from 'react';
import type { LetterState } from '@/lib/game';

const EMOJI: Record<LetterState, string> = {
  correct: '🟩',
  present: '🟨',
  absent: '⬛',
};

export type ShareButtonProps = {
  date: string;
  results: LetterState[][];
  solved: boolean;
};

export function buildShareText(date: string, results: LetterState[][], solved: boolean): string {
  const score = solved ? `${results.length}/6` : 'X/6';
  const grid = results.map((row) => row.map((s) => EMOJI[s]).join('')).join('\n');
  return `3LD ${date} ${score}\n\n${grid}\n\nhttps://3letterdaily.com`;
}

export default function ShareButton({ date, results, solved }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const score = solved ? `${results.length}/6` : 'X/6';

  async function copy() {
    const text = buildShareText(date, results, solved);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // ignore
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'stretch', width: '100%', maxWidth: 320 }}>
      <div className="share-card">
        <div className="head">
          <span>3LD</span>
          <span>#{date.slice(-2)} {score}</span>
        </div>
        <div className="grid">
          {results.map((r, i) => (
            <div key={i}>{r.map((s) => EMOJI[s]).join('')}</div>
          ))}
        </div>
      </div>
      <button type="button" className="kit-btn primary" onClick={copy}>
        {copied ? 'COPIED' : 'COPY SHARE'}
      </button>
    </div>
  );
}
