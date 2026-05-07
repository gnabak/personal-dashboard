import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { useTravelStore } from "@/store/travel";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const COLORS = ["#55dc78", "#5fc3f5", "#ffa537", "#f0c34b", "#b89cff", "#f48cb1"];
const CURRENCIES = ["USD", "EUR", "GBP", "BRL", "JPY", "CAD", "AUD"];

interface NewTripDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (id: string) => void;
}

export function NewTripDialog({
  open,
  onOpenChange,
  onCreated,
}: NewTripDialogProps) {
  const addTrip = useTravelStore((s) => s.addTrip);
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [color, setColor] = useState(COLORS[0]);
  const [currency, setCurrency] = useState("USD");

  function reset() {
    setTitle("");
    setStart("");
    setEnd("");
    setColor(COLORS[0]);
    setCurrency("USD");
  }

  function handleCreate() {
    if (!title.trim()) {
      toast.error("Trip needs a title");
      return;
    }
    const id = addTrip({
      title: title.trim(),
      startDate: start || undefined,
      endDate: end || undefined,
      coverColor: color,
      currency,
    });
    toast.success(`Trip “${title.trim()}” created`);
    reset();
    onOpenChange(false);
    onCreated?.(id);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) reset();
        onOpenChange(o);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New trip</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="trip-title">Title</Label>
            <Input
              id="trip-title"
              autoFocus
              placeholder="Summer in Japan"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
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
              <Label>End</Label>
              <Input
                type="date"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={cn(
                    "h-7 w-7 rounded-full border-2 transition-transform",
                    color === c
                      ? "border-white scale-110"
                      : "border-border hover:scale-105"
                  )}
                  style={{ background: c }}
                />
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Currency</Label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="flex h-9 w-full rounded-lg border border-border bg-muted/40 px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button onClick={handleCreate}>Create trip</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
