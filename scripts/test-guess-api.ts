/**
 * Regression test for /api/guess answer-disclosure rules.
 *
 * Run with: npm run test:guess-api
 *
 * Pinned at the bug we hit: when a player loses on the 6th guess, the
 * lose panel renders "THE WORD WAS …" and the slot stayed blank because
 * the API only returned `answer` on a winning guess. This test asserts
 * the four corner cases of that disclosure rule.
 *
 * Imports the handler directly (no running dev server needed). Runs
 * deterministically against the FNV-1a daily picker — no Supabase env
 * required since hasSupabaseCredentials() short-circuits without keys.
 */

import { strict as assert } from 'node:assert';
import { POST } from '../app/api/guess/route';
import { pickWordForDate } from '../lib/daily';
import { MAX_GUESSES } from '../lib/game';

type GuessResponse = {
  result?: unknown;
  solved?: boolean;
  answer?: string | null;
  error?: string;
};

async function callPost(body: unknown): Promise<GuessResponse> {
  const req = new Request('http://localhost/api/guess', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  const res = await POST(req as Parameters<typeof POST>[0]);
  return (await res.json()) as GuessResponse;
}

async function main() {
  const date = '2026-04-26';
  const answer = pickWordForDate(date);
  // Pick a guess we *know* won't match today's answer. 'cat' and 'dog' are
  // both in VALID_GUESSES; if the answer happens to be one of them we swap.
  const wrong = answer === 'cat' ? 'dog' : 'cat';

  console.log(`Today's answer for ${date}: ${answer}`);
  console.log(`Using wrong guess: ${wrong}\n`);

  let passed = 0;
  async function check(label: string, fn: () => Promise<void>) {
    await fn();
    passed += 1;
    console.log(`  ✓ ${label}`);
  }

  // 1. First wrong guess — answer must stay hidden.
  await check('first wrong guess: answer hidden', async () => {
    const r = await callPost({ guess: wrong, date, priorGuesses: 0 });
    assert.equal(r.solved, false, 'should not be solved');
    assert.equal(r.answer, null, 'answer must be null on guesses 1-5');
  });

  // 2. Mid-game wrong guess — answer must stay hidden.
  await check('mid-game wrong guess: answer hidden', async () => {
    const r = await callPost({ guess: wrong, date, priorGuesses: 3 });
    assert.equal(r.solved, false);
    assert.equal(r.answer, null, 'answer must stay hidden until the 6th attempt');
  });

  // 3. THE BUG: 6th wrong guess (priorGuesses === MAX_GUESSES - 1) — answer
  // must be revealed so the lose panel can render it.
  await check('final wrong guess: answer revealed', async () => {
    const r = await callPost({ guess: wrong, date, priorGuesses: MAX_GUESSES - 1 });
    assert.equal(r.solved, false);
    assert.equal(
      r.answer,
      answer,
      'answer must be returned on the 6th wrong guess (otherwise lose UI is blank)',
    );
  });

  // 4. Correct guess at any time — answer revealed.
  await check('correct guess on first try: answer revealed', async () => {
    const r = await callPost({ guess: answer, date, priorGuesses: 0 });
    assert.equal(r.solved, true);
    assert.equal(r.answer, answer);
  });

  // 5. Defence-in-depth: a malformed priorGuesses must not unlock disclosure.
  await check('malformed priorGuesses: answer hidden', async () => {
    const r = await callPost({ guess: wrong, date, priorGuesses: 'five' });
    assert.equal(r.answer, null, 'invalid priorGuesses must default to "hide"');
  });

  console.log(`\n${passed} assertions passed.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
