'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import AuthModal from '@/components/AuthModal';
import HowToModal from '@/components/HowToModal';
import StatsModal from '@/components/StatsModal';
import { useUser } from '@/lib/auth-client';

const STORAGE_PREFIX = 'w3:';

function todayLocalDate(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function formatLongDate(date: string): string {
  const d = new Date(`${date}T00:00:00`);
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export default function Intro() {
  const [howOpen, setHowOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [hasPlayedToday, setHasPlayedToday] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    let played = false;
    try {
      played = localStorage.getItem(`${STORAGE_PREFIX}${todayLocalDate()}`) !== null;
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot localStorage read on mount
    setHasPlayedToday(played);
  }, []);

  const today = todayLocalDate();
  const dateLabel = formatLongDate(today);
  const num = today.slice(-2);

  return (
    <>
      <div className="kit-page" style={{ paddingTop: 24 }}>
        <header className="kit-header">
          <div className="kit-logo">
            <div className="lt y">3</div>
            <div className="lt s">L</div>
            <div className="lt g">W</div>
          </div>
          <div className="kit-header-right">
            <button type="button" className="kit-btn small" onClick={() => setHowOpen(true)}>
              HOW
            </button>
            {user ? (
              <button
                type="button"
                className="kit-btn small"
                onClick={() => setStatsOpen(true)}
                aria-label={`Account: ${user.email ?? 'signed in'}`}
                style={{
                  width: 32,
                  height: 32,
                  padding: 0,
                  background: 'var(--c-green)',
                  color: 'var(--c-yellow)',
                }}
              >
                {(user.email ?? '·').trim().charAt(0).toUpperCase() || '·'}
              </button>
            ) : (
              <button type="button" className="kit-btn small" onClick={() => setStatsOpen(true)}>
                STATS
              </button>
            )}
          </div>
        </header>

        <Billboard />

        <div className="intro">
          <div className="intro-mark">
            <div className="lt y">3</div>
            <div className="lt s">L</div>
            <div className="lt g">W</div>
          </div>
          <p className="intro-sub">
            Small words,
            <br />
            big stakes.
          </p>

          <div className="intro-actions">
            {!user && (
              <button type="button" className="kit-btn" onClick={() => setAuthOpen(true)}>
                LOG IN
              </button>
            )}
            <Link href="/play" className="kit-btn primary" prefetch>
              {hasPlayedToday ? '▸ CONTINUE' : 'PLAY'}
            </Link>
          </div>

          <div className="intro-meta">
            <b>{dateLabel}</b>
            <br />
            No. {num}
          </div>
        </div>
      </div>

      <HowToModal open={howOpen} onClose={() => setHowOpen(false)} />
      <StatsModal open={statsOpen} onClose={() => setStatsOpen(false)} user={user} />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}

// Decorative billboard sign in the FT Baile spirit. Ported verbatim from
// the prototype's Intro.jsx so the lockup matches screenshots 01–03.
function Billboard() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12, marginBottom: 4 }}>
      <svg width="460" height="240" viewBox="0 0 460 240" fill="none" aria-hidden="true">
        <rect
          x="148"
          y="190"
          width="10"
          height="42"
          fill="var(--c-yellow)"
          stroke="var(--c-ink)"
          strokeWidth="4"
        />
        <rect
          x="302"
          y="190"
          width="10"
          height="42"
          fill="var(--c-yellow)"
          stroke="var(--c-ink)"
          strokeWidth="4"
        />
        <line x1="110" y1="232" x2="350" y2="232" stroke="var(--c-ink)" strokeWidth="4" />

        <polygon
          points="78,22 358,22 396,62 358,102 78,102 40,62"
          fill="var(--c-ink)"
          transform="translate(6,8)"
        />
        <polygon
          points="98,114 338,114 376,154 338,194 98,194 60,154"
          fill="var(--c-ink)"
          transform="translate(6,8)"
        />

        <polygon
          points="78,22 358,22 396,62 358,102 78,102 40,62"
          fill="var(--c-yellow)"
          stroke="var(--c-ink)"
          strokeWidth="4"
        />
        <text
          x="218"
          y="77"
          textAnchor="middle"
          fontFamily="var(--ff-display)"
          fontSize="46"
          fontWeight="900"
          fill="var(--c-ink)"
          letterSpacing="3"
        >
          THREE LTR
        </text>

        <polygon
          points="98,114 338,114 376,154 338,194 98,194 60,154"
          fill="var(--c-sky)"
          stroke="var(--c-ink)"
          strokeWidth="4"
        />
        <text
          x="221"
          y="171"
          textAnchor="middle"
          fontFamily="var(--ff-display)"
          fontSize="56"
          fontWeight="900"
          fill="var(--c-ink)"
          letterSpacing="4"
          opacity="0.95"
          transform="translate(3,4)"
        >
          WORD.
        </text>
        <text
          x="218"
          y="167"
          textAnchor="middle"
          fontFamily="var(--ff-display)"
          fontSize="56"
          fontWeight="900"
          fill="var(--c-yellow)"
          stroke="var(--c-ink)"
          strokeWidth="2"
          letterSpacing="4"
        >
          WORD.
        </text>

        <circle
          cx="60"
          cy="22"
          r="14"
          fill="var(--c-sky)"
          stroke="var(--c-ink)"
          strokeWidth="3"
        />
        <text
          x="60"
          y="27"
          textAnchor="middle"
          fontFamily="var(--ff-display)"
          fontSize="14"
          fill="var(--c-ink)"
        >
          ®
        </text>

        <polygon
          points="376,108 422,134 422,196 376,222"
          fill="var(--c-ink)"
          transform="translate(6,8)"
        />
        <polygon
          points="376,108 422,134 422,196 376,222"
          fill="var(--c-yellow)"
          stroke="var(--c-ink)"
          strokeWidth="4"
        />
        <text
          fontFamily="var(--ff-display)"
          fontSize="16"
          fontWeight="900"
          fill="var(--c-ink)"
          letterSpacing="4"
          textAnchor="middle"
          transform="translate(402 165) rotate(-90)"
        >
          DAILY
        </text>
      </svg>
    </div>
  );
}
