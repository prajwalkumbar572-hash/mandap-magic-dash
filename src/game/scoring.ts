import { DECORATION_MAP, type DecorationKind, type Challenge } from "./config";

export interface Placement {
  id: number;
  kind: DecorationKind;
  x: number;
  y: number;
  z: number;
  rotation: number;
  scale: number;
  bornAt: number;
}

export interface ScoreBreakdown {
  base: number;
  bonus: number;
  penalty: number;
  total: number;
  blessing: number; // 0..100
  decoration: number; // 0..100
  creativity: number; // 0..100
  balance: number; // 0..100
  notes: string[];
  centerRangoli: boolean;
  symmetry: number;
  counts: Record<DecorationKind, number>;
}

const EMPTY_COUNTS = (): Record<DecorationKind, number> => ({
  flowers: 0,
  diya: 0,
  lights: 0,
  toran: 0,
  garland: 0,
  modak: 0,
  rangoli: 0,
  petals: 0,
  utsav: 0,
});

const dist2 = (a: Placement, b: Placement) => (a.x - b.x) ** 2 + (a.z - b.z) ** 2;

export function evaluate(placements: Placement[], challenges: Challenge[] = []): ScoreBreakdown {
  const counts = EMPTY_COUNTS();
  let base = 0;
  for (const p of placements) {
    counts[p.kind] += 1;
    base += DECORATION_MAP[p.kind].points;
  }

  let bonus = 0;
  let penalty = 0;
  const notes: string[] = [];

  // Flower + diya proximity pairs
  let pairFlowerDiya = 0;
  for (const f of placements.filter((p) => p.kind === "flowers" || p.kind === "petals")) {
    if (placements.some((d) => d.kind === "diya" && dist2(f, d) < 2.6 ** 2)) pairFlowerDiya++;
  }
  if (pairFlowerDiya) {
    const v = Math.min(pairFlowerDiya, 6) * 10;
    bonus += v;
    notes.push(`Flowers beside diyas +${v}`);
  }

  // Garland + toran harmony
  const harmony = Math.min(counts.garland, counts.toran);
  if (harmony) {
    bonus += harmony * 15;
    notes.push(`Garland & toran harmony +${harmony * 15}`);
  }

  // Rangoli in the centre (front of idol)
  const centerRangoli = placements.some(
    (p) => p.kind === "rangoli" && Math.hypot(p.x, p.z - 2.6) < 1.8,
  );
  if (centerRangoli) {
    bonus += 25;
    notes.push("Rangoli at the centre +25");
  }

  // Crowding penalty
  let crowded = 0;
  for (let i = 0; i < placements.length; i++) {
    let near = 0;
    for (let j = 0; j < placements.length; j++) {
      if (i !== j && dist2(placements[i]!, placements[j]!) < 1.1 ** 2) near++;
    }
    if (near >= 3) crowded++;
  }
  if (crowded) {
    const v = Math.min(crowded, 8) * 10;
    penalty += v;
    notes.push(`Crowded corners -${v}`);
  }

  // Symmetry: compare left/right mass
  const left = placements.filter((p) => p.x < -0.2).length;
  const right = placements.filter((p) => p.x > 0.2).length;
  const total = Math.max(1, left + right);
  const symmetry = 1 - Math.abs(left - right) / total;
  if (placements.length >= 6 && symmetry > 0.85) {
    bonus += 50;
    notes.push("Beautiful symmetry +50");
  } else if (placements.length >= 6 && symmetry > 0.7) {
    bonus += 30;
    notes.push("Balanced arrangement +30");
  }

  // Variety / creativity
  const variety = Object.values(counts).filter((c) => c > 0).length;
  if (variety >= 5) {
    bonus += variety * 8;
    notes.push(`Rich variety +${variety * 8}`);
  }

  // Challenges
  for (const ch of challenges) {
    if (ch.test(counts, { centerRangoli, symmetry })) {
      bonus += ch.reward;
    }
  }

  const decoration = Math.min(100, Math.round((placements.length / 18) * 100));
  const creativity = Math.min(100, Math.round((variety / 8) * 100));
  const balance = Math.round(
    Math.max(0, symmetry * 100 - Math.min(40, crowded * 6)) * (placements.length ? 1 : 0),
  );
  const blessing = Math.max(
    0,
    Math.min(100, Math.round(decoration * 0.4 + creativity * 0.25 + balance * 0.35)),
  );

  return {
    base,
    bonus,
    penalty,
    total: Math.max(0, base + bonus - penalty),
    blessing,
    decoration,
    creativity,
    balance,
    notes,
    centerRangoli,
    symmetry,
    counts,
  };
}

export function stars(score: number): number {
  if (score >= 1200) return 5;
  if (score >= 850) return 4;
  if (score >= 550) return 3;
  if (score >= 300) return 2;
  return 1;
}
