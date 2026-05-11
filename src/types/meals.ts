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

export type MealSlotKind = "breakfast" | "lunch" | "dinner" | "snack";

export const MEAL_SLOTS: { value: MealSlotKind; label: string }[] = [
  { value: "breakfast", label: "Breakfast" },
  { value: "lunch", label: "Lunch" },
  { value: "dinner", label: "Dinner" },
  { value: "snack", label: "Snack" },
];

export interface MealSlot {
  id: string;
  /** ISO date yyyy-MM-dd for the specific day in the plan. */
  date: string;
  kind: MealSlotKind;
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
  notes?: string;
  slots: MealSlot[];
  /** Shopping items the user has ticked off (by aggregation key). */
  checkedKeys: string[];
  createdAt: string;
}

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
