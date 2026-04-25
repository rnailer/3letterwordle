'use client';

import { useState } from 'react';
import Modal from '@/components/Modal';

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
    // Wiring lands in commit (e). For now: mark idle so the form is
    // visibly inert without claiming a magic link was sent.
    setTimeout(() => {
      setStatus('error');
      setErrorMsg('Auth not enabled yet — wiring lands in next push.');
    }, 200);
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
            disabled={status === 'sending'}
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
            Check your email for the link.
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
            CANCEL
          </button>
          <button
            type="submit"
            className="kit-btn primary"
            disabled={status === 'sending' || !email.trim()}
          >
            {status === 'sending' ? 'SENDING…' : 'SEND ME A LINK'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
