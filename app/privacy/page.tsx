import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy — 3 Letter Wordle',
  description: 'What data 3 Letter Wordle collects, why, and your rights over it.',
};

const LAST_UPDATED = 'April 26, 2026';

export default function PrivacyPage() {
  return (
    <main className="legal">
      <div className="legal-page">
        <header className="legal-header">
          <Link href="/" className="kit-logo" aria-label="Back to home">
            <span className="lt y">3</span>
            <span className="lt s">L</span>
            <span className="lt g">W</span>
          </Link>
          <Link href="/" className="kit-btn small">← BACK</Link>
        </header>

        <h1>Privacy Policy</h1>
        <div className="updated">Last updated: {LAST_UPDATED}</div>

        <p>
          3 Letter Wordle is a small daily word-puzzle game. This page explains what data
          we collect, why, where it lives, and what you can do about it. Plain English,
          no legalese.
        </p>

        <h2>Who runs this</h2>
        <p>
          Richard O&rsquo;Neill — a one-person hobby project. For privacy questions, email{' '}
          <a href="mailto:hello@333games.studio">hello@333games.studio</a>.
        </p>

        <h2>What we collect</h2>
        <ul>
          <li>
            <b>Email address</b> — only if you choose to sign in. We use it to send a
            one-tap &ldquo;magic link&rdquo; so you can save your streak across devices.
          </li>
          <li>
            <b>Google profile info</b> — if you sign in via Google: your name, email
            address, and avatar URL.
          </li>
          <li>
            <b>Anonymous play data</b> — your guesses, win/loss outcome, and a randomly
            generated player ID stored in a cookie. No real-name identifier is attached
            unless you sign in.
          </li>
          <li>
            <b>Site analytics</b> — Vercel Analytics counts page views. It&rsquo;s
            privacy-friendly: no cookies, no fingerprinting, no cross-site tracking.
          </li>
        </ul>

        <h2>Why we collect it</h2>
        <ul>
          <li>So your streak persists if you switch devices (sign-in)</li>
          <li>So we can show you your stats and game history</li>
          <li>So we know roughly how many people are playing (analytics)</li>
        </ul>
        <p>We don&rsquo;t sell or share your data with third parties for advertising. We don&rsquo;t run ads.</p>

        <h2>Where it lives</h2>
        <ul>
          <li>
            <b>Supabase</b> — our database, hosted by Supabase Inc., stores email
            addresses, play history, and account info.
          </li>
          <li>
            <b>Vercel</b> — our hosting provider, which also runs the privacy-friendly analytics.
          </li>
          <li>
            <b>Google</b> — only for accounts that use Google sign-in.
          </li>
        </ul>

        <h2>How long we keep it</h2>
        <p>
          Indefinitely while your account exists. If you want it deleted, email{' '}
          <a href="mailto:hello@333games.studio">hello@333games.studio</a> and we&rsquo;ll
          remove your account and all associated play data.
        </p>

        <h2>Your rights</h2>
        <p>
          If you&rsquo;re in the EU or UK, GDPR gives you the right to access, correct,
          delete, or export your personal data. To exercise any of those, email{' '}
          <a href="mailto:hello@333games.studio">hello@333games.studio</a>. We&rsquo;ll
          respond within 30 days.
        </p>

        <h2>Cookies</h2>
        <ul>
          <li>
            A single anonymous <code>player_id</code> cookie — keeps track of your guesses
            on this device. Functional, not tracking.
          </li>
          <li>
            Supabase auth cookies — only set after you sign in, used to keep you logged in.
            Functional.
          </li>
          <li>
            No third-party tracking cookies. No advertising cookies. None.
          </li>
        </ul>

        <h2>Children</h2>
        <p>
          This site isn&rsquo;t aimed at people under 13 and we don&rsquo;t knowingly
          collect data from them. If you&rsquo;re a parent and find that your child has
          signed up, email us and we&rsquo;ll delete the account.
        </p>

        <h2>Changes to this policy</h2>
        <p>
          If anything material changes, we&rsquo;ll update the &ldquo;Last updated&rdquo;
          date at the top, and surface a notice on the site for substantive changes.
        </p>

        <h2>Contact</h2>
        <p>
          Privacy questions: <a href="mailto:hello@333games.studio">hello@333games.studio</a>
        </p>
      </div>

      <Footer />
    </main>
  );
}
