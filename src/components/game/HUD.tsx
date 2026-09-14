import { useEffect, useRef, useState } from "react";
import { DECORATIONS, DECORATION_MAP, GAME_SECONDS, type DecorationKind } from "@/game/config";
import { useGame } from "@/game/store";
import { sfx, unlockAudio } from "@/game/audio";
import { stars } from "@/game/scoring";

/* ---------- shared bits ---------- */

function BlessingMeter({ value }: { value: number }) {
  return (
    <div className="w-36 sm:w-44">
      <div className="mb-0.5 flex items-center justify-between text-[10px] font-semibold tracking-widest text-amber-200/90 uppercase">
        <span>🙏 Blessing</span>
        <span>{value}%</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-black/50 ring-1 ring-amber-200/20">
        <div
          className="h-full rounded-full bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-200 transition-[width] duration-300"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      aria-label={label}
      title={label}
      onClick={onClick}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-lg text-amber-100 ring-1 ring-amber-200/25 backdrop-blur transition hover:bg-black/70 hover:ring-amber-300/60 active:scale-95"
    >
      {children}
    </button>
  );
}

/* ---------- top bar ---------- */

function TopBar({ onHelp }: { onHelp: () => void }) {
  const timeLeft = useGame((s) => s.timeLeft);
  const score = useGame((s) => s.score);
  const best = useGame((s) => s.best);
  const soundOn = useGame((s) => s.soundOn);
  const toggleSound = useGame((s) => s.toggleSound);
  const undo = useGame((s) => s.undo);
  const endGame = useGame((s) => s.endGame);
  const phase = useGame((s) => s.phase);
  const lastInvalidAt = useGame((s) => s.lastInvalidAt);

  const [shake, setShake] = useState(false);
  const warned = useRef(false);

  const urgent = timeLeft <= 10 && phase === "playing";

  useEffect(() => {
    if (!lastInvalidAt) return;
    setShake(true);
    const t = setTimeout(() => setShake(false), 350);
    return () => clearTimeout(t);
  }, [lastInvalidAt]);

  useEffect(() => {
    if (urgent && !warned.current && soundOn) {
      warned.current = true;
      sfx.tickWarn();
    }
    if (!urgent) warned.current = false;
  }, [urgent, soundOn, Math.ceil(timeLeft)]);

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-2 p-3 sm:p-4">
      {/* timer */}
      <div
        className={`pointer-events-auto rounded-2xl bg-black/55 px-4 py-2 text-center ring-1 ring-amber-200/25 backdrop-blur ${shake ? "animate-[shake_0.3s_ease]" : ""}`}
      >
        <div className="text-[10px] font-semibold tracking-widest text-amber-200/80 uppercase">Time</div>
        <div
          className={`font-mono text-2xl leading-none font-bold tabular-nums ${urgent ? "animate-pulse text-red-400" : "text-amber-100"}`}
        >
          {Math.ceil(timeLeft)}
        </div>
      </div>

      {/* score + blessing */}
      <div className="pointer-events-auto flex flex-col items-center gap-1.5 rounded-2xl bg-black/55 px-5 py-2 ring-1 ring-amber-200/25 backdrop-blur">
        <div className="flex items-baseline gap-3">
          <div className="text-center">
            <div className="text-[10px] font-semibold tracking-widest text-amber-200/80 uppercase">Score</div>
            <div className="font-mono text-2xl leading-none font-bold text-amber-100 tabular-nums">{score.total}</div>
          </div>
          <div className="text-center">
            <div className="text-[10px] font-semibold tracking-widest text-amber-200/60 uppercase">Best</div>
            <div className="font-mono text-sm leading-none font-semibold text-amber-200/80 tabular-nums">{best}</div>
          </div>
        </div>
        <BlessingMeter value={score.blessing} />
      </div>

      {/* actions */}
      <div className="pointer-events-auto flex gap-2">
        <IconButton label="Undo last decoration" onClick={undo}>
          ↩️
        </IconButton>
        <IconButton label={soundOn ? "Mute sound" : "Enable sound"} onClick={toggleSound}>
          {soundOn ? "🔔" : "🔕"}
        </IconButton>
        <IconButton label="How to play" onClick={onHelp}>
          ❓
        </IconButton>
        {phase === "playing" && (
          <button
            onClick={() => endGame()}
            className="h-10 rounded-full bg-gradient-to-b from-amber-500 to-orange-600 px-4 text-sm font-bold text-white shadow-lg ring-1 ring-amber-300/50 transition hover:brightness-110 active:scale-95"
          >
            Finish 🙏
          </button>
        )}
      </div>
    </div>
  );
}

/* ---------- challenges ---------- */

function ChallengeList() {
  const challenges = useGame((s) => s.challenges);
  const score = useGame((s) => s.score);
  if (!challenges.length) return null;
  return (
    <div className="pointer-events-none absolute top-24 left-3 z-20 hidden w-56 rounded-2xl bg-black/50 p-3 ring-1 ring-amber-200/20 backdrop-blur sm:block">
      <div className="mb-2 text-[10px] font-bold tracking-widest text-amber-200/80 uppercase">🎯 Challenges</div>
      <ul className="space-y-1.5">
        {challenges.map((c) => {
          const done = c.test(score.counts, { centerRangoli: score.centerRangoli, symmetry: score.symmetry });
          return (
            <li key={c.id} className={`flex items-start gap-1.5 text-xs ${done ? "text-green-300" : "text-amber-100/85"}`}>
              <span>{done ? "✅" : "⬜"}</span>
              <span className="flex-1">{c.label}</span>
              <span className="text-amber-300/80">+{c.reward}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ---------- live bonus ticker ---------- */

function BonusNotes() {
  const notes = useGame((s) => s.score.notes);
  if (!notes.length) return null;
  return (
    <div className="pointer-events-none absolute top-24 right-3 z-20 hidden w-48 space-y-1 text-right sm:block">
      {notes.slice(-4).map((n, i) => (
        <div
          key={`${n}-${i}`}
          className={`ml-auto w-fit rounded-full px-3 py-1 text-xs font-semibold backdrop-blur ${
            n.startsWith("Crowded") ? "bg-red-950/70 text-red-300" : "bg-emerald-950/70 text-emerald-300"
          }`}
        >
          {n}
        </div>
      ))}
    </div>
  );
}

/* ---------- toolbar ---------- */

function Toolbar() {
  const selected = useGame((s) => s.selected);
  const select = useGame((s) => s.select);
  const soundOn = useGame((s) => s.soundOn);

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center p-3 sm:p-4">
      <div className="pointer-events-auto flex max-w-full gap-1.5 overflow-x-auto rounded-2xl bg-black/60 p-2 ring-1 ring-amber-200/25 backdrop-blur sm:gap-2">
        {DECORATIONS.map((d) => {
          const active = selected === d.kind;
          return (
            <button
              key={d.kind}
              onClick={() => {
                select(active ? null : (d.kind as DecorationKind));
                if (soundOn && !active) sfx.place();
              }}
              className={`group flex w-16 shrink-0 flex-col items-center rounded-xl px-1 py-2 transition active:scale-95 sm:w-20 ${
                active
                  ? "bg-gradient-to-b from-amber-400 to-orange-500 shadow-lg shadow-orange-900/50 ring-2 ring-yellow-200"
                  : "bg-white/5 ring-1 ring-amber-200/15 hover:bg-white/10"
              }`}
              title={d.hint}
            >
              <span className="text-xl sm:text-2xl">{d.icon}</span>
              <span className={`mt-0.5 text-[10px] font-semibold ${active ? "text-white" : "text-amber-100/90"}`}>
                {d.label}
              </span>
              <span className={`text-[9px] ${active ? "text-yellow-100" : "text-amber-300/70"}`}>{d.points} pts</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PlacementHint() {
  const selected = useGame((s) => s.selected);
  if (!selected) return null;
  const def = DECORATION_MAP[selected];
  return (
    <div className="pointer-events-none absolute bottom-24 left-1/2 z-10 -translate-x-1/2 rounded-full bg-black/60 px-4 py-1.5 text-xs font-medium text-amber-100 ring-1 ring-amber-200/25 backdrop-blur">
      {def.zone === "arch" ? "Tap the glowing band up high to hang it" : "Tap the glowing floor ring to place it"} ·{" "}
      {def.hint}
    </div>
  );
}

/* ---------- screens ---------- */

function ScreenShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl bg-gradient-to-b from-[#3a1210] to-[#220b08] p-6 text-center shadow-2xl ring-1 ring-amber-300/30 sm:p-8">
        {children}
      </div>
    </div>
  );
}

function PrimaryButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="rounded-full bg-gradient-to-b from-amber-400 to-orange-600 px-8 py-3 text-lg font-bold text-white shadow-xl shadow-orange-950/60 ring-2 ring-yellow-200/70 transition hover:scale-105 hover:brightness-110 active:scale-95"
    >
      {children}
    </button>
  );
}

function StartScreen({ onHelp }: { onHelp: () => void }) {
  const startGame = useGame((s) => s.startGame);
  const best = useGame((s) => s.best);
  const soundOn = useGame((s) => s.soundOn);
  return (
    <ScreenShell>
      <div className="text-5xl">🕉️</div>
      <h1 className="mt-2 bg-gradient-to-b from-yellow-200 via-amber-300 to-orange-400 bg-clip-text text-3xl font-black tracking-tight text-transparent sm:text-4xl">
        BAPPA MANDAP CHALLENGE
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-amber-100/85">
        Ganpati Bappa has arrived! You have <b className="text-amber-300">{GAME_SECONDS} seconds</b> to decorate the
        mandap — flowers, diyas, rangoli, garlands and more. Earn combos, complete challenges and fill Bappa's{" "}
        <b className="text-amber-300">Blessing Meter</b>.
      </p>
      {best > 0 && (
        <p className="mt-3 text-xs font-semibold tracking-widest text-amber-300/80 uppercase">🏆 Your best: {best}</p>
      )}
      <div className="mt-6 flex flex-col items-center gap-3">
        <PrimaryButton
          onClick={() => {
            unlockAudio();
            if (soundOn) sfx.start();
            startGame();
          }}
        >
          Begin Decorating 🌸
        </PrimaryButton>
        <button
          onClick={onHelp}
          className="text-sm font-semibold text-amber-200/80 underline-offset-4 transition hover:text-amber-100 hover:underline"
        >
          How to play
        </button>
      </div>
    </ScreenShell>
  );
}

function HowToPlay({ onClose }: { onClose: () => void }) {
  return (
    <ScreenShell>
      <h2 className="text-2xl font-black text-amber-200">How to Play</h2>
      <ul className="mt-4 space-y-2.5 text-left text-sm leading-relaxed text-amber-100/85">
        <li>🎯 <b>Pick</b> a decoration from the tray at the bottom.</li>
        <li>👆 <b>Tap / click</b> the glowing zone to place it — floor items go around the idol, hangings go up on the arch band.</li>
        <li>✨ <b>Combos:</b> flowers near diyas, garlands with torans, rangoli at the centre, and a balanced left–right layout all earn bonus points.</li>
        <li>⚠️ <b>Crowding costs points</b> — spread your decorations out. Use ↩️ to undo.</li>
        <li>🎯 Complete the <b>3 challenges</b> before time runs out for big rewards.</li>
        <li>🙏 Fill the <b>Blessing Meter</b> with decoration, creativity and balance.</li>
        <li>🖱️ Drag to orbit the camera, scroll to zoom.</li>
      </ul>
      <div className="mt-6">
        <PrimaryButton onClick={onClose}>Got it!</PrimaryButton>
      </div>
    </ScreenShell>
  );
}

function ResultScreen() {
  const score = useGame((s) => s.score);
  const best = useGame((s) => s.best);
  const newBest = useGame((s) => s.newBest);
  const challenges = useGame((s) => s.challenges);
  const startGame = useGame((s) => s.startGame);
  const setPhase = useGame((s) => s.setPhase);
  const soundOn = useGame((s) => s.soundOn);
  const played = useRef(false);

  useEffect(() => {
    if (!played.current && soundOn) {
      played.current = true;
      sfx.celebrate();
      setTimeout(() => sfx.bell(), 500);
    }
  }, [soundOn]);

  const n = stars(score.total);
  const verdict =
    n >= 5 ? "Bappa is overjoyed! 🥹" : n >= 4 ? "A divine mandap! ✨" : n >= 3 ? "Beautiful work! 🌼" : n >= 2 ? "A lovely start 🌸" : "Keep practicing 🙏";

  const bar = (label: string, v: number, icon: string) => (
    <div className="flex items-center gap-2 text-left">
      <span className="w-24 text-xs font-semibold text-amber-100/90">
        {icon} {label}
      </span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-black/50">
        <div
          className="h-full rounded-full bg-gradient-to-r from-orange-500 to-yellow-300 transition-[width] duration-700"
          style={{ width: `${v}%` }}
        />
      </div>
      <span className="w-8 text-right font-mono text-xs text-amber-200">{v}</span>
    </div>
  );

  return (
    <ScreenShell>
      <div className="text-4xl">🎉</div>
      <h2 className="mt-1 text-2xl font-black text-amber-200">{verdict}</h2>
      <div className="mt-1 text-2xl tracking-widest text-amber-300">
        {Array.from({ length: 5 }, (_, i) => (i < n ? "★" : "☆")).join("")}
      </div>

      <div className="mt-4 flex items-baseline justify-center gap-3">
        <span className="font-mono text-5xl font-black text-amber-100 tabular-nums">{score.total}</span>
        <span className="text-sm text-amber-200/80">points</span>
        {newBest && (
          <span className="rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-3 py-1 text-xs font-black text-white">
            NEW BEST! 🏆
          </span>
        )}
      </div>
      {!newBest && best > 0 && <p className="mt-1 text-xs text-amber-200/70">Best: {best}</p>}

      <div className="mx-auto mt-5 max-w-sm space-y-2">
        {bar("Decoration", score.decoration, "🌸")}
        {bar("Creativity", score.creativity, "🎨")}
        {bar("Balance", score.balance, "⚖️")}
        {bar("Blessing", score.blessing, "🙏")}
      </div>

      <div className="mx-auto mt-4 max-w-sm space-y-1 text-left">
        <div className="text-[10px] font-bold tracking-widest text-amber-200/70 uppercase">Challenges</div>
        {challenges.map((c) => {
          const done = c.test(score.counts, { centerRangoli: score.centerRangoli, symmetry: score.symmetry });
          return (
            <div key={c.id} className={`text-xs ${done ? "text-green-300" : "text-amber-100/50 line-through"}`}>
              {done ? "✅" : "❌"} {c.label} {done && <span className="text-amber-300">+{c.reward}</span>}
            </div>
          );
        })}
      </div>

      {score.notes.length > 0 && (
        <div className="mt-3 flex flex-wrap justify-center gap-1.5">
          {score.notes.map((note, i) => (
            <span
              key={i}
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                note.includes("-") ? "bg-red-900/50 text-red-300" : "bg-emerald-900/50 text-emerald-300"
              }`}
            >
              {note}
            </span>
          ))}
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <PrimaryButton onClick={startGame}>Play Again 🔄</PrimaryButton>
        <button
          onClick={() => setPhase("viewing")}
          className="rounded-full bg-white/10 px-6 py-3 text-sm font-bold text-amber-100 ring-1 ring-amber-200/30 transition hover:bg-white/20 active:scale-95"
        >
          Admire Mandap 🪔
        </button>
      </div>
    </ScreenShell>
  );
}

function ViewingBar() {
  const setPhase = useGame((s) => s.setPhase);
  return (
    <div className="absolute inset-x-0 bottom-6 z-30 flex justify-center">
      <button
        onClick={() => setPhase("result")}
        className="rounded-full bg-black/60 px-6 py-2.5 text-sm font-bold text-amber-100 ring-1 ring-amber-200/30 backdrop-blur transition hover:bg-black/80 active:scale-95"
      >
        ← Back to results
      </button>
    </div>
  );
}

/* ---------- root HUD ---------- */

export function HUD() {
  const phase = useGame((s) => s.phase);
  const loadBest = useGame((s) => s.loadBest);
  const setPhase = useGame((s) => s.setPhase);
  const [help, setHelp] = useState(false);

  useEffect(() => {
    loadBest();
    setPhase("start");
  }, [loadBest, setPhase]);

  if (phase === "loading") return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-10 select-none">
      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}`}</style>

      {phase === "playing" && (
        <>
          <TopBar onHelp={() => setHelp(true)} />
          <ChallengeList />
          <BonusNotes />
          <Toolbar />
          <PlacementHint />
        </>
      )}

      {phase === "start" && <StartScreen onHelp={() => setHelp(true)} />}
      {phase === "result" && <ResultScreen />}
      {phase === "viewing" && <ViewingBar />}
      {help && <HowToPlay onClose={() => setHelp(false)} />}
    </div>
  );
}
