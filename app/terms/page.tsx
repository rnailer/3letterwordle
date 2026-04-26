import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Terms of Service — 3 Letter Daily',
  description: 'The rules for using 3 Letter Daily. Plain English, no legalese.',
};

const LAST_UPDATED = 'April 26, 2026';

export default function TermsPage() {
  return (
    <main className="legal">
      <div className="legal-page">
        <header className="legal-header">
          <Link href="/" className="kit-logo" aria-label="Back to home">
            <span className="lt y">3</span>
            <span className="lt s">L</span>
            <span className="lt g">D</span>
          </Link>
          <Link href="/" className="kit-btn small">← BACK</Link>
        </header>

        <h1>Terms of Service</h1>
        <div className="updated">Last updated: {LAST_UPDATED}</div>

        <p>
          3 Letter Daily is a free daily word-puzzle game. By using it, you agree to these
          terms. Plain English, short and direct.
        </p>

        <h2>What this is</h2>
        <p>
          A small hobby project by Richard O&rsquo;Neill. Free to play, no ads, no premium
          tier. Provided as-is — sometimes things break.
        </p>

        <h2>How to play</h2>
        <p>
          One puzzle per day. Six tries. Three letters. Solve it.
        </p>
        <p>Please don&rsquo;t try to break the game or game the system:</p>
        <ul>
          <li>No automated solvers, scrapers, or bots</li>
          <li>No exploiting bugs to cheat or inflate streaks</li>
          <li>No attempting to compromise the site or other players&rsquo; accounts</li>
        </ul>

        <h2>Your account</h2>
        <p>
          Accounts are free. You can sign in with email (magic link) or Google. We may
          suspend or delete accounts that violate these terms or abuse the service. You
          can delete your own account any time by emailing{' '}
          <a href="mailto:hello@333games.studio">hello@333games.studio</a>.
        </p>

        <h2>What you submit</h2>
        <p>
          The only thing you submit is your guesses. The emoji-square share string you
          generate after a game is yours to share — that&rsquo;s the point. We don&rsquo;t
          host any other user-generated content.
        </p>

        <h2>Availability</h2>
        <p>
          The site is best-effort. There&rsquo;s no SLA, no uptime guarantee. We may
          pause, change, or shut it down at any time. If that happens, we&rsquo;ll do our
          best to give notice.
        </p>

        <h2>Liability</h2>
        <p>
          The site is provided &ldquo;as-is&rdquo; without warranties of any kind, either
          express or implied. To the fullest extent permitted by law, Richard O&rsquo;Neill
          is not liable for any damages arising from your use of the site.
        </p>

        <h2>Governing law</h2>
        <p>
          These terms are governed by the laws of the Republic of Ireland. Any disputes
          that can&rsquo;t be sorted out by email will be resolved in the courts of Ireland.
        </p>

        <h2>Changes to these terms</h2>
        <p>
          If terms change, the &ldquo;Last updated&rdquo; date will reflect that.
          Continued use after a change means you accept the new version.
        </p>

        <h2>Contact</h2>
        <p>
          <a href="mailto:hello@333games.studio">hello@333games.studio</a>
        </p>
      </div>

      <Footer />
    </main>
  );
}
