import { useMemo, useState } from "react";
import { useTravelStore } from "@/store/travel";
import { TravelMap, type MapClickEvent } from "./TravelMap";
import { TripList } from "./TripList";
import { TripDetail } from "./TripDetail";
import { DestinationDialog } from "./DestinationDialog";
import { NewTripDialog } from "./NewTripDialog";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { Plus, MapPin } from "lucide-react";
import type { DestinationStatus } from "@/types/travel";

const FILTERS: { label: string; value: "all" | DestinationStatus }[] = [
  { label: "All", value: "all" },
  { label: "Wishlist", value: "wishlist" },
  { label: "Planned", value: "planned" },
  { label: "Visited", value: "visited" },
];

export function TravelPage() {
  const trips = useTravelStore((s) => s.trips);
  const destinations = useTravelStore((s) => s.destinations);

  const [filter, setFilter] = useState<"all" | DestinationStatus>("all");
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [tripDetailOpen, setTripDetailOpen] = useState(false);
  const [newTripOpen, setNewTripOpen] = useState(false);

  const [destDialog, setDestDialog] = useState<{
    open: boolean;
    initial: { lat: number; lng: number } | null;
    editingId: string | null;
    defaultTripId?: string | null;
  }>({ open: false, initial: null, editingId: null });

  const visibleDestinations = useMemo(
    () =>
      filter === "all"
        ? destinations
        : destinations.filter((d) => d.status === filter),
    [destinations, filter]
  );

  const selectedTrip = trips.find((t) => t.id === selectedTripId) ?? null;

  function handleMapClick(e: MapClickEvent) {
    setDestDialog({
      open: true,
      initial: e,
      editingId: null,
      defaultTripId: selectedTripId,
    });
  }

  function handleEditDestination(id: string) {
    setDestDialog({ open: true, initial: null, editingId: id });
  }

  function handleSelectTrip(id: string) {
    setSelectedTripId(id);
    setTripDetailOpen(true);
  }

  return (
    <div className="h-[calc(100vh-0px)] md:h-screen flex flex-col">
      <div className="flex flex-col lg:flex-row flex-1 min-h-0">
        <div className="lg:w-96 lg:border-r border-white/5 flex flex-col gap-3 p-4 lg:p-5 lg:overflow-y-auto scrollbar-thin">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary/80">
                Travel
              </div>
              <h1 className="text-xl font-semibold leading-tight">
                Where you're going
              </h1>
            </div>
            <Button size="sm" onClick={() => setNewTripOpen(true)}>
              <Plus className="h-3.5 w-3.5" /> Trip
            </Button>
          </div>

          <Stats />

          <div className="flex flex-wrap gap-1.5">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-xs transition-colors",
                  filter === f.value
                    ? "border-white/30 bg-white/[0.08]"
                    : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="space-y-2 mt-1">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
              Trips
            </div>
            <TripList
              selectedTripId={selectedTripId}
              onSelect={handleSelectTrip}
            />
          </div>

          <div className="space-y-2 mt-2">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
              Destinations
            </div>
            {visibleDestinations.length === 0 ? (
              <div className="rounded-xl border border-dashed border-white/10 p-3 text-center text-xs text-muted-foreground">
                Click anywhere on the map to drop a pin.
              </div>
            ) : (
              <ul className="space-y-1">
                {visibleDestinations.slice(0, 50).map((d) => (
                  <li key={d.id}>
                    <button
                      onClick={() => handleEditDestination(d.id)}
                      className="w-full text-left flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-white/[0.04]"
                    >
                      <span
                        className="h-2 w-2 rounded-full shrink-0"
                        style={{
                          background:
                            d.status === "visited"
                              ? "#10b981"
                              : d.status === "planned"
                                ? "#6366f1"
                                : "#f59e0b",
                        }}
                      />
                      <span className="text-sm truncate flex-1">{d.name}</span>
                      <span className="text-[11px] text-muted-foreground capitalize">
                        {d.status}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="relative flex-1 min-h-[60vh] lg:min-h-0">
          <TravelMap
            destinations={visibleDestinations}
            highlightIds={selectedTrip?.destinationIds}
            onMapClick={handleMapClick}
            onEditDestination={handleEditDestination}
            onSelectDestination={handleEditDestination}
          />
          <div className="pointer-events-none absolute left-4 bottom-4 hidden md:flex items-center gap-2 text-xs">
            <Badge variant="default" className="pointer-events-auto bg-black/50 backdrop-blur">
              <MapPin className="h-3 w-3 mr-1" /> Click anywhere to add a pin
            </Badge>
          </div>
        </div>
      </div>

      <DestinationDialog
        open={destDialog.open}
        onOpenChange={(o) => setDestDialog((d) => ({ ...d, open: o }))}
        initial={destDialog.initial}
        editingId={destDialog.editingId}
        defaultTripId={destDialog.defaultTripId ?? null}
      />

      <NewTripDialog
        open={newTripOpen}
        onOpenChange={setNewTripOpen}
        onCreated={(id) => {
          setSelectedTripId(id);
          setTripDetailOpen(true);
        }}
      />

      <TripDetail
        trip={selectedTrip}
        open={tripDetailOpen}
        onOpenChange={setTripDetailOpen}
        onAddDestination={(tripId) =>
          setDestDialog({
            open: true,
            initial: { lat: 20, lng: 0 },
            editingId: null,
            defaultTripId: tripId,
          })
        }
        onEditDestination={handleEditDestination}
      />
    </div>
  );
}

function Stats() {
  const destinations = useTravelStore((s) => s.destinations);
  const counts = {
    wishlist: destinations.filter((d) => d.status === "wishlist").length,
    planned: destinations.filter((d) => d.status === "planned").length,
    visited: destinations.filter((d) => d.status === "visited").length,
  };
  return (
    <div className="grid grid-cols-3 gap-2">
      <Stat label="Wishlist" value={counts.wishlist} color="#f59e0b" />
      <Stat label="Planned" value={counts.planned} color="#6366f1" />
      <Stat label="Visited" value={counts.visited} color="#10b981" />
    </div>
  );
}

function Stat({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-2.5">
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-muted-foreground">
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: color }}
        />
        {label}
      </div>
      <div className="text-xl font-semibold mt-0.5">{value}</div>
    </div>
  );
}
