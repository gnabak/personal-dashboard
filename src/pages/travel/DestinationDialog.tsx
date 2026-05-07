import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/Dialog";
import { Input, Textarea } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { useTravelStore } from "@/store/travel";
import type { DestinationStatus } from "@/types/travel";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

interface DestinationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial: { lat: number; lng: number } | null;
  editingId: string | null;
  defaultTripId?: string | null;
}

const STATUSES: { value: DestinationStatus; label: string; color: string }[] = [
  { value: "wishlist", label: "Wishlist", color: "#f59e0b" },
  { value: "planned", label: "Planned", color: "#6366f1" },
  { value: "visited", label: "Visited", color: "#10b981" },
];

export function DestinationDialog({
  open,
  onOpenChange,
  initial,
  editingId,
  defaultTripId,
}: DestinationDialogProps) {
  const trips = useTravelStore((s) => s.trips);
  const destinations = useTravelStore((s) => s.destinations);
  const addDestination = useTravelStore((s) => s.addDestination);
  const updateDestination = useTravelStore((s) => s.updateDestination);
  const deleteDestination = useTravelStore((s) => s.deleteDestination);
  const attach = useTravelStore((s) => s.attachDestinationToTrip);

  const editing = editingId
    ? destinations.find((d) => d.id === editingId) ?? null
    : null;

  const [name, setName] = useState("");
  const [status, setStatus] = useState<DestinationStatus>("wishlist");
  const [notes, setNotes] = useState("");
  const [tripId, setTripId] = useState<string>("");

  useEffect(() => {
    if (!open) return;
    if (editing) {
      setName(editing.name);
      setStatus(editing.status);
      setNotes(editing.notes ?? "");
      setTripId(editing.tripId ?? "");
    } else {
      setName("");
      setStatus("wishlist");
      setNotes("");
      setTripId(defaultTripId ?? "");
    }
  }, [open, editing, defaultTripId]);

  const coords = editing
    ? { lat: editing.lat, lng: editing.lng }
    : initial;

  function handleSave() {
    if (!coords) return;
    if (!name.trim()) {
      toast.error("Give the destination a name");
      return;
    }
    const t = tripId || undefined;
    if (editing) {
      const oldTrip = editing.tripId;
      updateDestination(editing.id, {
        name: name.trim(),
        status,
        notes: notes.trim() || undefined,
      });
      if (oldTrip !== t) {
        attach(editing.id, t ?? null);
      }
      toast.success("Destination updated");
    } else {
      addDestination({
        name: name.trim(),
        status,
        notes: notes.trim() || undefined,
        lat: coords.lat,
        lng: coords.lng,
        tripId: t,
      });
      toast.success("Destination added");
    }
    onOpenChange(false);
  }

  function handleDelete() {
    if (!editing) return;
    if (!confirm(`Remove ${editing.name}?`)) return;
    deleteDestination(editing.id);
    onOpenChange(false);
    toast.success("Removed");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editing ? "Edit destination" : "New destination"}
          </DialogTitle>
          <DialogDescription>
            {coords && (
              <>
                {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="dest-name">Name</Label>
            <Input
              id="dest-name"
              autoFocus
              placeholder="e.g. Kyoto"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <div className="flex gap-2">
              {STATUSES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setStatus(s.value)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors",
                    status === s.value
                      ? "border-white/30 bg-white/[0.08]"
                      : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
                  )}
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: s.color }}
                  />
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="dest-trip">Trip</Label>
            <select
              id="dest-trip"
              value={tripId}
              onChange={(e) => setTripId(e.target.value)}
              className="flex h-9 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
            >
              <option value="">No trip</option>
              {trips.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="dest-notes">Notes</Label>
            <Textarea
              id="dest-notes"
              placeholder="What draws you there?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          {editing && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              className="mr-auto"
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </Button>
          )}
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSave}>
            {editing ? "Save changes" : "Add destination"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
