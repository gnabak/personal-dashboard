import { useMealsStore, planDates } from "@/store/meals";
import { MEAL_SLOTS } from "@/types/meals";
import type { MealSlotKind } from "@/types/meals";
import { useTheme } from "@/themes/context";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const NONE = "__none__";

export function PlanEditor({ planId }: { planId: string }) {
  const plan = useMealsStore((s) => s.plans.find((p) => p.id === planId));
  const recipes = useMealsStore((s) => s.recipes);
  const theme = useTheme();
  const slotLabels = theme.copy.meals.slots;

  if (!plan) return null;
  const dates = planDates(plan);
  const slotsByKey = new Map<string, { recipeId: string; servings: number }>();
  for (const sl of plan.slots) {
    slotsByKey.set(`${sl.date}::${sl.kind}`, {
      recipeId: sl.recipeId,
      servings: sl.servings,
    });
  }

  if (recipes.length === 0) {
    return (
      <div className="pd-empty-hint">
        // add some recipes first to fill in the plan
      </div>
    );
  }

  return (
    <div className="overflow-x-auto scrollbar-thin">
      <table className="w-full text-xs border-separate border-spacing-1">
        <thead>
          <tr>
            <th />
            {dates.map((d) => (
              <th
                key={d}
                className="text-left px-2 py-1 text-comment uppercase tracking-wider font-mono whitespace-nowrap"
              >
                {format(new Date(d), "EEE d")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {MEAL_SLOTS.map(({ value: kind }) => (
            <tr key={kind}>
              <td className="text-comment uppercase tracking-wider font-mono text-[11px] pr-2 whitespace-nowrap">
                {slotLabels[kind]}
              </td>
              {dates.map((d) => {
                const cell = slotsByKey.get(`${d}::${kind}`);
                const recipe = cell
                  ? recipes.find((r) => r.id === cell.recipeId)
                  : null;
                return (
                  <SlotCell
                    key={d + kind}
                    date={d}
                    kind={kind}
                    planId={plan.id}
                    selectedRecipeId={cell?.recipeId ?? null}
                    servings={cell?.servings ?? null}
                    recipeColor={recipe?.color}
                  />
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SlotCell({
  date,
  kind,
  planId,
  selectedRecipeId,
  servings,
  recipeColor,
}: {
  date: string;
  kind: MealSlotKind;
  planId: string;
  selectedRecipeId: string | null;
  servings: number | null;
  recipeColor?: string;
}) {
  const recipes = useMealsStore((s) => s.recipes);
  const setSlot = useMealsStore((s) => s.setSlot);
  const recipe = selectedRecipeId
    ? recipes.find((r) => r.id === selectedRecipeId)
    : null;

  return (
    <td className="align-top min-w-[12rem]">
      <div
        className={cn(
          "rounded-md border p-1.5 space-y-1 transition-colors",
          recipe ? "border-border bg-muted/40" : "border-dashed border-border bg-transparent"
        )}
        style={
          recipe && recipeColor
            ? { borderLeft: `3px solid ${recipeColor}` }
            : undefined
        }
      >
        <select
          value={selectedRecipeId ?? NONE}
          onChange={(e) => {
            const v = e.target.value;
            if (v === NONE) setSlot(planId, date, kind, null);
            else
              setSlot(
                planId,
                date,
                kind,
                v,
                servings ?? recipes.find((r) => r.id === v)?.servings ?? 1
              );
          }}
          className="w-full rounded border border-border bg-transparent px-1.5 py-1 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/40"
        >
          <option value={NONE}>—</option>
          {recipes.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
        {recipe && servings != null && (
          <div className="flex items-center gap-1.5 text-[10px] text-comment">
            <span>servings</span>
            <input
              type="number"
              min={1}
              value={servings}
              onChange={(e) => {
                const n = parseInt(e.target.value, 10);
                if (Number.isFinite(n) && n > 0) {
                  setSlot(planId, date, kind, recipe.id, n);
                }
              }}
              className="w-12 rounded border border-border bg-transparent px-1 py-0.5 text-right text-[11px] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/40"
            />
          </div>
        )}
      </div>
    </td>
  );
}
