import { useMemo, useState } from "react";
import { useMealsStore } from "@/store/meals";
import { buildShoppingList } from "@/lib/shoppingList";
import { Button } from "@/components/ui/Button";
import { Check, Copy, Eraser } from "lucide-react";
import { useTheme } from "@/themes/context";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { format } from "date-fns";

const FAMILY_LABEL: Record<string, string> = {
  mass: "Mass",
  volume: "Volume",
  count: "Count",
};

export function ShoppingTab() {
  const plans = useMealsStore((s) => s.plans);
  const recipes = useMealsStore((s) => s.recipes);
  const toggleChecked = useMealsStore((s) => s.toggleChecked);
  const clearChecked = useMealsStore((s) => s.clearChecked);
  const theme = useTheme();
  const c = theme.copy.meals;
  const [planId, setPlanId] = useState<string>(plans[0]?.id ?? "");
  const plan = plans.find((p) => p.id === planId) ?? plans[0];

  const items = useMemo(
    () => (plan ? buildShoppingList(plan, recipes) : []),
    [plan, recipes]
  );

  const grouped = useMemo(() => {
    const map = new Map<string, typeof items>();
    for (const it of items) {
      const arr = map.get(it.family) ?? [];
      arr.push(it);
      map.set(it.family, arr);
    }
    return map;
  }, [items]);

  if (plans.length === 0) {
    return (
      <div className="pd-empty-hint mt-4">
        <p>{c.empty.shopping}</p>
      </div>
    );
  }

  function copyToClipboard() {
    if (!plan) return;
    const text = items
      .map(
        (i) =>
          `${plan.checkedKeys.includes(i.key) ? "[x]" : "[ ]"} ${i.display.padEnd(12, " ")} ${i.name}`
      )
      .join("\n");
    navigator.clipboard.writeText(text).then(
      () => toast.success("Copied"),
      () => toast.error("Copy failed")
    );
  }

  return (
    <div className="space-y-4 pt-4">
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={planId || plan?.id || ""}
          onChange={(e) => setPlanId(e.target.value)}
          className="pd-select h-8 max-w-xs"
        >
          {plans.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title} · {format(new Date(p.startDate), "MMM d")}
            </option>
          ))}
        </select>
        <div className="ml-auto flex gap-2">
          <Button size="sm" variant="secondary" onClick={copyToClipboard}>
            <Copy className="h-3.5 w-3.5" /> {c.actions.copyList}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => plan && clearChecked(plan.id)}
          >
            <Eraser className="h-3.5 w-3.5" /> {c.actions.clearChecked}
          </Button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="pd-empty-hint">
          // assign at least one recipe to a slot to grow a shopping list
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          {(["mass", "volume", "count"] as const).map((family) => {
            const list = grouped.get(family) ?? [];
            if (list.length === 0) return null;
            return (
              <div key={family} className="glass p-4 space-y-2">
                <h3 className="font-display text-sm uppercase tracking-wider text-emphasis">
                  {FAMILY_LABEL[family]}
                </h3>
                <ul className="space-y-1">
                  {list.map((it) => {
                    const checked = plan?.checkedKeys.includes(it.key) ?? false;
                    return (
                      <li
                        key={it.key}
                        className="flex items-center gap-2 rounded px-1 py-1 hover:bg-muted/40 transition-colors"
                      >
                        <button
                          onClick={() => plan && toggleChecked(plan.id, it.key)}
                          className={cn(
                            "h-5 w-5 rounded border-2 grid place-items-center shrink-0 transition-colors",
                            checked
                              ? "bg-primary border-transparent text-primary-foreground"
                              : "border-border hover:border-comment"
                          )}
                          aria-label={checked ? "Mark unbought" : "Mark bought"}
                        >
                          {checked && <Check className="h-3 w-3" />}
                        </button>
                        <span
                          className={cn(
                            "flex-1 text-sm",
                            checked && "line-through text-comment"
                          )}
                          title={`from: ${it.sources.join(", ")}`}
                        >
                          {it.name}
                        </span>
                        <span className="font-mono text-xs text-comment tabular-nums">
                          {it.display}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
