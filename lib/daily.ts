import { ANSWERS } from './words';
import { createServerSupabase, hasSupabaseCredentials } from './supabase';

export function isValidDate(dateStr: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
  const d = new Date(dateStr + 'T00:00:00Z');
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === dateStr;
}

export function todayUTC(): string {
  return new Date().toISOString().slice(0, 10);
}

// Deterministic, stable pick of today's answer given a date string.
// Uses a simple FNV-1a hash so the mapping is reproducible across runs.
export function pickWordForDate(dateStr: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < dateStr.length; i++) {
    hash ^= dateStr.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  const idx = Math.abs(hash) % ANSWERS.length;
  return ANSWERS[idx].toLowerCase();
}

// Returns today's word and best-effort records it in the daily_words table.
// The DB write is non-blocking — if it fails, the deterministic word is still
// returned, so the game keeps working without Supabase configured.
export async function getDailyWord(dateStr: string): Promise<string> {
  const word = pickWordForDate(dateStr);

  if (hasSupabaseCredentials()) {
    try {
      const supabase = createServerSupabase();
      await supabase
        .from('daily_words')
        .upsert({ date: dateStr, word }, { onConflict: 'date', ignoreDuplicates: true });
    } catch (err) {
      console.warn('[daily] failed to record daily_words row:', err);
    }
  }

  return word;
}
