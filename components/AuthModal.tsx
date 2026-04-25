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
        We&rsquo;ll email you a one-tap link. No password to remember.
      </p>

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
            disabled={status === 'sending' || status === 'sent'}
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
            disabled={status === 'sending' || status === 'sent' || !email.trim()}
          >
            {status === 'sending' ? 'SENDING…' : status === 'sent' ? 'SENT' : 'SEND ME A LINK'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
