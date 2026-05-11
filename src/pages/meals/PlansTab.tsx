import { useState } from "react";
import { useMealsStore } from "@/store/meals";
import { Button } from "@/components/ui/Button";
import { Plus, Trash2 } from "lucide-react";
import { useTheme } from "@/themes/context";
import { PlanEditor } from "./PlanEditor";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export function PlansTab({ onNew }: { onNew: () => void }) {
  const plans = useMealsStore((s) => s.plans);
  const deletePlan = useMealsStore((s) => s.deletePlan);
  const theme = useTheme();
  const c = theme.copy.meals;
  const [activeId, setActiveId] = useState<string | null>(
    plans[0]?.id ?? null
  );

  if (plans.length === 0) {
    return (
      <div className="pd-empty-hint mt-4 space-y-3">
        <p>{c.empty.plans.text}</p>
        <Button size="sm" onClick={onNew}>
          <Plus className="h-3.5 w-3.5" /> {c.empty.plans.cta}
        </Button>
      </div>
    );
  }

  const active = plans.find((p) => p.id === activeId) ?? plans[0];

  return (
    <div className="space-y-4 pt-4">
      <div className="flex flex-wrap gap-1.5">
        {plans.map((p) => (
          <button
            key={p.id}
            onClick={() => setActiveId(p.id)}
            className={cn(
              "pd-chip",
              p.id === active.id ? "pd-chip--active" : "pd-chip--inactive"
            )}
          >
            {p.title}
            <span className="ml-1.5 text-[10px] opacity-70">
              {format(new Date(p.startDate), "MMM d")}
            </span>
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-comment">
          {active.kind === "weekly" ? "Weekly plan" : "Monthly plan"} ·{" "}
          {format(new Date(active.startDate), "MMM d, yyyy")}
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            if (!confirm(`Delete "${active.title}"?`)) return;
            deletePlan(active.id);
            setActiveId(null);
          }}
        >
          <Trash2 className="h-3.5 w-3.5" /> Delete plan
        </Button>
      </div>

      <PlanEditor planId={active.id} />
    </div>
  );
}
