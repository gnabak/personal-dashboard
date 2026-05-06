import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import type { Destination } from "@/types/travel";
import { Button } from "@/components/ui/Button";
import { MapPin } from "lucide-react";

export interface MapClickEvent {
  lat: number;
  lng: number;
}

interface TravelMapProps {
  destinations: Destination[];
  highlightIds?: string[];
  onMapClick: (e: MapClickEvent) => void;
  onSelectDestination?: (id: string) => void;
  onEditDestination?: (id: string) => void;
}

function makeIcon(status: Destination["status"]) {
  return L.divIcon({
    className: "",
    html: `<div class="pd-pin ${status}"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}

function MapClickHandler({
  onMapClick,
}: {
  onMapClick: (e: MapClickEvent) => void;
}) {
  useMapEvents({
    click(e) {
      onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

function FitBounds({ ids, destinations }: { ids?: string[]; destinations: Destination[] }) {
  const map = useMap();
  useEffect(() => {
    if (!ids || ids.length === 0) return;
    const targets = destinations.filter((d) => ids.includes(d.id));
    if (targets.length === 0) return;
    if (targets.length === 1) {
      map.flyTo([targets[0].lat, targets[0].lng], Math.max(map.getZoom(), 6), {
        duration: 0.8,
      });
      return;
    }
    const bounds = L.latLngBounds(targets.map((d) => [d.lat, d.lng] as [number, number]));
    map.flyToBounds(bounds, { padding: [60, 60], duration: 0.8 });
  }, [ids, destinations, map]);
  return null;
}

export function TravelMap({
  destinations,
  highlightIds,
  onMapClick,
  onSelectDestination,
  onEditDestination,
}: TravelMapProps) {
  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      minZoom={2}
      worldCopyJump
      className="h-full w-full"
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      <MapClickHandler onMapClick={onMapClick} />
      <FitBounds ids={highlightIds} destinations={destinations} />
      {destinations.map((d) => (
        <Marker
          key={d.id}
          position={[d.lat, d.lng]}
          icon={makeIcon(d.status)}
          eventHandlers={{
            click: () => onSelectDestination?.(d.id),
          }}
        >
          <Popup>
            <div className="space-y-1.5 min-w-[160px]">
              <div className="font-semibold text-sm">{d.name}</div>
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground inline-flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {d.status}
              </div>
              {d.notes && (
                <div className="text-xs text-muted-foreground line-clamp-3">
                  {d.notes}
                </div>
              )}
              {onEditDestination && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => onEditDestination(d.id)}
                >
                  Edit
                </Button>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
