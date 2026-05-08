import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { useTravelStore } from "@/store/travel";
import {
  BUDGET_CATEGORIES,
  type BudgetCategory,
  type Trip,
} from "@/types/travel";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function BudgetBreakdown({ trip }: { trip: Trip }) {
  const addItem = useTravelStore((s) => s.addBudgetItem);
  const removeItem = useTravelStore((s) => s.removeBudgetItem);

  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<BudgetCategory>("flights");

  const totals = BUDGET_CATEGORIES.map((c) => ({
    ...c,
    total: trip.budget
      .filter((b) => b.category === c.value)
      .reduce((s, b) => s + b.amount, 0),
  }));
  const grand = totals.reduce((s, c) => s + c.total, 0);

  const fmt = (n: number) =>
    n.toLocaleString(undefined, {
      style: "currency",
      currency: trip.currency || "USD",
      maximumFractionDigits: 0,
    });

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const n = parseFloat(amount);
    if (!label.trim() || !Number.isFinite(n) || n <= 0) return;
    addItem(trip.id, { label: label.trim(), amount: n, category });
    setLabel("");
    setAmount("");
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-muted/40 p-4">
        <div className="flex items-baseline justify-between">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
            Total budget
          </div>
          <div className="text-2xl font-semibold tabular-nums">{fmt(grand)}</div>
        </div>

        <div className="mt-3 space-y-2">
          {totals.map((c) => {
            const pct = grand === 0 ? 0 : (c.total / grand) * 100;
            return (
              <div key={c.value}>
                <div className="flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: c.color }}
                    />
                    {c.label}
                  </span>
                  <span className="text-muted-foreground tabular-nums">
                    {fmt(c.total)}
                    <span className="text-muted-foreground/60 ml-2">
                      {pct.toFixed(0)}%
                    </span>
                  </span>
                </div>
                <div className="mt-1 h-1.5 rounded-sm bg-muted border border-border overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, background: c.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <form
        onSubmit={handleAdd}
        className="rounded-xl border border-border bg-muted/40 p-3 space-y-2"
      >
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label>Label</Label>
            <Input
              placeholder="Hotel x 3 nights"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label>Amount</Label>
            <Input
              type="number"
              min={0}
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-1">
          <Label>Category</Label>
          <div className="flex flex-wrap gap-1.5">
            {BUDGET_CATEGORIES.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setCategory(c.value)}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-xs transition-colors",
                  category === c.value
                    ? "border-gold bg-muted"
                    : "border-border bg-muted/40 hover:bg-muted/60"
                )}
              >
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full mr-1.5 align-middle"
                  style={{ background: c.color }}
                />
                {c.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex justify-end">
          <Button size="sm" type="submit">
            <Plus className="h-3.5 w-3.5" /> Add expense
          </Button>
        </div>
      </form>

      {trip.budget.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
          No expenses yet.
        </div>
      ) : (
        <ul className="space-y-1.5">
          {trip.budget.map((b) => {
            const cat = BUDGET_CATEGORIES.find((c) => c.value === b.category);
            return (
              <li
                key={b.id}
                className="group flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2"
              >
                <span
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{ background: cat?.color ?? "#789b64" }}
                />
                <span className="flex-1 text-sm truncate">{b.label}</span>
                <span className="text-xs text-muted-foreground">
                  {cat?.label}
                </span>
                <span className="text-sm font-medium tabular-nums w-20 text-right">
                  {fmt(b.amount)}
                </span>
                <button
                  onClick={() => removeItem(trip.id, b.id)}
                  className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                  aria-label="Remove expense"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
