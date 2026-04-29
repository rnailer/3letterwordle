import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="kit-footer">
      <Link href="/about">About</Link>
      <span className="dot" aria-hidden="true">·</span>
      <Link href="/privacy">Privacy</Link>
      <span className="dot" aria-hidden="true">·</span>
      <Link href="/terms">Terms</Link>
      <span className="dot" aria-hidden="true">·</span>
      <a href="https://333games.studio/" target="_blank" rel="noopener noreferrer">333games.studio</a>
    </footer>
  );
}
