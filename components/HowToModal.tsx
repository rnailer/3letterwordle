'use client';

import Modal from '@/components/Modal';

export type HowToModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function HowToModal({ open, onClose }: HowToModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="How it work?">
      <div className="how">
        <p>
          Guess a <b>3-letter word</b> in six tries.
        </p>
        <div className="demo">
          <div className="tile correct">C</div>
          <div className="tile present">A</div>
          <div className="tile absent">T</div>
        </div>
        <p>
          <b>Green</b> &mdash; letter in the right spot.<br />
          <b>Yellow</b> &mdash; in the word, wrong spot.<br />
          <b>Ink</b> &mdash; not in the word.
        </p>
        <p>A new word drops every day at midnight, wherever you are.</p>
      </div>
    </Modal>
  );
}
