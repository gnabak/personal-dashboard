import { useMealsStore } from "@/store/meals";
import { Button } from "@/components/ui/Button";
import { Plus, Clock, UtensilsCrossed } from "lucide-react";
import { useTheme } from "@/themes/context";

export function RecipesTab({
  onNew,
  onEdit,
}: {
  onNew: () => void;
  onEdit: (id: string) => void;
}) {
  const recipes = useMealsStore((s) => s.recipes);
  const theme = useTheme();
  const c = theme.copy.meals;

  if (recipes.length === 0) {
    return (
      <div className="pd-empty-hint mt-4 space-y-3">
        <p>{c.empty.recipes.text}</p>
        <Button size="sm" onClick={onNew}>
          <Plus className="h-3.5 w-3.5" /> {c.empty.recipes.cta}
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 pt-4">
      {recipes.map((r) => (
        <button
          key={r.id}
          onClick={() => onEdit(r.id)}
          className="group glass glass-hover p-4 text-left space-y-3 transition-transform hover:-translate-y-0.5"
        >
          <div className="flex items-start gap-3">
            <div
              className="h-10 w-10 rounded-md grid place-items-center border shrink-0"
              style={{
                background: `${r.color}1f`,
                borderColor: `${r.color}50`,
                color: r.color,
              }}
            >
              <UtensilsCrossed className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-medium truncate">{r.name}</div>
              {r.description && (
                <div className="text-xs text-comment line-clamp-2 mt-0.5">
                  {r.description}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[11px] text-comment">
            <span>{r.servings} serv.</span>
            <span>·</span>
            <span>{r.ingredients.length} ingredients</span>
            {r.totalMinutes != null && (
              <>
                <span>·</span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {r.totalMinutes}m
                </span>
              </>
            )}
          </div>

          {r.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {r.tags.slice(0, 5).map((t) => (
                <span
                  key={t}
                  className="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-mono text-orange"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </button>
      ))}
    </div>
  );
}
