import type { Unit } from "@/lib/units";

export interface RecipeIngredient {
  id: string;
  name: string;
  amount: number;
  unit: Unit;
  notes?: string;
}

export interface Recipe {
  id: string;
  name: string;
  description?: string;
  /** Number of portions the ingredient list yields. */
  servings: number;
  /** Optional prep / cook time in minutes (total). */
  totalMinutes?: number;
  ingredients: RecipeIngredient[];
  /** Free-form steps as a single markdown-ish string. */
  steps?: string;
  /** Tag/category, free-form (e.g. "breakfast", "dinner"). */
  tags: string[];
  color: string;
  createdAt: string;
}

/**
 * A meal slot identifies a position in the plan's day. The slot label
 * (the user-defined name like "Breakfast" or "Afternoon snack") is
 * stored directly so plans can define any sequence of slots.
 */
export interface MealSlot {
  id: string;
  /** ISO date yyyy-MM-dd for the specific day in the plan. */
  date: string;
  /** User-defined slot label as it appears in `plan.slotLabels`. */
  kind: string;
  recipeId: string;
  /** Number of portions actually planned (defaults to recipe.servings). */
  servings: number;
}

export type PlanKind = "weekly" | "monthly";

export interface MealPlan {
  id: string;
  title: string;
  kind: PlanKind;
  /** Start date — Monday for weekly, 1st of month for monthly. */
  startDate: string;
  /**
   * Ordered list of slot labels the plan uses (e.g. ["Breakfast",
   * "Later breakfast", "Lunch", "Afternoon snack", "Dinner"]).
   */
  slotLabels: string[];
  notes?: string;
  slots: MealSlot[];
  /** Shopping items the user has ticked off (by aggregation key). */
  checkedKeys: string[];
  createdAt: string;
}

export const DEFAULT_SLOT_LABELS: string[] = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Snack",
];

export const RECIPE_COLORS = [
  "#55dc78",
  "#5fc3f5",
  "#ffa537",
  "#f0c34b",
  "#b89cff",
  "#f48cb1",
  "#ff6e64",
  "#789b64",
];
