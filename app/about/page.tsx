import type { Metadata } from 'next';
import About from '@/components/About';

export const metadata: Metadata = {
  title: 'About — 3 Letter Daily',
  description: 'How a UX design group chat hijacked by Wordle stickers became a daily 3-letter word puzzle. The origin story, the receipts, the credits.',
};

export default function AboutRoute() {
  return <About />;
}
