import { useFinanceStore, computeGoalCurrent } from "@/store/finance";
import { useTheme } from "@/themes/context";
import { Button } from "@/components/ui/Button";
import { Plus, Trash2 } from "lucide-react";
import { Progress } from "@/components/ui/Progress";
import { fmtCurrency } from "@/lib/finance";
import { format, differenceInCalendarDays } from "date-fns";
import { cn } from "@/lib/utils";

const SOURCE_LABEL: Record<string, string> = {
  manual: "Manual",
  investments: "Auto · Investments",
  savings: "Auto · Savings",
};

export function GoalsTab({ onAdd }: { onAdd: () => void }) {
  const goals = useFinanceStore((s) => s.goals);
  const holdings = useFinanceStore((s) => s.holdings);
  const transactions = useFinanceStore((s) => s.transactions);
  const accounts = useFinanceStore((s) => s.accounts);
  const updateGoal = useFinanceStore((s) => s.updateGoal);
  const deleteGoal = useFinanceStore((s) => s.deleteGoal);
  const theme = useTheme();
  const c = theme.copy.finance;

  if (goals.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-border p-6 text-center text-sm text-comment mt-4 space-y-3">
        <p>{c.emptyStates.goals}</p>
        <Button size="sm" onClick={onAdd}>
          <Plus className="h-3.5 w-3.5" /> {c.actions.addGoal}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3 pt-4">
      <ul className="grid gap-3 sm:grid-cols-2">
        {goals.map((g) => {
          const cur = computeGoalCurrent(g, {
            holdings,
            transactions,
            accounts,
          });
          const pct =
            g.targetAmount > 0
              ? Math.min(100, Math.round((cur / g.targetAmount) * 100))
              : 0;
          const daysLeft = g.deadline
            ? differenceInCalendarDays(new Date(g.deadline), new Date())
            : null;
          const isManual = g.source === "manual";
          return (
            <li
              key={g.id}
              className="glass p-4 space-y-3"
              style={{ ["--accent" as string]: g.color }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-0.5 min-w-0">
                  <div className="font-medium truncate">{g.title}</div>
                  <div className="text-[11px] uppercase tracking-wider text-comment">
                    {SOURCE_LABEL[g.source]}
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (
                      confirm(`Delete "${g.title}"?`)
                    )
                      deleteGoal(g.id);
                  }}
                  className="text-comment hover:text-destructive transition-colors"
                  aria-label="Delete goal"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <div>
                <div className="flex items-baseline justify-between text-sm">
                  <span className="text-comment">
                    {fmtCurrency(cur, g.currency)}
                  </span>
                  <span className="text-comment">
                    of {fmtCurrency(g.targetAmount, g.currency)}
                  </span>
                </div>
                <Progress
                  value={pct}
                  indicatorColor={g.color}
                  className="mt-1"
                />
                <div className="mt-1 flex items-baseline justify-between text-[11px] text-comment">
                  <span>{pct}%</span>
                  <span>
                    {g.deadline ? (
                      <>
                        {format(new Date(g.deadline), "MMM d, yyyy")}
                        {daysLeft != null && (
                          <span
                            className={cn(
                              "ml-2",
                              daysLeft < 0 ? "text-danger" : "text-comment"
                            )}
                          >
                            {daysLeft >= 0
                              ? `${daysLeft}d left`
                              : `${Math.abs(daysLeft)}d overdue`}
                          </span>
                        )}
                      </>
                    ) : (
                      "no deadline"
                    )}
                  </span>
                </div>
              </div>

              {isManual && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-comment">Update current:</span>
                  <input
                    type="number"
                    step="0.01"
                    value={g.currentAmount}
                    onChange={(e) => {
                      const n = parseFloat(e.target.value);
                      if (Number.isFinite(n))
                        updateGoal(g.id, { currentAmount: n });
                    }}
                    className="w-28 rounded border border-border bg-transparent px-1.5 py-0.5 text-right tabular-nums focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
