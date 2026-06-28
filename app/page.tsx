'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { AIBadge } from '@/app/components/ai-badge';
import { PersonaAvatar, type Crown } from '@/app/components/persona-avatar';
import { tintHex } from '@/lib/persona-styling';

// ────────────────── data ──────────────────

type CastMember = { name: string; color: string; crown: Crown };

const CAST: CastMember[] = [
  { name: 'Elon Musk',      color: '#2e6bf6', crown: 'antenna' },
  { name: 'Barack Obama',   color: '#0e9c8e', crown: 'flat'    },
  { name: 'Marie Kondo',    color: '#ff5c8a', crown: 'sprout'  },
  { name: 'Steve Jobs',     color: '#16140d', crown: 'tuft'    },
  { name: 'Naval Ravikant', color: '#6b4df0', crown: 'flat'    },
  { name: 'MrBeast',        color: '#138a43', crown: 'sprout'  },
  { name: 'Warren Buffett', color: '#e0451b', crown: 'bumps'   },
  { name: 'Trevor Noah',    color: '#7b5bff', crown: 'horns'   },
  { name: 'Paul Graham',    color: '#b45309', crown: 'tuft'    },
];

const ROTATION_MS = 2400;

type RoomKey = 'board' | 'founders' | 'stoa' | 'lounge';

type Room = {
  id: RoomKey;
  name: string;
  members: CastMember[];
  sub: string;
  ask: string;
  replies: { name: string; color: string; crown: Crown; text: string }[];
};

const ROOMS: Room[] = [
  {
    id: 'board',
    name: 'Board of Directors',
    members: [
      { name: 'Elon Musk',      color: '#2e6bf6', crown: 'antenna' },
      { name: 'Sam Altman',     color: '#17a44e', crown: 'flat'    },
      { name: 'Steve Jobs',     color: '#16140d', crown: 'tuft'    },
      { name: 'Warren Buffett', color: '#e0451b', crown: 'bumps'   },
    ],
    sub: '4 voices · your personal board',
    ask: 'Should we raise our prices?',
    replies: [
      { name: 'Elon Musk',      color: '#2e6bf6', crown: 'antenna', text: "Price to the value, not the cost. If it's 10× better, charge like it." },
      { name: 'Sam Altman',     color: '#17a44e', crown: 'flat',    text: 'Test it on 5% of users first. Data beats opinions — including mine.' },
      { name: 'Steve Jobs',     color: '#16140d', crown: 'tuft',    text: "Wrong question. Make it worth more, and the price answers itself." },
      { name: 'Warren Buffett', color: '#e0451b', crown: 'bumps',   text: 'A business that can raise prices without losing customers is a wonderful one.' },
    ],
  },
  {
    id: 'founders',
    name: 'The Founders Club',
    members: [
      { name: 'Paul Graham',      color: '#b45309', crown: 'tuft'  },
      { name: 'Patrick Collison', color: '#0ea5e9', crown: 'flat'  },
      { name: 'Garry Tan',        color: '#10b981', crown: 'sprout' },
      { name: 'Brian Chesky',     color: '#dc2626', crown: 'bumps' },
    ],
    sub: '4 personas · ship-it energy',
    ask: "What's the most underrated piece of startup advice?",
    replies: [
      { name: 'Paul Graham',      color: '#b45309', crown: 'tuft',  text: "Pick a problem so specific you can name the person who has it. Vague ideas attract vague effort." },
      { name: 'Patrick Collison', color: '#0ea5e9', crown: 'flat',  text: "Hire one person better than you, before you can afford to. The signal it sends to everyone you hire after is worth ten times the salary." },
      { name: 'Garry Tan',        color: '#10b981', crown: 'sprout', text: "Talk to ten users a week, every week, forever. Most founders stop when they 'know what to build.' That's exactly when they should keep going." },
      { name: 'Brian Chesky',     color: '#dc2626', crown: 'bumps', text: "Imagine the 11-star version of your product. The kind people would be astonished by. Build a notch below that, not the version everyone else would settle for." },
    ],
  },
  {
    id: 'stoa',
    name: 'The Stoa',
    members: [
      { name: 'Marcus Aurelius', color: '#a16207', crown: 'tuft' },
      { name: 'Epictetus',       color: '#1e40af', crown: 'flat' },
      { name: 'Seneca',          color: '#7f1d1d', crown: 'bumps' },
      { name: 'Naval Ravikant',  color: '#0e9c8e', crown: 'flat' },
    ],
    sub: '4 personas · stoics, ancient and modern',
    ask: "I can't stop worrying about something I can't control.",
    replies: [
      { name: 'Marcus Aurelius', color: '#a16207', crown: 'tuft',  text: "You suffer from this more than from the thing itself. The thing happens and is done. Your mind returns to it a thousand times by choice." },
      { name: 'Epictetus',       color: '#1e40af', crown: 'flat',  text: "Ask: is it in my control? If not, take your hands off it. Worrying does not buy you any extra say." },
      { name: 'Seneca',          color: '#7f1d1d', crown: 'bumps', text: "We suffer more in imagination than in reality. Write down what you fear will happen, then read it back. Most of it never comes." },
      { name: 'Naval Ravikant',  color: '#0e9c8e', crown: 'flat',  text: "Anxiety is paying interest on a debt you may not owe. Set it down. If it comes due, pick it up then. Not before." },
    ],
  },
  {
    id: 'lounge',
    name: 'The AI Lounge',
    members: [
      { name: 'Sam Altman',       color: '#17a44e', crown: 'flat'    },
      { name: 'Andrej Karpathy',  color: '#06b6d4', crown: 'antenna' },
      { name: 'Marc Andreessen',  color: '#4f46e5', crown: 'spikes'  },
      { name: 'Naval Ravikant',   color: '#0e9c8e', crown: 'flat'    },
    ],
    sub: '4 personas · what comes next',
    ask: "What's the most overhyped thing in AI right now?",
    replies: [
      { name: 'Sam Altman',      color: '#17a44e', crown: 'flat',    text: "Agents. They'll get there — but most of what's shipping today is a chatbot with a job title." },
      { name: 'Andrej Karpathy', color: '#06b6d4', crown: 'antenna', text: "Benchmarks. They prove the model can pass a test. They don't prove it can do the work." },
      { name: 'Marc Andreessen', color: '#4f46e5', crown: 'spikes',  text: "The doom narrative. The actual risk isn't the one the safety crowd is selling — it's that we move too slow." },
      { name: 'Naval Ravikant',  color: '#0e9c8e', crown: 'flat',    text: "The race. The winners won't be the loudest. They'll be the ones who quietly compound." },
    ],
  },
];

const WALL_PERSONAS: { name: string; title: string; color: string; crown: Crown }[] = [
  { name: 'Elon Musk',      title: 'Moonshots & first principles', color: '#2e6bf6', crown: 'antenna' },
  { name: 'Sam Altman',     title: 'Scaling & strategy',           color: '#17a44e', crown: 'flat'    },
  { name: 'Steve Jobs',     title: 'Product taste & focus',        color: '#16140d', crown: 'tuft'    },
  { name: 'Warren Buffett', title: 'Capital & patience',           color: '#e0451b', crown: 'bumps'   },
  { name: 'Trevor Noah',    title: 'Sharp & warm',                 color: '#7b5bff', crown: 'horns'   },
  { name: 'Jon Stewart',    title: 'Righteous & funny',            color: '#f1592b', crown: 'spikes'  },
  { name: 'Dave Chappelle', title: 'Slow-burn storyteller',        color: '#c2410c', crown: 'flat'    },
  { name: 'Naval Ravikant', title: 'Leverage & calm',              color: '#0e9c8e', crown: 'flat'    },
  { name: 'Marie Kondo',    title: 'Joy & order',                  color: '#ff5c8a', crown: 'sprout'  },
];

const GITHUB_URL = process.env.NEXT_PUBLIC_GITHUB_URL ?? 'https://github.com/juanfiguera/wwxd';
// No hosted chat app — wwxd is self-hosted only. Every CTA points at
// the repo so users land on the README and clone it.

// ────────────────── small SVG components ──────────────────

function GhIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 .5C5.7.5.5 5.73.5 12.06c0 5.06 3.29 9.36 7.86 10.88.58.1.79-.25.79-.56v-2c-3.2.69-3.87-1.37-3.87-1.37-.53-1.33-1.29-1.69-1.29-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.69 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 015.78 0c2.2-1.49 3.16-1.18 3.16-1.18.63 1.59.24 2.76.12 3.05.74.81 1.18 1.83 1.18 3.09 0 4.42-2.7 5.39-5.27 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.06 11.06 0 0023.5 12.06C23.5 5.73 18.27.5 12 .5z" />
    </svg>
  );
}

function ArrowRight({ size = 15 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function BrandLogo({ size = 32 }: { size?: number }) {
  return (
    <span className="inline-flex items-end overflow-hidden rounded-full" style={{ background: tintHex('#f1592b', 0.16), width: size + 6, height: size + 6 }}>
      <span className="wwxd-bob mx-auto">
        <PersonaAvatar color="#f1592b" crown="bumps" size={size} eyeColor="#ffffff" />
      </span>
    </span>
  );
}

// ────────────────── page ──────────────────

export default function Page() {
  // Rotating hero name + accent color
  const [activeIdx, setActiveIdx] = useState(0);
  const [pop, setPop] = useState(false);
  const xnameRef = useRef<HTMLSpanElement>(null);
  const active = CAST[activeIdx];

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIdx((i) => (i + 1) % CAST.length);
      setPop(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setPop(false)));
    }, ROTATION_MS);
    return () => clearInterval(id);
  }, []);

  // Fit-to-width for long names
  useEffect(() => {
    const el = xnameRef.current;
    if (!el) return;
    el.style.fontSize = '';
    const wrap = el.parentElement;
    if (!wrap) return;
    const max = wrap.clientWidth - 10;
    if (el.scrollWidth > max) {
      const base = parseFloat(getComputedStyle(el).fontSize);
      el.style.fontSize = Math.floor((base * max) / el.scrollWidth) + 'px';
    }
  }, [activeIdx]);

  // Accent colors live on documentElement so the hero pill background
  // tracks the active persona.
  const accentSoft = useMemo(() => tintHex(active.color, 0.14), [active.color]);
  const pageAccentStyle = useMemo<CSSProperties>(
    () =>
      ({
        ['--accent' as string]: active.color,
        ['--accent-soft' as string]: accentSoft,
      }) as CSSProperties,
    [active.color, accentSoft],
  );

  const [currentRoom, setCurrentRoom] = useState<RoomKey>('board');
  const room = ROOMS.find((r) => r.id === currentRoom)!;

  return (
    <div
      style={pageAccentStyle}
      className="min-h-dvh overflow-x-hidden bg-[var(--paper)] font-body text-[var(--ink)] antialiased"
    >
      {/* ===== NAV ===== */}
      <nav className="sticky top-0 z-50 border-b border-[var(--line)] bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex h-[74px] max-w-[1180px] items-center justify-between px-6">
          <Link
            href="/"
            className="flex items-center gap-2.5 font-display text-[25px] font-extrabold tracking-tight"
            style={{ letterSpacing: '-0.04em' }}
          >
            <BrandLogo size={32} />
            wwxd
          </Link>
          <div className="flex items-center gap-6">
            <a href="#rooms" className="hidden font-body text-[15px] font-semibold text-[var(--ink-2)] hover:text-[var(--ink)] sm:inline">
              Rooms
            </a>
            <a href="#wall" className="hidden font-body text-[15px] font-semibold text-[var(--ink-2)] hover:text-[var(--ink)] sm:inline">
              Personas
            </a>
            <a href="#how" className="hidden font-body text-[15px] font-semibold text-[var(--ink-2)] hover:text-[var(--ink)] sm:inline">
              How it works
            </a>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--ink)] px-5 py-3 font-display text-[15px] font-bold text-white transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-sm)]"
            >
              <GhIcon size={18} />
              GitHub
            </a>
          </div>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <header className="relative overflow-hidden pt-16 text-center">
        <div className="mx-auto max-w-[1180px] px-[26px]">
          <span
            className="inline-flex items-center font-body text-[13px] font-bold text-[var(--ink-2)]"
            style={{
              gap: '9px',
              background: 'var(--paper-2)',
              border: '1px solid var(--line)',
              padding: '7px 15px 7px 11px',
              borderRadius: 'var(--pill)',
              letterSpacing: '0.01em',
            }}
          >
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{
                background: 'var(--c-green)',
                boxShadow: '0 0 0 4px color-mix(in srgb, var(--c-green) 22%, transparent)',
              }}
            />
            Open-source · Self-hosted
          </span>
          <h1
            className="font-display font-extrabold"
            style={{ margin: '26px 0 0', lineHeight: 1.02, letterSpacing: '-0.03em' }}
          >
            <span
              className="block"
              style={{
                fontSize: 'clamp(26px, 4.4vw, 50px)',
                fontWeight: 600,
                color: 'var(--ink-soft)',
                letterSpacing: '-0.03em',
              }}
            >
              What would
            </span>
            <span className="block text-center" style={{ margin: '6px auto 8px' }}>
              <span
                ref={xnameRef}
                className={`wwxd-xname-size inline-block whitespace-nowrap transition-transform duration-300 ease-[cubic-bezier(.2,.7,.2,1)] ${
                  pop ? 'translate-y-[12px] scale-[0.96]' : ''
                }`}
                style={{
                  color: active.color,
                  background: accentSoft,
                  fontWeight: 800,
                  letterSpacing: '-0.045em',
                  padding: '0.04em 0.22em 0.12em',
                  borderRadius: '18px',
                }}
              >
                {active.name}
              </span>
            </span>
            <span
              className="block"
              style={{
                fontSize: 'clamp(26px, 4.4vw, 50px)',
                fontWeight: 600,
                color: 'var(--ink-soft)',
                letterSpacing: '-0.03em',
              }}
            >
              do?
            </span>
          </h1>
          <p
            className="mx-auto font-body"
            style={{
              fontSize: 'clamp(17px, 1.7vw, 20px)',
              fontWeight: 500,
              color: 'var(--ink-2)',
              lineHeight: 1.5,
              maxWidth: 600,
              marginTop: 24,
            }}
          >
            Chat with an AI impression of <b>anyone</b>: founders, presidents, philosophers,
            your favorite comedian. Then put a few in a room and watch them riff.
          </p>
          <div className="flex flex-wrap justify-center" style={{ gap: 13, marginTop: 30 }}>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center font-display font-bold text-white transition hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(20,18,10,0.26)]"
              style={{
                gap: 9,
                background: 'var(--ink)',
                borderRadius: 'var(--pill)',
                padding: '14px 24px',
                fontSize: 16,
                lineHeight: 1,
              }}
            >
              <GhIcon size={18} />
              View on GitHub
            </a>
          </div>
          <div className="mt-4 text-[13.5px] font-semibold text-[var(--ink-soft)]">
            MIT licensed · self-host it · they reply in character
          </div>
        </div>

        {/* Cast lineup — top margin must clear the active persona's pop label
         * (~56px above the row top: -translate-y-[26px] + -top-[30px]) so it
         * doesn't overlap the "MIT licensed · self-host it..." meta line. */}
        <div className="relative mt-20 pb-8">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 bottom-8 h-px w-[min(1080px,92vw)] -translate-x-1/2"
            style={{
              background:
                'linear-gradient(90deg,transparent,var(--line) 12%,var(--line) 88%,transparent)',
            }}
          />
          <div className="relative z-[2] mx-auto flex max-w-[1080px] items-end justify-center gap-[clamp(6px,1.6vw,26px)]">
            {CAST.map((c, i) => {
              const isActive = i === activeIdx;
              return (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setActiveIdx(i)}
                  className={`relative flex flex-col items-center transition-transform duration-300 ease-[cubic-bezier(.34,1.56,.64,1)] ${
                    isActive ? '-translate-y-[26px]' : ''
                  } ${i >= 6 ? 'hidden sm:flex' : ''} ${i >= 4 ? 'max-[620px]:hidden' : ''} ${i >= 3 ? 'max-[420px]:hidden' : ''}`}
                  aria-label={`Set hero to ${c.name}`}
                >
                  {isActive && (
                    <span
                      className="absolute -top-[30px] rounded-full border-2 border-[var(--ink)] bg-white px-3 py-1 font-display text-[12px] font-bold shadow-[0_6px_14px_rgba(20,18,10,0.12)]"
                    >
                      {c.name}
                    </span>
                  )}
                  <span
                    className="wwxd-bob"
                    data-phase={(i % 4).toString()}
                    style={{ display: 'inline-flex', lineHeight: 0 }}
                  >
                    <PersonaAvatar color={c.color} crown={c.crown} size={104} eyeColor="#fff" />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* ===== ROOMS ===== */}
      <section id="rooms" className="bg-[var(--paper-2)] py-[104px]">
        <div className="mx-auto max-w-[1180px] px-6">
          <div className="grid gap-11 lg:grid-cols-[1.04fr_0.96fr] lg:items-center">
            <div>
              <span
                className="font-display text-[13px] font-bold uppercase tracking-[0.13em]"
                style={{ color: 'var(--accent)' }}
              >
                ◆ rooms
              </span>
              <h2
                className="font-display font-extrabold"
                style={{
                  fontSize: 'clamp(34px, 5vw, 58px)',
                  lineHeight: 1.02,
                  letterSpacing: '-0.03em',
                  marginTop: 14,
                }}
              >
                Your own board of advisors, on demand
              </h2>
              <p className="mt-4 text-[19px] font-medium leading-[1.5] text-[var(--ink-2)]">
                Start a conversation and the whole room joins in: agreeing, pushing back, building
                on each other. Steer it wherever you want. Every voice is an impression, never the
                real person.
              </p>
              <div className="mt-6 flex flex-wrap gap-2.5">
                {ROOMS.map((r) => {
                  const on = r.id === currentRoom;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setCurrentRoom(r.id)}
                      aria-pressed={on}
                      className={`flex items-center gap-2.5 rounded-full bg-white px-4 py-2.5 font-display text-[14.5px] font-bold transition hover:-translate-y-px ${
                        on
                          ? 'text-[var(--ink)] shadow-[inset_0_0_0_2.5px_var(--ink)]'
                          : 'text-[var(--ink-soft)] shadow-[inset_0_0_0_1.5px_var(--line)]'
                      }`}
                    >
                      <span className="flex">
                        {r.members.slice(0, 3).map((m, i) => (
                          <span
                            key={m.name}
                            className="flex h-[30px] w-[30px] items-center justify-center overflow-hidden rounded-full bg-white"
                            style={{
                              marginLeft: i === 0 ? 0 : -8,
                              boxShadow: '0 0 0 2px #fff',
                              background: tintHex(m.color, 0.16),
                            }}
                          >
                            <PersonaAvatar color={m.color} crown={m.crown} size={24} eyeColor="#fff" />
                          </span>
                        ))}
                      </span>
                      {r.name}
                    </button>
                  );
                })}
              </div>
              <div className="mt-8 grid grid-cols-2 gap-4 text-left">
                <div>
                  <b className="font-display text-[16px]">Pick your cast</b>
                  <p className="mt-1 text-[14px] font-medium leading-[1.45] text-[var(--ink-soft)]">
                    Add as many voices as you want.
                  </p>
                </div>
                <div>
                  <b className="font-display text-[16px]">One prompt, many minds</b>
                  <p className="mt-1 text-[14px] font-medium leading-[1.45] text-[var(--ink-soft)]">
                    Each replies in character, then reacts to the others.
                  </p>
                </div>
              </div>
            </div>

            {/* Mock chat window */}
            <div
              className="overflow-hidden rounded-[var(--r-xl)] border border-[var(--line)] bg-white"
              style={{ boxShadow: 'var(--shadow)' }}
            >
              <div className="flex items-center gap-3 border-b border-[var(--line)] px-5 py-4">
                <span className="flex">
                  {room.members.slice(0, 4).map((m, i) => (
                    <span
                      key={i}
                      className="flex h-[42px] w-[42px] items-center justify-center overflow-hidden rounded-full bg-white"
                      style={{
                        marginLeft: i === 0 ? 0 : -12,
                        boxShadow: '0 0 0 3px #fff, 0 4px 8px rgba(20,18,10,0.1)',
                        background: tintHex(m.color, 0.16),
                      }}
                    >
                      <PersonaAvatar color={m.color} crown={m.crown} size={36} eyeColor="#fff" />
                    </span>
                  ))}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 font-display text-[18px] font-extrabold">
                    <span className="truncate">{room.name}</span>
                    <AIBadge tone="var(--ink-soft)" />
                  </div>
                  <div className="text-[12.5px] font-semibold text-[var(--ink-soft)]">
                    {room.sub}
                  </div>
                </div>
              </div>
              <div
                className="flex flex-col gap-4 px-5 py-5"
                style={{ background: 'linear-gradient(180deg,#fbfaf7,#fff)' }}
              >
                <div
                  className="ml-auto max-w-[78%] text-[15px] font-semibold text-white"
                  style={{
                    background: 'var(--ink)',
                    padding: '12px 16px',
                    borderRadius: '18px 18px 6px 18px',
                  }}
                >
                  {room.ask}
                </div>
                {room.replies.map((r, i) => (
                  <div key={i} className="flex max-w-[90%] items-start gap-3">
                    <span
                      className="flex h-[42px] w-[42px] shrink-0 items-end justify-center overflow-hidden rounded-full"
                      style={{ background: tintHex(r.color, 0.16) }}
                    >
                      <PersonaAvatar color={r.color} crown={r.crown} size={38} eyeColor="#fff" />
                    </span>
                    <div>
                      <div
                        className="flex items-center gap-1.5 font-display text-[13.5px] font-bold"
                        style={{ color: r.color }}
                      >
                        <span>{r.name}</span>
                        <AIBadge size="xs" tone={r.color} />
                      </div>
                      <div
                        className="mt-1 text-[14.5px] font-medium leading-[1.45] text-[var(--ink-2)]"
                        style={{
                          background: '#fff',
                          border: '1.5px solid var(--line)',
                          padding: '11px 15px',
                          borderRadius: '6px 18px 18px 18px',
                        }}
                      >
                        {r.text}
                      </div>
                    </div>
                  </div>
                ))}
                <div className="mt-1 flex items-center gap-2.5 rounded-full border-[1.5px] border-[var(--line)] bg-white px-5 py-2.5 text-[14px] font-semibold text-[var(--ink-soft)]">
                  Ask the room anything…
                  <span
                    className="ml-auto flex h-[34px] w-[34px] items-center justify-center rounded-full text-white"
                    style={{ background: 'var(--accent)' }}
                  >
                    <ArrowRight size={15} />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PERSONAS WALL ===== */}
      <section id="wall" className="py-[104px]">
        <div className="mx-auto max-w-[1180px] px-6">
          <div className="mx-auto max-w-[680px] text-center">
            <span
              className="font-display text-[13px] font-bold uppercase tracking-[0.13em]"
              style={{ color: 'var(--accent)' }}
            >
              ◆ personas
            </span>
            <h2
              className="font-display font-extrabold"
              style={{
                fontSize: 'clamp(34px, 5vw, 58px)',
                lineHeight: 1.02,
                letterSpacing: '-0.03em',
                marginTop: 14,
              }}
            >
              Bring anyone to the table.
            </h2>
            <p className="mx-auto mt-4 text-[19px] font-medium leading-[1.5] text-[var(--ink-2)]">
              Start with these, or summon anyone by name. Give it their tweets and essays and
              replies point back to what they actually wrote. Skip the sources and it works from
              memory. Either way, it&apos;s an impression not the real person.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-5">
            {WALL_PERSONAS.map((p) => (
              <div
                key={p.name}
                className="rounded-[var(--r-lg)] border border-[var(--line)] bg-white px-3.5 pb-4 pt-5 text-center transition-transform duration-150 ease-out hover:-translate-y-1 hover:shadow-[var(--shadow)]"
              >
                <div className="flex h-[96px] items-end justify-center">
                  <span className="wwxd-bob" data-phase={(p.name.length % 4).toString()}>
                    <PersonaAvatar color={p.color} crown={p.crown} size={84} eyeColor="#fff" title={p.name} />
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-center gap-1.5 font-display text-[15.5px] font-bold">
                  <span>{p.name}</span>
                  <AIBadge size="xs" tone={p.color} />
                </div>
                <div className="mt-0.5 text-[12px] font-semibold leading-[1.3] text-[var(--ink-soft)]">
                  {p.title}
                </div>
              </div>
            ))}
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="flex flex-col items-center justify-center gap-2 rounded-[var(--r-lg)] border border-dashed border-[#cfccc0] px-3.5 py-7 text-center text-[var(--ink-soft)] transition hover:border-[var(--ink)] hover:text-[var(--ink)]"
            >
              <div className="flex h-[54px] w-[54px] items-center justify-center rounded-full bg-[var(--paper-2)] font-display text-[30px] font-extrabold text-[var(--ink)]">
                +
              </div>
              <div className="font-display text-[15.5px] font-bold">Add anyone</div>
              <div className="text-[12px] font-semibold text-[var(--ink-soft)]">Clone the repo</div>
            </a>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how" className="bg-[var(--paper-2)] py-[104px]">
        <div className="mx-auto max-w-[1180px] px-6">
          <div className="mx-auto max-w-[680px] text-center">
            <span
              className="font-display text-[13px] font-bold uppercase tracking-[0.13em]"
              style={{ color: 'var(--accent)' }}
            >
              ◆ how it works
            </span>
            <h2
              className="font-display font-extrabold"
              style={{
                fontSize: 'clamp(34px, 5vw, 58px)',
                lineHeight: 1.02,
                letterSpacing: '-0.03em',
                marginTop: 14,
              }}
            >
              Three steps to a new impression.
            </h2>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {[
              {
                color: 'var(--c-pink)',
                num: 1,
                title: 'Name anyone',
                body: 'Type a name. Or paste an X handle. Or both. Real or historical, founder or comedian.',
              },
              {
                color: 'var(--c-blue)',
                num: 2,
                title: 'wwxd renders an impression',
                body: 'Give it sources (tweets, essays, YouTube transcripts) and replies cite specific posts. Skip them and it works from memory. Still an AI, not them.',
              },
              {
                color: 'var(--c-orange)',
                num: 3,
                title: 'Chat, or convene a room',
                body: 'Ask one for advice, or fill a room and let them debate. You moderate.',
              },
            ].map((s) => (
              <div
                key={s.num}
                className="rounded-[var(--r-lg)] border border-[var(--line)] bg-white p-7"
              >
                <div
                  className="flex h-[34px] w-[34px] items-center justify-center rounded-full font-display text-[14px] font-extrabold text-white"
                  style={{ background: s.color }}
                >
                  {s.num}
                </div>
                <h4 className="mt-5 font-display text-[22px] font-extrabold tracking-tight">
                  {s.title}
                </h4>
                <p className="mt-2 text-[15px] font-medium leading-[1.5] text-[var(--ink-2)]">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== OPEN SOURCE ===== */}
      <section className="overflow-hidden bg-[var(--dark)] text-[#f3f1ea]">
        <div className="mx-auto grid max-w-[1180px] items-center gap-10 px-6 py-24 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <span
              className="font-display text-[13px] font-bold uppercase tracking-[0.13em]"
              style={{ color: 'var(--c-green)' }}
            >
              ◆ open source
            </span>
            <h2
              className="font-display font-extrabold text-white"
              style={{
                fontSize: 'clamp(34px, 5vw, 58px)',
                lineHeight: 1.02,
                letterSpacing: '-0.03em',
                marginTop: 14,
              }}
            >
              Free. Open source.
              <br />
              Yours to fork.
            </h2>
            <p className="mt-4 text-[19px] font-medium leading-[1.5] text-[#bdbab0]">
              No black box. wwxd is MIT-licensed. Read the prompts, pick your provider, run it
              on your own machine, and send a PR when you make it better.
            </p>
            <div className="mt-8 flex flex-wrap gap-8">
              {[
                { b: 'MIT', s: 'license' },
                { b: 'Tweets · Essays · YouTube', s: 'sources' },
                { b: 'Anthropic · OpenAI · Ollama', s: 'any provider' },
              ].map(({ b, s }) => (
                <div key={s} className="flex flex-col">
                  <b className="font-display text-[28px] font-extrabold text-white">{b}</b>
                  <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#9b988e]">
                    {s}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 font-display text-[16px] font-bold text-[var(--ink)] transition hover:-translate-y-0.5"
              >
                <GhIcon size={18} />
                View on GitHub
              </a>
            </div>
          </div>
          <div>
            <div
              className="rounded-[var(--r-lg)] border border-[#2a2a23] bg-[#0c0b08] p-5 font-mono text-[13px] leading-[1.75] text-[#cfccc0]"
            >
              <div>
                <span style={{ color: '#6b6a60' }}># clone &amp; run wwxd locally</span>
              </div>
              <div>
                <span style={{ color: '#5ad17a' }}>$</span>{' '}git clone github.com/juanfiguera/wwxd
              </div>
              <div>
                <span style={{ color: '#5ad17a' }}>$</span>{' '}cd wwxd &amp;&amp; pnpm install
              </div>
              <div>
                <span style={{ color: '#5ad17a' }}>$</span>{' '}cp .env.example .env.local{' '}
                <span style={{ color: '#6b6a60' }}># add your API keys</span>
              </div>
              <div>
                <span style={{ color: '#5ad17a' }}>$</span>{' '}pnpm dev{' '}
                <span style={{ color: '#6b6a60' }}>— ready on :3000</span>
              </div>
            </div>
            {/* Subset lineup. Steve Jobs's ink (#16140d) would vanish
             * against bg-[var(--dark)], so we recolor him to teal in
             * this lineup only. */}
            <div className="mt-6 flex justify-start gap-1.5">
              {[
                { ...CAST[3], color: 'var(--c-teal)' },
                CAST[6],
                CAST[0],
                CAST[2],
                CAST[7],
              ].map((c, i) => (
                <span
                  key={i}
                  className="wwxd-bob"
                  data-phase={(i % 4).toString()}
                  style={{ display: 'inline-flex', lineHeight: 0 }}
                >
                  <PersonaAvatar color={c.color} crown={c.crown} size={56} eyeColor="#fff" />
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="pt-24 text-center">
        <div className="mx-auto max-w-[1180px] px-6">
          <h2
            className="font-display font-extrabold"
            style={{
              fontSize: 'clamp(36px, 6vw, 70px)',
              lineHeight: 1.02,
              letterSpacing: '-0.03em',
            }}
          >
            So… what{' '}
            <span style={{ color: 'var(--accent)' }}>would</span>{' '}
            they do?
          </h2>
          <p className="mx-auto mt-4 text-[19px] font-medium leading-[1.5] text-[var(--ink-2)]">
            Or rather: what would the AI impression of them say? There&apos;s only one way to find
            out.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--ink)] px-6 py-3.5 font-display text-[16px] font-bold text-white transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-sm)]"
            >
              <GhIcon size={18} />
              View on GitHub
            </a>
          </div>
        </div>
        <div className="relative mt-12 pb-8">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 bottom-8 h-px w-[min(1080px,92vw)] -translate-x-1/2"
            style={{
              background:
                'linear-gradient(90deg,transparent,var(--line) 12%,var(--line) 88%,transparent)',
            }}
          />
          <div className="relative z-[2] mx-auto flex max-w-[1080px] items-end justify-center gap-[clamp(6px,1.6vw,26px)]">
            {CAST.map((c, i) => (
              <span
                key={c.name}
                className={`wwxd-bob ${i >= 6 ? 'hidden sm:inline-flex' : ''} ${i >= 4 ? 'max-[620px]:hidden' : ''} ${i >= 3 ? 'max-[420px]:hidden' : ''}`}
                data-phase={(i % 4).toString()}
                style={{ display: 'inline-flex', lineHeight: 0 }}
              >
                <PersonaAvatar color={c.color} crown={c.crown} size={92} eyeColor="#fff" />
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="mt-16 border-t border-[var(--line)] py-10">
        <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-4 px-6">
          <Link
            href="/"
            className="flex items-center gap-2 font-display text-[21px] font-extrabold tracking-tight"
          >
            <BrandLogo size={26} />
            wwxd
          </Link>
          <div className="flex gap-6">
            <a href="#rooms" className="text-[14px] font-semibold text-[var(--ink-2)] hover:text-[var(--ink)]">
              Rooms
            </a>
            <a href="#wall" className="text-[14px] font-semibold text-[var(--ink-2)] hover:text-[var(--ink)]">
              Personas
            </a>
            <a href="#how" className="text-[14px] font-semibold text-[var(--ink-2)] hover:text-[var(--ink)]">
              How it works
            </a>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="text-[14px] font-semibold text-[var(--ink-2)] hover:text-[var(--ink)]"
            >
              GitHub
            </a>
          </div>
          <div className="text-[13.5px] font-semibold text-[var(--ink-soft)]">
            What Would X Do · MIT licensed · made in the open
          </div>
        </div>
        <div className="mx-auto mt-6 max-w-[1180px] border-t border-dashed border-[var(--line)] px-6 pt-5 text-[12.5px] leading-snug text-[var(--ink-soft)]">
          <strong className="font-display font-bold text-[var(--ink-2)]">
            AI impressions, not the real people.
          </strong>{' '}
          wwxd produces AI-generated impressions trained on each person&apos;s publicly available
          writing. These impressions are not real, are not endorsed by the people they reference,
          and may misrepresent their views. Don&apos;t treat outputs as quotes.
        </div>
      </footer>
    </div>
  );
}
