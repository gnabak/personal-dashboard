import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogClose,
} from "@/components/ui/Dialog";
import { Input, Textarea } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { useMealsStore, mondayOf, firstOfMonth } from "@/store/meals";
import { useTheme } from "@/themes/context";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { format } from "date-fns";
import type { PlanKind } from "@/types/meals";

export function NewPlanDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const addPlan = useMealsStore((s) => s.addPlan);
  const theme = useTheme();
  const [kind, setKind] = useState<PlanKind>("weekly");
  const [title, setTitle] = useState("");
  const [start, setStart] = useState(() => mondayOf(new Date()));
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!open) {
      setKind("weekly");
      setTitle("");
      setStart(mondayOf(new Date()));
      setNotes("");
    }
  }, [open]);

  useEffect(() => {
    // Snap the start date to a sensible boundary when kind changes.
    if (!open) return;
    const d = new Date(start);
    if (Number.isNaN(d.getTime())) return;
    setStart(kind === "weekly" ? mondayOf(d) : firstOfMonth(d));
  }, [kind]); // eslint-disable-line react-hooks/exhaustive-deps

  function save() {
    const startDate = start;
    if (!startDate) {
      toast.error("Pick a start date");
      return;
    }
    const finalTitle =
      title.trim() ||
      (kind === "weekly"
        ? `Week of ${format(new Date(startDate), "MMM d")}`
        : format(new Date(startDate), "MMMM yyyy"));
    const s = theme.copy.meals.slots;
    addPlan({
      title: finalTitle,
      kind,
      startDate,
      slotLabels: [s.breakfast, s.lunch, s.dinner, s.snack],
      notes: notes.trim() || undefined,
    });
    toast.success("Plan created");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New meal plan</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Span</Label>
            <div className="flex gap-2">
              {(["weekly", "monthly"] as PlanKind[]).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setKind(k)}
                  className={cn(
                    "flex-1 rounded border px-3 py-1.5 text-sm capitalize transition-colors",
                    kind === k
                      ? "border-emphasis bg-muted text-emphasis"
                      : "border-border bg-muted/40 hover:bg-muted/60"
                  )}
                >
                  {k}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <Label>Start</Label>
              <Input
                type="date"
                value={start}
                onChange={(e) => setStart(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Title</Label>
              <Input
                placeholder="Optional"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button onClick={save}>Create plan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
