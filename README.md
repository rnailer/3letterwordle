# 3 Letter Wordle

A daily 3-letter word puzzle. Next.js 15 (App Router) + TypeScript + Tailwind + shadcn/ui + Supabase, deployed to Vercel.

## Architecture

- The daily answer is **deterministically picked from a server-only list** based on the date. It never ships in the client bundle and never appears in an API response until the player solves the puzzle.
- `/api/word` returns only a SHA-256 hash of today's word plus the date.
- `/api/guess` validates, evaluates server-side, and returns per-letter feedback (`correct | present | absent`). The plaintext answer is only returned when the current guess solves the puzzle.
- `/api/stats` records plays and returns per-player aggregates.
- Anonymous players are tracked via a long-lived, HTTP-only UUID cookie set in `middleware.ts`.

## Setup

```bash
npm install
cp .env.local.example .env.local
# Fill in SUPABASE_SECRET_KEY (publishable key and URL already in .env.local)
```

Run the schema in Supabase (SQL editor, or `psql`):

```bash
cat supabase/schema.sql
```

Then:

```bash
npm run dev
```

Open http://localhost:3000.

## Environment variables

| Name | Scope | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | public | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | public | Publishable (anon) key, safe for browser |
| `SUPABASE_SECRET_KEY` | server only | Service-role key used by API routes |

The app runs **without** `SUPABASE_SECRET_KEY` — the game works end-to-end from the deterministic word list, but plays won't be persisted and stats will be empty.

## Project layout

```
app/
  api/guess/route.ts   — server-side evaluator (never leaks the answer)
  api/word/route.ts    — hash-only endpoint
  api/stats/route.ts   — per-player plays + stats
  layout.tsx, page.tsx — game UI
components/
  Board.tsx, Keyboard.tsx, ShareButton.tsx, StatsModal.tsx
  ui/                  — shadcn-generated primitives
lib/
  words.ts             — placeholder answer + guess lists (replace before launch)
  game.ts              — evaluateGuess + duplicate-letter handling
  daily.ts             — deterministic pick + best-effort daily_words upsert
  cookies.ts           — player cookie name/config
  supabase.ts          — server client factory
middleware.ts          — sets the anonymous player UUID cookie
supabase/schema.sql
```

## Replacing the word lists

`lib/words.ts` has placeholder lists. Before launch, replace `ANSWERS` (~curated common 3-letter words) and `GUESSES_EXTRA` (broader valid-word list). Any string in `ANSWERS` is automatically included in the valid-guess set.

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import into Vercel, attach to the `3letterwordle.com` domain.
3. In Vercel → Project → Settings → Environment Variables, add all three env vars listed above.
4. Run `supabase/schema.sql` against your Supabase project.
