import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="kit-footer">
      <Link href="/privacy">Privacy</Link>
      <span className="dot" aria-hidden="true">·</span>
      <Link href="/terms">Terms</Link>
      <span className="dot" aria-hidden="true">·</span>
      <a href="mailto:hello@333games.studio">hello@333games.studio</a>
    </footer>
  );
}
