let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function tone(freq: number, dur: number, type: OscillatorType, gain: number, delay = 0) {
  const c = getCtx();
  if (!c) return;
  const t0 = c.currentTime + delay;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g).connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

export const sfx = {
  place() {
    tone(660, 0.22, "sine", 0.12);
    tone(990, 0.18, "sine", 0.06, 0.04);
  },
  invalid() {
    tone(180, 0.16, "triangle", 0.07);
  },
  bell() {
    tone(880, 0.9, "sine", 0.09);
    tone(1320, 0.7, "sine", 0.04, 0.03);
  },
  celebrate() {
    [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.5, "sine", 0.09, i * 0.11));
  },
  tickWarn() {
    tone(420, 0.09, "square", 0.03);
  },
  start() {
    tone(392, 0.35, "sine", 0.08);
    tone(587, 0.45, "sine", 0.07, 0.12);
  },
};

export function unlockAudio() {
  getCtx();
}
