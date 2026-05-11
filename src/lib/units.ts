/**
 * Metric-only unit system for meal-plan ingredients.
 * Three families: mass, volume, count. We never convert between families.
 */

export type UnitFamily = "mass" | "volume" | "count";

export type Unit =
  | "mg"
  | "g"
  | "kg"
  | "ml"
  | "l"
  | "piece"
  | "tsp"
  | "tbsp"
  | "cup";

export interface UnitMeta {
  value: Unit;
  label: string;
  family: UnitFamily;
  /** How many of the family's base unit (g for mass, ml for volume, piece for count). */
  toBase: number;
}

/** A pragmatic metric kitchen set. tsp / tbsp / cup are metric culinary
 *  cups (5 ml / 15 ml / 250 ml) so they convert cleanly to ml. */
export const UNITS: UnitMeta[] = [
  { value: "mg", label: "mg", family: "mass", toBase: 0.001 },
  { value: "g", label: "g", family: "mass", toBase: 1 },
  { value: "kg", label: "kg", family: "mass", toBase: 1000 },
  { value: "ml", label: "ml", family: "volume", toBase: 1 },
  { value: "l", label: "l", family: "volume", toBase: 1000 },
  { value: "tsp", label: "tsp (5 ml)", family: "volume", toBase: 5 },
  { value: "tbsp", label: "tbsp (15 ml)", family: "volume", toBase: 15 },
  { value: "cup", label: "cup (250 ml)", family: "volume", toBase: 250 },
  { value: "piece", label: "piece", family: "count", toBase: 1 },
];

const BY_VALUE = new Map(UNITS.map((u) => [u.value, u]));

export function getUnit(value: Unit): UnitMeta {
  const u = BY_VALUE.get(value);
  if (!u) throw new Error(`Unknown unit: ${value}`);
  return u;
}

export function unitsForFamily(family: UnitFamily): UnitMeta[] {
  return UNITS.filter((u) => u.family === family);
}

/** Convert `amount` from `unit` to that unit family's base unit. */
export function toBase(amount: number, unit: Unit): number {
  return amount * getUnit(unit).toBase;
}

/**
 * Format an amount in a base unit (g for mass, ml for volume, piece for
 * count) using a human-friendly unit. Prefers kg / l for large values.
 */
export function formatFromBase(baseAmount: number, family: UnitFamily): string {
  if (family === "mass") {
    if (Math.abs(baseAmount) >= 1000) {
      return `${trimZero(baseAmount / 1000)} kg`;
    }
    if (Math.abs(baseAmount) < 1) {
      return `${trimZero(baseAmount * 1000)} mg`;
    }
    return `${trimZero(baseAmount)} g`;
  }
  if (family === "volume") {
    if (Math.abs(baseAmount) >= 1000) {
      return `${trimZero(baseAmount / 1000)} l`;
    }
    return `${trimZero(baseAmount)} ml`;
  }
  // count
  return `${trimZero(baseAmount)} ${baseAmount === 1 ? "piece" : "pieces"}`;
}

function trimZero(n: number): string {
  // up to 2 decimals, drop trailing zeros
  const rounded = Math.round(n * 100) / 100;
  return rounded
    .toFixed(2)
    .replace(/\.?0+$/, "")
    .replace(/^-0$/, "0");
}
