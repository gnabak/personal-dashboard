import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { nanoid } from "nanoid";
import type {
  MealPlan,
  MealSlot,
  MealSlotKind,
  PlanKind,
  Recipe,
  RecipeIngredient,
} from "@/types/meals";
import { RECIPE_COLORS } from "@/types/meals";

interface MealsState {
  recipes: Recipe[];
  plans: MealPlan[];

  // Recipes
  addRecipe: (
    data: Omit<Recipe, "id" | "createdAt" | "color"> & {
      color?: string;
    }
  ) => string;
  updateRecipe: (id: string, patch: Partial<Recipe>) => void;
  deleteRecipe: (id: string) => void;

  // Plans
  addPlan: (
    data: Omit<MealPlan, "id" | "createdAt" | "slots" | "checkedKeys">
  ) => string;
  updatePlan: (id: string, patch: Partial<MealPlan>) => void;
  deletePlan: (id: string) => void;

  // Slots (assign / clear a recipe for a given day+slot)
  setSlot: (
    planId: string,
    date: string,
    kind: MealSlotKind,
    recipeId: string | null,
    servings?: number
  ) => void;

  // Shopping checkbox state
  toggleChecked: (planId: string, key: string) => void;
  clearChecked: (planId: string) => void;
}

function pickColor(): string {
  return RECIPE_COLORS[Math.floor(Math.random() * RECIPE_COLORS.length)];
}

export const useMealsStore = create<MealsState>()(
  persist(
    (set) => ({
      recipes: [],
      plans: [],

      addRecipe: (data) => {
        const id = nanoid();
        const ingredients: RecipeIngredient[] = data.ingredients.map((i) => ({
          ...i,
          id: i.id ?? nanoid(),
        }));
        set((s) => ({
          recipes: [
            {
              id,
              name: data.name,
              description: data.description,
              servings: data.servings,
              totalMinutes: data.totalMinutes,
              ingredients,
              steps: data.steps,
              tags: data.tags,
              color: data.color ?? pickColor(),
              createdAt: new Date().toISOString(),
            },
            ...s.recipes,
          ],
        }));
        return id;
      },

      updateRecipe: (id, patch) =>
        set((s) => ({
          recipes: s.recipes.map((r) => {
            if (r.id !== id) return r;
            const next: Recipe = { ...r, ...patch };
            // Re-stamp ingredient ids defensively
            if (patch.ingredients) {
              next.ingredients = patch.ingredients.map((i) => ({
                ...i,
                id: i.id ?? nanoid(),
              }));
            }
            return next;
          }),
        })),

      deleteRecipe: (id) =>
        set((s) => ({
          recipes: s.recipes.filter((r) => r.id !== id),
          // Drop slots that referenced this recipe
          plans: s.plans.map((p) => ({
            ...p,
            slots: p.slots.filter((sl) => sl.recipeId !== id),
          })),
        })),

      addPlan: (data) => {
        const id = nanoid();
        set((s) => ({
          plans: [
            {
              id,
              title: data.title,
              kind: data.kind as PlanKind,
              startDate: data.startDate,
              notes: data.notes,
              slots: [],
              checkedKeys: [],
              createdAt: new Date().toISOString(),
            },
            ...s.plans,
          ],
        }));
        return id;
      },

      updatePlan: (id, patch) =>
        set((s) => ({
          plans: s.plans.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        })),

      deletePlan: (id) =>
        set((s) => ({ plans: s.plans.filter((p) => p.id !== id) })),

      setSlot: (planId, date, kind, recipeId, servings) =>
        set((s) => ({
          plans: s.plans.map((p) => {
            if (p.id !== planId) return p;
            const without = p.slots.filter(
              (sl) => !(sl.date === date && sl.kind === kind)
            );
            if (!recipeId) return { ...p, slots: without };
            const newSlot: MealSlot = {
              id: nanoid(),
              date,
              kind,
              recipeId,
              servings: servings ?? 1,
            };
            return { ...p, slots: [...without, newSlot] };
          }),
        })),

      toggleChecked: (planId, key) =>
        set((s) => ({
          plans: s.plans.map((p) => {
            if (p.id !== planId) return p;
            const has = p.checkedKeys.includes(key);
            return {
              ...p,
              checkedKeys: has
                ? p.checkedKeys.filter((k) => k !== key)
                : [...p.checkedKeys, key],
            };
          }),
        })),

      clearChecked: (planId) =>
        set((s) => ({
          plans: s.plans.map((p) =>
            p.id === planId ? { ...p, checkedKeys: [] } : p
          ),
        })),
    }),
    {
      name: "pd.meals.v1",
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
);

/** Generate dates for a plan based on its kind + start. */
export function planDates(plan: MealPlan): string[] {
  const start = new Date(plan.startDate);
  if (Number.isNaN(start.getTime())) return [];
  const dates: string[] = [];
  const count = plan.kind === "weekly" ? 7 : daysInMonth(start);
  for (let i = 0; i < count; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    dates.push(toISODate(d));
  }
  return dates;
}

export function toISODate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function daysInMonth(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
}

/** Compute the Monday on/before `date` (yyyy-MM-dd). */
export function mondayOf(date: Date): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day + 6) % 7;
  d.setDate(d.getDate() - diff);
  return toISODate(d);
}

/** First day of `date`'s month (yyyy-MM-dd). */
export function firstOfMonth(date: Date): string {
  const d = new Date(date.getFullYear(), date.getMonth(), 1);
  return toISODate(d);
}
