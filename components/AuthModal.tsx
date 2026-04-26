'use client';

import { useState } from 'react';
import Modal from '@/components/Modal';
import { createSbBrowser } from '@/lib/supabase-browser';

export type AuthModalProps = {
  open: boolean;
  onClose: () => void;
};

type Status = 'idle' | 'sending' | 'sent' | 'error';

export default function AuthModal({ open, onClose }: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const busy = status === 'sending' || status === 'sent';

  async function onGoogle() {
    if (busy) return;
    setStatus('sending');
    setErrorMsg(null);
    try {
      const supabase = createSbBrowser();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) {
        setStatus('error');
        setErrorMsg(error.message);
      }
      // On success, the Supabase client navigates the page to Google. The
      // component will unmount; nothing else to do here.
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Could not start Google sign-in.');
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('sending');
    setErrorMsg(null);
    try {
      const supabase = createSbBrowser();
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) {
        setStatus('error');
        setErrorMsg(error.message);
        return;
      }
      setStatus('sent');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Could not send link.');
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Keep your streak.">
      <p
        style={{
          fontFamily: 'var(--ff-body)',
          fontSize: 14,
          margin: '0 0 14px',
          color: 'var(--c-ink)',
        }}
      >
        Sign in to save your progress and streak across devices.
      </p>

      <button
        type="button"
        className="kit-btn google"
        onClick={onGoogle}
        disabled={busy}
      >
        <GoogleG />
        <span>Continue with Google</span>
      </button>

      <div className="auth-divider" aria-hidden="true">
        <span>OR</span>
      </div>

      <form onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="auth-email">EMAIL</label>
          <input
            id="auth-email"
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="you@somewhere.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={busy}
            required
          />
        </div>

        {status === 'sent' && (
          <p
            style={{
              fontFamily: 'var(--ff-mono)',
              fontSize: 12,
              color: 'var(--c-green)',
              margin: '8px 0 0',
            }}
          >
            Check your email. Tap the link to sign in.
          </p>
        )}
        {status === 'error' && errorMsg && (
          <p
            style={{
              fontFamily: 'var(--ff-mono)',
              fontSize: 12,
              color: 'var(--c-red)',
              margin: '8px 0 0',
            }}
          >
            {errorMsg}
          </p>
        )}

        <div className="actions">
          <button
            type="button"
            className="kit-btn"
            onClick={onClose}
            disabled={status === 'sending'}
          >
            {status === 'sent' ? 'CLOSE' : 'CANCEL'}
          </button>
          <button
            type="submit"
            className="kit-btn primary"
            disabled={busy || !email.trim()}
          >
            {status === 'sending' ? 'SENDING…' : status === 'sent' ? 'SENT' : 'SEND ME A LINK'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function GoogleG() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"
      />
      <path
        fill="#34A853"
        d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"
      />
      <path
        fill="#FBBC05"
        d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z"
      />
      <path
        fill="#EA4335"
        d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"
      />
    </svg>
  );
}
