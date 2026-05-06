import { useTravelStore } from "@/store/travel";
import { Badge } from "@/components/ui/Badge";
import { CalendarDays, MapPin } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { Trip } from "@/types/travel";

interface TripListProps {
  selectedTripId: string | null;
  onSelect: (id: string) => void;
}

export function TripList({ selectedTripId, onSelect }: TripListProps) {
  const trips = useTravelStore((s) => s.trips);
  const destinations = useTravelStore((s) => s.destinations);

  if (trips.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-white/10 p-4 text-center text-sm text-muted-foreground">
        No trips yet. Create one to start planning.
      </div>
    );
  }

  return (
    <ul className="space-y-1.5">
      {trips.map((t) => (
        <TripRow
          key={t.id}
          trip={t}
          stops={t.destinationIds.length}
          visited={
            t.destinationIds.filter((id) =>
              destinations.find((d) => d.id === id)?.status === "visited"
            ).length
          }
          selected={t.id === selectedTripId}
          onClick={() => onSelect(t.id)}
        />
      ))}
    </ul>
  );
}

function TripRow({
  trip,
  stops,
  visited,
  selected,
  onClick,
}: {
  trip: Trip;
  stops: number;
  visited: number;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <li>
      <button
        onClick={onClick}
        className={cn(
          "w-full text-left rounded-xl border px-3 py-3 transition-colors flex items-center gap-3",
          selected
            ? "border-white/25 bg-white/[0.08]"
            : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
        )}
      >
        <div
          className="h-9 w-9 rounded-lg shrink-0 grid place-items-center border"
          style={{
            background: `${trip.coverColor}1a`,
            borderColor: `${trip.coverColor}40`,
            color: trip.coverColor,
          }}
        >
          <MapPin className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm truncate">{trip.title}</div>
          <div className="text-[11px] text-muted-foreground inline-flex items-center gap-2 mt-0.5">
            {trip.startDate && (
              <span className="inline-flex items-center gap-1">
                <CalendarDays className="h-3 w-3" />
                {format(new Date(trip.startDate), "MMM d")}
                {trip.endDate &&
                  ` – ${format(new Date(trip.endDate), "MMM d")}`}
              </span>
            )}
            <span>
              {visited}/{stops} visited
            </span>
          </div>
        </div>
        <Badge variant="soft" color={trip.coverColor}>
          {stops}
        </Badge>
      </button>
    </li>
  );
}
