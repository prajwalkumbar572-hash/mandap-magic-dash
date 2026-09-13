import { create } from "zustand";
import {
  DECORATION_MAP,
  FLOOR_INNER,
  FLOOR_OUTER,
  GAME_SECONDS,
  pickChallenges,
  type Challenge,
  type DecorationKind,
} from "./config";
import { evaluate, type Placement, type ScoreBreakdown } from "./scoring";

export type Phase = "loading" | "start" | "playing" | "result" | "viewing";

interface GameState {
  phase: Phase;
  timeLeft: number;
  placements: Placement[];
  selected: DecorationKind | null;
  challenges: Challenge[];
  score: ScoreBreakdown;
  best: number;
  newBest: boolean;
  soundOn: boolean;
  seed: number;
  lastInvalidAt: number;
  setPhase: (p: Phase) => void;
  startGame: () => void;
  tick: (dt: number) => void;
  select: (k: DecorationKind | null) => void;
  tryPlace: (kind: DecorationKind, x: number, z: number, y: number) => boolean;
  undo: () => void;
  flagInvalid: () => void;
  toggleSound: () => void;
  loadBest: () => void;
  endGame: () => void;
}

const EMPTY = evaluate([]);

export function isValidSpot(
  placements: Placement[],
  kind: DecorationKind,
  x: number,
  z: number,
): boolean {
  const def = DECORATION_MAP[kind];
  const r = Math.hypot(x, z);
  if (def.zone === "floor") {
    if (r < FLOOR_INNER || r > FLOOR_OUTER) return false;
  }
  for (const p of placements) {
    const need = Math.max(def.spacing, DECORATION_MAP[p.kind].spacing) * 0.85;
    if ((p.x - x) ** 2 + (p.z - z) ** 2 < need ** 2) return false;
  }
  return true;
}

export const useGame = create<GameState>((set, get) => ({
  phase: "loading",
  timeLeft: GAME_SECONDS,
  placements: [],
  selected: null,
  challenges: [],
  score: EMPTY,
  best: 0,
  newBest: false,
  soundOn: false,
  seed: 1,
  lastInvalidAt: 0,

  setPhase: (p) => set({ phase: p }),

  loadBest: () => {
    try {
      const v = Number(localStorage.getItem("bappa-best") ?? "0");
      if (!Number.isNaN(v)) set({ best: v });
    } catch {
      /* ignore */
    }
  },

  startGame: () =>
    set({
      phase: "playing",
      timeLeft: GAME_SECONDS,
      placements: [],
      selected: null,
      challenges: pickChallenges(3),
      score: EMPTY,
      newBest: false,
      seed: Math.floor(Math.random() * 100000),
    }),

  tick: (dt) => {
    const { phase, timeLeft } = get();
    if (phase !== "playing") return;
    const next = timeLeft - dt;
    if (next <= 0) {
      set({ timeLeft: 0 });
      get().endGame();
    } else {
      set({ timeLeft: next });
    }
  },

  endGame: () => {
    const { score, best } = get();
    const newBest = score.total > best;
    if (newBest) {
      try {
        localStorage.setItem("bappa-best", String(score.total));
      } catch {
        /* ignore */
      }
    }
    set({
      phase: "result",
      selected: null,
      newBest,
      best: newBest ? score.total : best,
    });
  },

  select: (k) => set({ selected: k }),

  flagInvalid: () => set({ lastInvalidAt: Date.now() }),

  tryPlace: (kind, x, z, y) => {
    const { placements, phase, challenges } = get();
    if (phase !== "playing") return false;
    if (!isValidSpot(placements, kind, x, z)) {
      set({ lastInvalidAt: Date.now() });
      return false;
    }
    const next: Placement[] = [
      ...placements,
      {
        id: Date.now() + Math.random(),
        kind,
        x,
        y,
        z,
        rotation: Math.random() * Math.PI * 2,
        scale: 0.92 + Math.random() * 0.16,
        bornAt: performance.now(),
      },
    ];
    set({ placements: next, score: evaluate(next, challenges) });
    return true;
  },

  undo: () => {
    const { placements, challenges, phase } = get();
    if (phase !== "playing" || !placements.length) return;
    const next = placements.slice(0, -1);
    set({ placements: next, score: evaluate(next, challenges) });
  },

  toggleSound: () => set((s) => ({ soundOn: !s.soundOn })),
}));
