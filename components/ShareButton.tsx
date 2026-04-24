'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
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
  return `3 Letter Wordle ${date} ${score}\n\n${grid}\n\nhttps://3letterwordle.com`;
}

export default function ShareButton({ date, results, solved }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const text = buildShareText(date, results, solved);
    try {
      if (navigator.share) {
        await navigator.share({ text });
      } else {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // user cancelled share or clipboard failed; no-op
    }
  }

  return (
    <Button onClick={share} className="w-full sm:w-auto">
      {copied ? 'Copied!' : 'Share'}
    </Button>
  );
}
