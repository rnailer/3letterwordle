'use client';

import { useState } from 'react';
import AboutThread from '@/components/AboutThread';
import Footer from '@/components/Footer';
import HowToModal from '@/components/HowToModal';
import StatsModal from '@/components/StatsModal';
import { Header } from '@/components/Chrome';
import { useUser } from '@/lib/auth-client';

export default function About() {
  const [howOpen, setHowOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const { user } = useUser();

  return (
    <>
      <div className="about-page">
        <Header onHow={() => setHowOpen(true)} onStats={() => setStatsOpen(true)} user={user} />

        <section className="about-hero">
          <div className="about-eyebrow">About · No. 001 · Origin Story</div>
          <h1>
            How a group chat
            <br />
            made me build a game
            <br />
            in a weekend.
          </h1>
          <div className="about-sub">(with a little help from the robots.)</div>
          <p className="about-lede">
            3 Letter Daily started as a joke in a UX design group chat. You know the one — the one
            that&rsquo;s been hijacked by Wordle stickers since 2022, where every morning starts with
            three or four people racing to post their <strong>Wordle 1,770 5/6</strong> sticker
            before 9am. Someone always asks &ldquo;what&rsquo;s going on with these little
            stickers?&rdquo; Someone always answers &ldquo;play it and find out.&rdquo; Eventually,
            someone snaps.
          </p>
        </section>

        <section className="about-section">
          <div className="about-section-head">
            <span className="num">01 · THE BRAINWAVE</span>
            <h2>The Wordle hijack.</h2>
          </div>
          <p>
            It&rsquo;s a universal modern condition. A group chat — yours, ours, theirs — gets
            quietly colonised by a single daily ritual. Yellow squares. Green squares. Black
            squares. <em>Wordle 1,770 5/6</em>. It happens slowly, then all at once, until one day
            you scroll back through three days of conversation and realise nobody has said a real
            sentence to each other in 72 hours.
          </p>
          <p>
            The UXD &amp; Wordle group chat hit terminal velocity sometime in spring. Someone new
            joins and asks the question — what are these little stickers? — and gets told to play
            and find out. The veterans defend the ritual. The skeptics question its existence.
            Things escalate. Memes are deployed. Someone calls UX a guessing game. Someone takes
            that personally.
          </p>
          <div className="about-brainwave">
            <span className="stamp">09:45 · The exact moment</span>
            <p className="quote">&ldquo;I&rsquo;m actually going to make a 3 letter wordle.&rdquo;</p>
            <p className="who">— Richard, in the group chat, instead of working</p>
          </div>
        </section>

        <section className="about-section">
          <div className="about-section-head">
            <span className="num">02 · THE THREAD</span>
            <h2>The receipts.</h2>
          </div>
          <p>
            Here, restored from an iPhone screen-record and lightly redacted, is the thread that
            became this game. We&rsquo;ve kept the order, the timestamps, the spelling mistakes,
            and the moment Aiden submits a 20-guess solve to a 3-letter puzzle. We&rsquo;ve changed
            the visuals because we thought our app should eat its own dog food.
          </p>
          <div className="about-bare">
            <div className="about-thread-header">
              <div className="group-icon">UD</div>
              <div className="titles">
                <h3>UXD &amp; Wordle</h3>
                <p>6 members · Amit, Brenda, Olivia, Rob, Aiden, Richard</p>
              </div>
            </div>
            <AboutThread />
          </div>
        </section>

        <section className="about-section about-outro">
          <div className="about-section-head">
            <span className="num">03 · WHAT HAPPENED NEXT</span>
            <h2>Friday night to Sunday night.</h2>
          </div>
          <p>
            I sent that <em>&ldquo;I&rsquo;m actually going to make a 3 letter wordle&rdquo;</em>{' '}
            message at 09:45 on a Friday. By Sunday night the game was live at{' '}
            <strong>3letterdaily.com</strong> — design system, brand identity, daily word logic,
            sign-in, streak tracking, share cards, the lot. One person. One weekend. About a
            hundred prompts and a slightly concerning amount of coffee.
          </p>
          <p>
            It used to take a small team a quarter to ship something like this. I built it on the
            couch, in pyjamas, while half-watching a Liverpool match. Claude Design did the brand
            and screen states. Claude Code wrote the Next.js app, the Supabase schema, the
            share-card generator, and the keyboard that mirrors tile state. I mostly typed
            sentences and clicked accept.
          </p>
          <p>
            Make of that what you will. The robots are coming for our jobs, allegedly, and on the
            evidence of this weekend they&rsquo;re going to be <em>annoyingly polite</em> about it.
            In the meantime: there&rsquo;s a new word at midnight. Bring it to your group chat.
            Hijack someone&rsquo;s Saturday morning. Make Amit guess.
          </p>
        </section>

        <section className="about-credits">
          <h3>Made by, with, on, in.</h3>
          <div className="about-credits-grid">
            {CREDITS.map((c) => (
              <div className="about-credit" key={c.role}>
                <p className="role">{c.role}</p>
                <p className="name">{c.name}</p>
                <p>{c.blurb}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="about-colophon">
          © 3 Letter Daily · 3letterdaily.com · The thread that started it all
        </div>

        <Footer />
      </div>

      <HowToModal open={howOpen} onClose={() => setHowOpen(false)} />
      <StatsModal open={statsOpen} onClose={() => setStatsOpen(false)} user={user} />
    </>
  );
}

const CREDITS = [
  {
    role: 'Design',
    name: 'Claude Design',
    blurb: 'Identity system, screen states, brand assets, typography choices, this very page.',
  },
  {
    role: 'Engineering',
    name: 'Claude Code',
    blurb: 'Next.js + TypeScript app, daily word logic, share-card generation, the keyboard that mirrors tile state.',
  },
  {
    role: 'Hosting',
    name: 'Vercel',
    blurb: 'Edge runtime, automatic deploys from main, the preview URLs we shared in the same group chat.',
  },
  {
    role: 'Database & Auth',
    name: 'Supabase',
    blurb: 'Daily word table, user streaks, sign-in via Google. Row-level security so nobody can see tomorrow’s word.',
  },
  {
    role: 'Display Type',
    name: 'FT Baile',
    blurb: 'Designed by François Rappo. Ten cuts, all licensed. The whole brand sits on its shoulders.',
  },
  {
    role: 'Body & Mono',
    name: 'Space Grotesk · Space Mono',
    blurb: 'By Florian Karsten and Colophon Foundry, via Google Fonts. The grown-up voice in the room.',
  },
];
