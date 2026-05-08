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
import { useTheme } from "@/themes/context";

export function TravelPage() {
  const trips = useTravelStore((s) => s.trips);
  const destinations = useTravelStore((s) => s.destinations);
  const theme = useTheme();
  const c = theme.copy.travel;
  const isMono = theme.id === "terminal";

  const filters: { label: string; value: "all" | DestinationStatus }[] = [
    { label: c.filters.all, value: "all" },
    { label: c.statusLabels.wishlist, value: "wishlist" },
    { label: c.statusLabels.planned, value: "planned" },
    { label: c.statusLabels.visited, value: "visited" },
  ];

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
        <div className="lg:w-96 lg:border-r border-border flex flex-col gap-3 p-4 lg:p-5 lg:overflow-y-auto scrollbar-thin bg-background/95 relative z-10">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div
                className={cn(
                  "text-xs text-comment",
                  isMono
                    ? "font-mono"
                    : "font-sans uppercase tracking-[0.18em]"
                )}
              >
                {theme.voice.promptPrefix && (
                  <span className="text-comment/70 mr-1.5">$</span>
                )}
                {c.eyebrow}
              </div>
              <h1 className="font-display text-xl leading-tight text-emphasis">
                {c.title}
              </h1>
            </div>
            <Button size="sm" onClick={() => setNewTripOpen(true)}>
              <Plus className="h-3.5 w-3.5" /> {c.newTrip}
            </Button>
          </div>

          <Stats />

          <div className="flex flex-wrap gap-1.5">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={cn(
                  "rounded border px-2 py-0.5 text-xs transition-colors",
                  isMono ? "font-mono" : "font-sans",
                  filter === f.value
                    ? "border-emphasis bg-muted text-emphasis"
                    : "border-border bg-transparent text-comment hover:text-foreground hover:bg-muted/60"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="space-y-2 mt-1">
            <div
              className={cn(
                "text-[11px] uppercase tracking-[0.18em] text-comment",
                isMono ? "font-mono" : "font-sans"
              )}
            >
              {c.sectionLabels.trips}
            </div>
            <TripList
              selectedTripId={selectedTripId}
              onSelect={handleSelectTrip}
            />
          </div>

          <div className="space-y-2 mt-2">
            <div
              className={cn(
                "text-[11px] uppercase tracking-[0.18em] text-comment",
                isMono ? "font-mono" : "font-sans"
              )}
            >
              {c.sectionLabels.destinations}
            </div>
            {visibleDestinations.length === 0 ? (
              <div
                className={cn(
                  "rounded-md border border-dashed border-border p-3 text-center text-xs text-comment",
                  isMono ? "font-mono" : "font-sans"
                )}
              >
                {c.emptyDestinations}
              </div>
            ) : (
              <ul
                className={cn(
                  "space-y-0.5",
                  isMono ? "font-mono" : "font-sans"
                )}
              >
                {visibleDestinations.slice(0, 50).map((d) => (
                  <li key={d.id}>
                    <button
                      onClick={() => handleEditDestination(d.id)}
                      className="w-full text-left flex items-center gap-2 rounded px-2 py-1 hover:bg-muted line-highlight"
                    >
                      <span
                        className="h-1.5 w-1.5 shrink-0 rounded-sm"
                        style={{
                          background: statusVar(d.status),
                        }}
                      />
                      <span className="text-sm truncate flex-1">{d.name}</span>
                      <span className="text-[11px] text-comment">
                        {c.statusLabels[d.status]}
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
          <div className="pointer-events-none absolute left-4 bottom-4 hidden md:flex items-center gap-2 text-xs z-[400]">
            <Badge
              variant="default"
              className="pointer-events-auto bg-background/80 backdrop-blur border-border"
            >
              <MapPin className="h-3 w-3 mr-1" /> {c.mapHint}
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

export function statusVar(status: DestinationStatus): string {
  if (status === "visited") return "rgb(var(--color-primary))";
  if (status === "planned") return "rgb(var(--color-cool))";
  return "rgb(var(--color-warm))";
}

function Stats() {
  const destinations = useTravelStore((s) => s.destinations);
  const theme = useTheme();
  const labels = theme.copy.travel.statusLabels;
  const counts = {
    wishlist: destinations.filter((d) => d.status === "wishlist").length,
    planned: destinations.filter((d) => d.status === "planned").length,
    visited: destinations.filter((d) => d.status === "visited").length,
  };
  return (
    <div className="grid grid-cols-3 gap-2">
      <Stat
        label={labels.wishlist}
        value={counts.wishlist}
        color="rgb(var(--color-warm))"
      />
      <Stat
        label={labels.planned}
        value={counts.planned}
        color="rgb(var(--color-cool))"
      />
      <Stat
        label={labels.visited}
        value={counts.visited}
        color="rgb(var(--color-primary))"
      />
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
  const theme = useTheme();
  const isMono = theme.id === "terminal";
  return (
    <div className="rounded-md border border-border bg-muted/40 p-2.5">
      <div
        className={cn(
          "flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] text-comment",
          isMono ? "font-mono" : "font-sans"
        )}
      >
        <span
          className="h-1.5 w-1.5 rounded-sm"
          style={{ background: color }}
        />
        {label}
      </div>
      <div className="font-display text-xl text-emphasis mt-0.5 tabular-nums">
        {value}
      </div>
    </div>
  );
}
