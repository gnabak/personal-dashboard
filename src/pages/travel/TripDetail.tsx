import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Badge } from "@/components/ui/Badge";
import { useTravelStore } from "@/store/travel";
import type { Trip } from "@/types/travel";
import { BudgetBreakdown } from "./BudgetBreakdown";
import { PackingList } from "./PackingList";
import { format } from "date-fns";
import { CalendarDays, MapPin, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface TripDetailProps {
  trip: Trip | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddDestination: (tripId: string) => void;
  onEditDestination: (id: string) => void;
}

export function TripDetail({
  trip,
  open,
  onOpenChange,
  onAddDestination,
  onEditDestination,
}: TripDetailProps) {
  const destinations = useTravelStore((s) => s.destinations);
  const updateTrip = useTravelStore((s) => s.updateTrip);
  const deleteTrip = useTravelStore((s) => s.deleteTrip);
  const attach = useTravelStore((s) => s.attachDestinationToTrip);

  if (!trip) return null;

  const tripDestinations = trip.destinationIds
    .map((id) => destinations.find((d) => d.id === id))
    .filter((d): d is NonNullable<typeof d> => !!d);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent side="right" className="max-w-md sm:max-w-lg">
        <div className="flex items-start gap-3">
          <div
            className="h-12 w-12 rounded-xl shrink-0 grid place-items-center border"
            style={{
              background: `${trip.coverColor}1a`,
              borderColor: `${trip.coverColor}40`,
              color: trip.coverColor,
            }}
          >
            <MapPin className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <DialogTitle className="truncate">{trip.title}</DialogTitle>
            <div className="mt-1 flex flex-wrap gap-1.5 items-center text-xs text-muted-foreground">
              {(trip.startDate || trip.endDate) && (
                <span className="inline-flex items-center gap-1">
                  <CalendarDays className="h-3 w-3" />
                  {trip.startDate ? format(new Date(trip.startDate), "MMM d") : "?"}
                  {" – "}
                  {trip.endDate ? format(new Date(trip.endDate), "MMM d") : "?"}
                </span>
              )}
              <Badge variant="soft" color={trip.coverColor}>
                {tripDestinations.length} stops
              </Badge>
            </div>
          </div>
        </div>

        <Tabs defaultValue="itinerary" className="mt-4">
          <TabsList className="w-full">
            <TabsTrigger value="itinerary" className="flex-1">
              Itinerary
            </TabsTrigger>
            <TabsTrigger value="budget" className="flex-1">
              Budget
            </TabsTrigger>
            <TabsTrigger value="packing" className="flex-1">
              Packing
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex-1">
              Notes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="itinerary">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label>Start date</Label>
                  <Input
                    type="date"
                    value={trip.startDate ?? ""}
                    onChange={(e) =>
                      updateTrip(trip.id, {
                        startDate: e.target.value || undefined,
                      })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label>End date</Label>
                  <Input
                    type="date"
                    value={trip.endDate ?? ""}
                    onChange={(e) =>
                      updateTrip(trip.id, {
                        endDate: e.target.value || undefined,
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label>Stops</Label>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => onAddDestination(trip.id)}
                >
                  + Add stop
                </Button>
              </div>

              {tripDestinations.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/10 p-4 text-center text-sm text-muted-foreground">
                  No stops yet. Add one above, or click on the map.
                </div>
              ) : (
                <ul className="space-y-1.5">
                  {tripDestinations.map((d, i) => (
                    <li
                      key={d.id}
                      className="group flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2"
                    >
                      <div className="h-6 w-6 rounded-full bg-white/[0.06] grid place-items-center text-xs text-muted-foreground shrink-0">
                        {i + 1}
                      </div>
                      <button
                        className="flex-1 min-w-0 text-left"
                        onClick={() => onEditDestination(d.id)}
                      >
                        <div className="text-sm font-medium truncate">
                          {d.name}
                        </div>
                        <div className="text-[11px] text-muted-foreground inline-flex items-center gap-1">
                          <span
                            className="h-1.5 w-1.5 rounded-full"
                            style={{
                              background:
                                d.status === "visited"
                                  ? "#10b981"
                                  : d.status === "planned"
                                    ? "#6366f1"
                                    : "#f59e0b",
                            }}
                          />
                          {d.status}
                        </div>
                      </button>
                      <button
                        onClick={() => attach(d.id, null)}
                        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity text-xs"
                      >
                        Detach
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </TabsContent>

          <TabsContent value="budget">
            <BudgetBreakdown trip={trip} />
          </TabsContent>

          <TabsContent value="packing">
            <PackingList trip={trip} />
          </TabsContent>

          <TabsContent value="notes">
            <NotesEditor trip={trip} />
          </TabsContent>
        </Tabs>

        <div className="mt-6 pt-4 border-t border-white/10 flex justify-between">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              if (!confirm(`Delete "${trip.title}"?`)) return;
              deleteTrip(trip.id);
              onOpenChange(false);
              toast.success("Trip deleted");
            }}
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete trip
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function NotesEditor({ trip }: { trip: Trip }) {
  const updateTrip = useTravelStore((s) => s.updateTrip);
  const [value, setValue] = useState(trip.notes ?? "");
  return (
    <div className="space-y-2">
      <Textarea
        rows={10}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Plans, links, must-eats…"
      />
      <div className="flex justify-end">
        <Button
          size="sm"
          onClick={() => {
            updateTrip(trip.id, { notes: value || undefined });
            toast.success("Saved");
          }}
        >
          Save notes
        </Button>
      </div>
    </div>
  );
}
