import { formatFromBase, getUnit, toBase, type UnitFamily } from "./units";
import type { MealPlan, Recipe } from "@/types/meals";

export interface ShoppingItem {
  /** Stable key for the checked-off state. */
  key: string;
  name: string;
  family: UnitFamily;
  /** Total amount expressed in the family's base unit (g / ml / piece). */
  baseAmount: number;
  /** Formatted "1.2 kg" / "300 ml" / "4 pieces". */
  display: string;
  /** Source recipes contributing to this line (for the tooltip). */
  sources: string[];
}

/**
 * Build a shopping list from a plan. Sums each recipe's ingredient
 * amounts scaled by the planned servings / recipe servings, groups by
 * (normalised name, unit family), converts to the family's base unit
 * and emits a friendly display string.
 */
export function buildShoppingList(
  plan: MealPlan,
  recipes: Recipe[]
): ShoppingItem[] {
  const recipeById = new Map(recipes.map((r) => [r.id, r]));
  const buckets = new Map<
    string,
    {
      name: string;
      family: UnitFamily;
      baseAmount: number;
      sources: Set<string>;
    }
  >();

  for (const slot of plan.slots) {
    const recipe = recipeById.get(slot.recipeId);
    if (!recipe) continue;
    const scale = recipe.servings > 0 ? slot.servings / recipe.servings : 1;
    for (const ing of recipe.ingredients) {
      const unitMeta = getUnit(ing.unit);
      const family = unitMeta.family;
      const normalisedName = ing.name.trim().toLowerCase();
      const key = `${normalisedName}::${family}`;
      const cur =
        buckets.get(key) ??
        {
          name: titleCase(ing.name.trim()),
          family,
          baseAmount: 0,
          sources: new Set<string>(),
        };
      cur.baseAmount += toBase(ing.amount, ing.unit) * scale;
      cur.sources.add(recipe.name);
      buckets.set(key, cur);
    }
  }

  return [...buckets.entries()]
    .map(([key, b]) => ({
      key,
      name: b.name,
      family: b.family,
      baseAmount: b.baseAmount,
      display: formatFromBase(b.baseAmount, b.family),
      sources: [...b.sources].sort(),
    }))
    .sort((a, b) => {
      if (a.family !== b.family) {
        // mass → volume → count
        return order(a.family) - order(b.family);
      }
      return a.name.localeCompare(b.name);
    });
}

function order(f: UnitFamily): number {
  return { mass: 0, volume: 1, count: 2 }[f];
}

function titleCase(s: string): string {
  return s.replace(/\b\w/g, (m) => m.toUpperCase());
}
