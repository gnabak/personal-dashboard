import { useState } from "react";
import { useMealsStore, planDates } from "@/store/meals";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, Pencil, Plus, Trash2 } from "lucide-react";

const NONE = "__none__";

export function PlanEditor({ planId }: { planId: string }) {
  const plan = useMealsStore((s) => s.plans.find((p) => p.id === planId));
  const recipes = useMealsStore((s) => s.recipes);
  const addSlotLabel = useMealsStore((s) => s.addSlotLabel);
  const removeSlotLabel = useMealsStore((s) => s.removeSlotLabel);
  const renameSlotLabel = useMealsStore((s) => s.renameSlotLabel);
  const moveSlotLabel = useMealsStore((s) => s.moveSlotLabel);

  if (!plan) return null;
  const dates = planDates(plan);
  const slotsByKey = new Map<string, { recipeId: string; servings: number }>();
  for (const sl of plan.slots) {
    slotsByKey.set(`${sl.date}::${sl.kind}`, {
      recipeId: sl.recipeId,
      servings: sl.servings,
    });
  }

  return (
    <div className="space-y-4">
      <SlotManager
        labels={plan.slotLabels}
        onAdd={(label) => addSlotLabel(plan.id, label)}
        onRemove={(label) => removeSlotLabel(plan.id, label)}
        onRename={(oldL, newL) => renameSlotLabel(plan.id, oldL, newL)}
        onMove={(label, dir) => moveSlotLabel(plan.id, label, dir)}
      />

      {recipes.length === 0 ? (
        <div className="pd-empty-hint">
          Add some recipes first to fill in the plan.
        </div>
      ) : plan.slotLabels.length === 0 ? (
        <div className="pd-empty-hint">
          Add at least one meal slot above.
        </div>
      ) : (
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
              {plan.slotLabels.map((label) => (
                <tr key={label}>
                  <td className="text-comment uppercase tracking-wider font-mono text-[11px] pr-2 whitespace-nowrap">
                    {label}
                  </td>
                  {dates.map((d) => {
                    const cell = slotsByKey.get(`${d}::${label}`);
                    const recipe = cell
                      ? recipes.find((r) => r.id === cell.recipeId)
                      : null;
                    return (
                      <SlotCell
                        key={d + label}
                        date={d}
                        kind={label}
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
      )}
    </div>
  );
}

function SlotManager({
  labels,
  onAdd,
  onRemove,
  onRename,
  onMove,
}: {
  labels: string[];
  onAdd: (label: string) => void;
  onRemove: (label: string) => void;
  onRename: (oldL: string, newL: string) => void;
  onMove: (label: string, dir: -1 | 1) => void;
}) {
  const [newLabel, setNewLabel] = useState("");

  return (
    <div className="pd-tile--padded space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div className="pd-field-caption">Meal slots</div>
        <span className="text-[11px] text-comment">
          {labels.length} slot{labels.length === 1 ? "" : "s"}
        </span>
      </div>

      {labels.length > 0 && (
        <ul className="flex flex-wrap gap-1.5">
          {labels.map((label, idx) => (
            <SlotChip
              key={label + idx}
              label={label}
              isFirst={idx === 0}
              isLast={idx === labels.length - 1}
              onRemove={() => {
                if (
                  confirm(
                    `Remove the "${label}" slot? Any assigned recipes in this slot will be cleared.`
                  )
                ) {
                  onRemove(label);
                }
              }}
              onRename={(next) => onRename(label, next)}
              onMove={(dir) => onMove(label, dir)}
            />
          ))}
        </ul>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const t = newLabel.trim();
          if (!t) return;
          onAdd(t);
          setNewLabel("");
        }}
        className="flex items-center gap-2"
      >
        <Input
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          placeholder="e.g. Afternoon snack"
          className="max-w-xs"
        />
        <Button type="submit" size="sm" variant="secondary">
          <Plus className="h-3.5 w-3.5" /> Add slot
        </Button>
      </form>
      <p className="text-[11px] text-comment">
        Slots are unique to this plan. Reorder them with the arrows, rename
        with the pencil, or remove with the trash icon.
      </p>
    </div>
  );
}

function SlotChip({
  label,
  isFirst,
  isLast,
  onRemove,
  onRename,
  onMove,
}: {
  label: string;
  isFirst: boolean;
  isLast: boolean;
  onRemove: () => void;
  onRename: (next: string) => void;
  onMove: (dir: -1 | 1) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(label);

  if (editing) {
    return (
      <li className="flex items-center gap-1 rounded border border-emphasis bg-muted px-1.5 py-0.5">
        <input
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={() => {
            const trimmed = value.trim();
            if (trimmed && trimmed !== label) onRename(trimmed);
            setEditing(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") (e.target as HTMLInputElement).blur();
            if (e.key === "Escape") {
              setValue(label);
              setEditing(false);
            }
          }}
          className="bg-transparent text-xs focus:outline-none w-32"
        />
      </li>
    );
  }

  return (
    <li className="flex items-center gap-0.5 rounded border border-border bg-muted/60 px-1.5 py-0.5 text-xs">
      <button
        type="button"
        onClick={() => onMove(-1)}
        disabled={isFirst}
        className="text-comment hover:text-foreground disabled:opacity-30"
        aria-label="Move up"
      >
        <ChevronUp className="h-3 w-3" />
      </button>
      <button
        type="button"
        onClick={() => onMove(1)}
        disabled={isLast}
        className="text-comment hover:text-foreground disabled:opacity-30"
        aria-label="Move down"
      >
        <ChevronDown className="h-3 w-3" />
      </button>
      <span className="mx-1">{label}</span>
      <button
        type="button"
        onClick={() => {
          setValue(label);
          setEditing(true);
        }}
        className="text-comment hover:text-foreground"
        aria-label="Rename slot"
      >
        <Pencil className="h-3 w-3" />
      </button>
      <button
        type="button"
        onClick={onRemove}
        className="text-comment hover:text-destructive"
        aria-label="Remove slot"
      >
        <Trash2 className="h-3 w-3" />
      </button>
    </li>
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
  kind: string;
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
          recipe
            ? "border-border bg-muted/40"
            : "border-dashed border-border bg-transparent"
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
