import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import { useTravelStore } from "@/store/travel";
import type { Trip } from "@/types/travel";
import { Plus, Trash2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function PackingList({ trip }: { trip: Trip }) {
  const addItem = useTravelStore((s) => s.addPackingItem);
  const toggle = useTravelStore((s) => s.togglePackingItem);
  const remove = useTravelStore((s) => s.removePackingItem);
  const [label, setLabel] = useState("");

  const total = trip.packing.length;
  const packed = trip.packing.filter((p) => p.packed).length;
  const pct = total === 0 ? 0 : Math.round((packed / total) * 100);

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const v = label.trim();
    if (!v) return;
    addItem(trip.id, v);
    setLabel("");
  }

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-border bg-muted/40 p-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {packed} of {total} packed
          </span>
          <span className="text-foreground/80 font-medium">{pct}%</span>
        </div>
        <Progress className="mt-2" value={pct} />
      </div>

      <form onSubmit={handleAdd} className="flex gap-2">
        <Input
          placeholder="Add a packing item"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
        <Button type="submit" size="icon" aria-label="Add">
          <Plus className="h-4 w-4" />
        </Button>
      </form>

      {trip.packing.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
          Nothing on the list yet.
        </div>
      ) : (
        <ul className="space-y-1.5">
          {trip.packing.map((p) => (
            <li
              key={p.id}
              className={cn(
                "group flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-2.5 py-2",
                p.packed && "opacity-60"
              )}
            >
              <button
                onClick={() => toggle(trip.id, p.id)}
                className={cn(
                  "h-5 w-5 rounded-md border-2 grid place-items-center shrink-0 transition-colors",
                  p.packed
                    ? "bg-primary border-transparent text-primary-foreground"
                    : "border-border hover:border-comment"
                )}
                aria-label={p.packed ? "Mark not packed" : "Mark packed"}
              >
                {p.packed && <Check className="h-3 w-3" />}
              </button>
              <span
                className={cn(
                  "flex-1 text-sm",
                  p.packed && "line-through text-muted-foreground"
                )}
              >
                {p.label}
              </span>
              <button
                onClick={() => remove(trip.id, p.id)}
                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                aria-label="Remove"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
