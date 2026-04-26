// Origin-story thread, ported from the design handoff.
// Speakers anonymized to first names; "me" = Richard.

type Person = {
  name: string;
  color: string;
  initial: string;
  me?: boolean;
};

const PEOPLE: Record<string, Person> = {
  amit:   { name: 'Amit',    color: '#E89B3F', initial: 'A' },
  olivia: { name: 'Olivia',  color: '#8EC5E8', initial: 'O' },
  aiden:  { name: 'Aiden',   color: '#D7263D', initial: 'A' },
  rob:    { name: 'Rob',     color: '#E89B3F', initial: 'R' },
  brenda: { name: 'Brenda',  color: '#8EC5E8', initial: 'B' },
  me:     { name: 'Richard', color: '#2E7D3F', initial: 'R', me: true },
};

type Score = { rows: string[] };
type LinkCardData = { title: string; blurb: string; domain: string };
type Reply = { name: string; body: string };

type Message = {
  divider?: string;
  from?: string;
  body?: string;
  ts?: string;
  reaction?: string;
  reply?: Reply;
  linkCard?: LinkCardData;
  score?: Score;
  guesses?: string[];
  answer?: string;
  gif?: string;
  highlight?: boolean;
  hero?: boolean;
};

const THREAD: Message[] = [
  { divider: '08:43 · TUE · UXD & WORDLE' },

  { from: 'amit', body: "What's going on with wordle, and what are these little stickers?", ts: '08:43' },
  { from: 'amit', reaction: '😂' },

  { from: 'olivia', body: 'Play it and find out Amit', ts: '08:45' },

  { from: 'amit', body: 'Play it on whatsapp?', ts: '08:45' },

  {
    from: 'olivia',
    linkCard: {
      title: 'Wordle — A daily word game',
      blurb: 'Guess the hidden word in 6 tries. A new puzzle is available each day.',
      domain: 'share.google',
    },
    body: 'Wordle — share.google/mLEjqkLA8KSzlwbOp',
    ts: '08:45',
  },

  { from: 'me', body: 'Sub group people', ts: '08:52' },
  { from: 'me', body: 'I like wordle but am on a hiatus', ts: '08:52' },
  { from: 'me', body: 'Compare your wordle stickers in private', ts: '08:53' },
  { from: 'me', reaction: '😂' },

  {
    from: 'aiden',
    reply: { name: 'Richard', body: 'I like wordle but am on a hiatus' },
    body: 'Translation: Richard got hella addicted to Wordle and is trying not to relapse.',
    ts: '08:55',
  },
  { from: 'aiden', reaction: '😂' },

  { from: 'rob', body: 'But unfortunately for him Brenda is admin and has been posting her wordles', ts: '08:56' },

  {
    from: 'amit',
    reply: { name: 'Olivia', body: 'Wordle — share.google/mLEjqkLA8KSzlwbOp' },
    body: "Oh yeah, I know this game. Wasn't sure what was the game on WhatsApp yous were sharing. Nvm. Carry on",
    ts: '08:59',
  },

  { from: 'me', body: 'Plus I suck at it 😂', ts: '08:59' },

  { from: 'amit', body: "You can't suck at a guessing game 🥲", ts: '09:00' },
  { from: 'amit', reaction: '😯' },

  { from: 'aiden', body: 'Behold — everyone in UXD for some reason', gif: 'BEHOLD', ts: '09:00' },

  { from: 'olivia', body: 'This too shall pass Richard', ts: '09:01' },

  { from: 'aiden', body: "We'll all be back playing Candy Crush next.", ts: '09:23' },

  {
    from: 'amit',
    body: 'Wordle 1,770  5/6',
    score: { rows: ['ppppc', 'pcpcc', 'ccccc'] },
    ts: '09:30',
  },
  { from: 'amit', body: 'There ya go, jumping on the bandwagon', ts: '09:30' },

  { from: 'rob', body: 'Not the best for a guessing game', ts: '09:31' },
  { from: 'rob', reaction: '😂' },

  { from: 'aiden', body: "Don't be mad at Amit for calling Wordle a guessing game. He also thinks UX is a guessing game.", ts: '09:32' },
  { from: 'aiden', reaction: '😂 ×3' },

  {
    from: 'amit',
    reply: { name: 'Aiden', body: "Don't be mad at Amit for calling Wordle a guessing game. He also thinks UX is a guessing game." },
    body: 'Take that back',
    ts: '09:33',
  },
  { from: 'amit', reaction: '🥲' },

  { divider: '09:44 · THE BRAINWAVE' },

  { from: 'me', body: 'I feel like the users would like this game to be easier', ts: '09:44', highlight: true },
  { from: 'me', body: '3 word wordle maybe?', ts: '09:44', highlight: true },
  { from: 'me', body: 'Letter even', ts: '09:44', highlight: true },
  { from: 'me', reaction: '😂' },

  {
    from: 'amit',
    reply: { name: 'Aiden', body: "Don't be mad at Amit for calling Wordle a guessing game. He also thinks UX is a guessing game." },
    body: 'With a high score as yourself, you must be really good at guess work. It shows.',
    ts: '09:45',
  },
  { from: 'amit', reaction: '😯' },

  { from: 'me', body: "I'm actually going to make a 3 letter wordle", ts: '09:45', hero: true },

  { from: 'rob', body: 'And 20 guesses', ts: '09:47' },

  { from: 'olivia', gif: 'GASP', ts: '09:48' },

  {
    from: 'aiden',
    reply: { name: 'Rob', body: 'And 20 guesses' },
    guesses: ['Tip', 'Pip', 'Lip', 'Sip', 'Dip', 'Nip', 'Wip', 'Zip', 'VIP', 'Hip', 'Tip', 'Yip', 'Kip', 'Nip', 'Bip', 'Lip', 'Sip', 'Tip', 'Tip', 'Tip'],
    answer: 'Rip',
    ts: '09:49',
  },
  { from: 'aiden', reaction: '😂' },

  { from: 'rob', body: 'Try Tip one more time', ts: '09:50' },

  { from: 'aiden', body: '"Maybe I spelt tip wrong?"', ts: '09:50' },

  {
    from: 'brenda',
    body: 'Wordle 1,770  3/6',
    score: { rows: ['paacc', 'ccccc', 'ccccc'] },
    ts: '09:51',
  },

  { divider: '11:49 · LATER THAT MORNING' },

  { from: 'me', body: 'I played online but I got it in 4', ts: '11:49' },
  { from: 'me', body: 'Very apt word for my social life these days', ts: '11:49' },
  { from: 'me', reaction: '😂' },
];

function Avatar({ person }: { person: Person }) {
  return (
    <div
      className="at-avatar"
      style={{
        background: person.color,
        color: person.me ? 'var(--c-yellow)' : 'var(--c-ink)',
      }}
    >
      {person.initial}
    </div>
  );
}

function ScoreCard({ score }: { score: Score }) {
  const cls = (c: string) => (c === 'c' ? 'c' : c === 'p' ? 'p' : 'a');
  return (
    <div className="at-score">
      <div className="head">3LD · 1,770 · {score.rows.length}/6</div>
      <div className="grid" style={{ gridTemplateRows: `repeat(${score.rows.length}, auto)` }}>
        {score.rows.flatMap((row, ri) =>
          row.split('').map((ch, ci) => (
            <div key={`${ri}-${ci}`} className={`sq ${cls(ch)}`} />
          )),
        )}
      </div>
    </div>
  );
}

function GuessList({ guesses, answer }: { guesses: string[]; answer: string }) {
  return (
    <div className="at-guesses">
      {guesses.map((g, i) => (
        <div key={i}>{g}</div>
      ))}
      <div className="answer">Answer: {answer}</div>
    </div>
  );
}

function GifCard({ label }: { label: string }) {
  return <div className="at-gif">{label}</div>;
}

function LinkCard({ data }: { data: LinkCardData }) {
  return (
    <div className="at-link">
      <div className="preview">
        <div>
          <div style={{ display: 'flex', gap: 3 }}>
            {['W', 'O', 'R', 'D', 'L', 'E'].map((l) => (
              <span key={l} className="tile">
                {l}
              </span>
            ))}
          </div>
          <span className="label">A daily word game</span>
        </div>
      </div>
      <div className="meta">
        <strong>{data.title}</strong>
        <br />
        <span style={{ opacity: 0.75 }}>{data.blurb}</span>
        <div className="domain">🔗 {data.domain}</div>
      </div>
    </div>
  );
}

function ReplyBlock({ reply }: { reply: Reply }) {
  return (
    <div className="at-reply">
      <div className="reply-name">{reply.name}</div>
      <div className="reply-body">{reply.body}</div>
    </div>
  );
}

function Bubble({ msg }: { msg: Message }) {
  const person = PEOPLE[msg.from!];
  const isMe = !!person.me;
  const bubbleStyle = msg.hero
    ? { boxShadow: '6px 7px 0 var(--c-yellow-ink)', borderColor: 'var(--c-ink)' }
    : msg.highlight
      ? { boxShadow: '5px 6px 0 var(--c-sky-deep)' }
      : undefined;

  return (
    <div className={`at-row ${isMe ? 'me' : ''}`}>
      {!isMe && <Avatar person={person} />}
      <div className="at-bubble" style={bubbleStyle}>
        {!isMe && (
          <div className="at-name" style={{ color: person.color }}>
            {person.name}
          </div>
        )}
        {isMe && <div className="at-name">You</div>}
        {msg.reply && <ReplyBlock reply={msg.reply} />}
        {msg.linkCard && <LinkCard data={msg.linkCard} />}
        {msg.score && <ScoreCard score={msg.score} />}
        {msg.guesses && msg.answer && <GuessList guesses={msg.guesses} answer={msg.answer} />}
        {msg.gif && <GifCard label={msg.gif} />}
        {msg.body && (
          <p className="at-body">
            {msg.body}
            {msg.ts && (
              <span className="at-ts">
                {msg.ts}
                {isMe ? ' ✓✓' : ''}
              </span>
            )}
          </p>
        )}
        {!msg.body && msg.ts && <span className="at-ts">{msg.ts}</span>}
      </div>
    </div>
  );
}

function ReactionRow({ msg }: { msg: Message }) {
  const isMe = !!PEOPLE[msg.from!]?.me;
  return (
    <div className="at-reactions" style={isMe ? { justifyContent: 'flex-end' } : undefined}>
      <div className="at-reaction-chip">{msg.reaction}</div>
    </div>
  );
}

function Divider({ label }: { label: string }) {
  return (
    <div className="at-divider">
      <div className="line" />
      <div className="pill">{label}</div>
      <div className="line" />
    </div>
  );
}

export default function AboutThread() {
  return (
    <div className="at-thread">
      {THREAD.map((msg, i) => {
        if (msg.divider) return <Divider key={i} label={msg.divider} />;
        if (msg.reaction && !msg.body) return <ReactionRow key={i} msg={msg} />;
        return <Bubble key={i} msg={msg} />;
      })}
    </div>
  );
}
