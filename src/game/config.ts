export type Zone = "floor" | "arch";

export type DecorationKind =
  | "flowers"
  | "diya"
  | "lights"
  | "toran"
  | "garland"
  | "modak"
  | "rangoli"
  | "petals"
  | "utsav";

export interface DecorationDef {
  kind: DecorationKind;
  label: string;
  icon: string;
  points: number;
  zone: Zone;
  /** minimum distance to another decoration of any kind */
  spacing: number;
  hint: string;
}

export const DECORATIONS: DecorationDef[] = [
  { kind: "flowers", label: "Flowers", icon: "🌸", points: 10, zone: "floor", spacing: 0.7, hint: "Marigold cluster" },
  { kind: "diya", label: "Diya", icon: "🪔", points: 15, zone: "floor", spacing: 0.6, hint: "Lit brass lamp" },
  { kind: "lights", label: "Lights", icon: "💡", points: 15, zone: "arch", spacing: 0.9, hint: "String lights" },
  { kind: "toran", label: "Toran", icon: "🌿", points: 25, zone: "arch", spacing: 1.1, hint: "Leaf hanging" },
  { kind: "garland", label: "Garland", icon: "🏵️", points: 20, zone: "arch", spacing: 1.0, hint: "Flower garland" },
  { kind: "modak", label: "Modak", icon: "🍬", points: 10, zone: "floor", spacing: 0.5, hint: "Bappa's favourite" },
  { kind: "rangoli", label: "Rangoli", icon: "✨", points: 30, zone: "floor", spacing: 1.6, hint: "Best in the centre" },
  { kind: "petals", label: "Petals", icon: "🌺", points: 10, zone: "floor", spacing: 0.6, hint: "Scattered petals" },
  { kind: "utsav", label: "Utsav", icon: "🎊", points: 40, zone: "floor", spacing: 1.4, hint: "Festive centrepiece" },
];

export const DECORATION_MAP: Record<DecorationKind, DecorationDef> = Object.fromEntries(
  DECORATIONS.map((d) => [d.kind, d]),
) as Record<DecorationKind, DecorationDef>;

export const GAME_SECONDS = 60;

/** Floor placement ring around the idol platform. */
export const FLOOR_INNER = 1.7;
export const FLOOR_OUTER = 6.2;
/** Arch band (hanging decorations) radius + height. */
export const ARCH_RADIUS = 5.4;
export const ARCH_Y = 4.1;

export interface Challenge {
  id: string;
  label: string;
  reward: number;
  test: (counts: Record<DecorationKind, number>, ctx: { centerRangoli: boolean; symmetry: number }) => boolean;
}

export const CHALLENGE_POOL: Challenge[] = [
  { id: "diyas3", label: "Light at least 3 diyas", reward: 50, test: (c) => c.diya >= 3 },
  { id: "flowers4", label: "Create a flower arrangement (4 flowers)", reward: 50, test: (c) => c.flowers >= 4 },
  { id: "garland2", label: "Hang 2 garlands", reward: 60, test: (c) => c.garland >= 2 },
  { id: "rangoli", label: "Place a rangoli in the centre", reward: 60, test: (_c, ctx) => ctx.centerRangoli },
  { id: "toran", label: "Hang a toran over the mandap", reward: 40, test: (c) => c.toran >= 1 },
  { id: "modak5", label: "Offer 5 modaks to Bappa", reward: 50, test: (c) => c.modak >= 5 },
  { id: "symmetry", label: "Keep the mandap balanced", reward: 70, test: (_c, ctx) => ctx.symmetry > 0.72 },
  { id: "lights2", label: "Add 2 sets of decorative lights", reward: 45, test: (c) => c.lights >= 2 },
];

export function pickChallenges(count = 3): Challenge[] {
  const pool = [...CHALLENGE_POOL];
  const out: Challenge[] = [];
  while (out.length < count && pool.length) {
    out.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]!);
  }
  return out;
}
