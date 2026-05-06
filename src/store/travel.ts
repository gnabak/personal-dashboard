import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { nanoid } from "nanoid";
import type {
  Destination,
  DestinationStatus,
  Trip,
  BudgetItem,
  PackingItem,
} from "@/types/travel";

interface TravelState {
  trips: Trip[];
  destinations: Destination[];

  addTrip: (data: Partial<Trip> & { title: string }) => string;
  updateTrip: (id: string, patch: Partial<Trip>) => void;
  deleteTrip: (id: string) => void;

  addDestination: (
    data: Omit<Destination, "id" | "createdAt"> & { id?: string }
  ) => string;
  updateDestination: (id: string, patch: Partial<Destination>) => void;
  deleteDestination: (id: string) => void;
  setDestinationStatus: (id: string, status: DestinationStatus) => void;
  attachDestinationToTrip: (destId: string, tripId: string | null) => void;

  addBudgetItem: (tripId: string, item: Omit<BudgetItem, "id">) => void;
  updateBudgetItem: (
    tripId: string,
    itemId: string,
    patch: Partial<BudgetItem>
  ) => void;
  removeBudgetItem: (tripId: string, itemId: string) => void;

  addPackingItem: (tripId: string, label: string) => void;
  togglePackingItem: (tripId: string, itemId: string) => void;
  removePackingItem: (tripId: string, itemId: string) => void;
}

const TRIP_COLORS = ["#10b981", "#6366f1", "#f59e0b", "#ec4899", "#14b8a6", "#8b5cf6"];

export const useTravelStore = create<TravelState>()(
  persist(
    (set) => ({
      trips: [],
      destinations: [],

      addTrip: (data) => {
        const id = nanoid();
        const trip: Trip = {
          id,
          title: data.title,
          startDate: data.startDate,
          endDate: data.endDate,
          destinationIds: data.destinationIds ?? [],
          budget: data.budget ?? [],
          packing: data.packing ?? [],
          notes: data.notes,
          coverColor:
            data.coverColor ??
            TRIP_COLORS[Math.floor(Math.random() * TRIP_COLORS.length)],
          currency: data.currency ?? "USD",
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ trips: [trip, ...s.trips] }));
        return id;
      },

      updateTrip: (id, patch) =>
        set((s) => ({
          trips: s.trips.map((t) => (t.id === id ? { ...t, ...patch } : t)),
        })),

      deleteTrip: (id) =>
        set((s) => ({
          trips: s.trips.filter((t) => t.id !== id),
          destinations: s.destinations.map((d) =>
            d.tripId === id ? { ...d, tripId: undefined } : d
          ),
        })),

      addDestination: (data) => {
        const id = data.id ?? nanoid();
        const dest: Destination = {
          id,
          name: data.name,
          lat: data.lat,
          lng: data.lng,
          status: data.status,
          notes: data.notes,
          tripId: data.tripId,
          createdAt: new Date().toISOString(),
        };
        set((s) => ({
          destinations: [dest, ...s.destinations],
          trips: dest.tripId
            ? s.trips.map((t) =>
                t.id === dest.tripId
                  ? { ...t, destinationIds: [...t.destinationIds, id] }
                  : t
              )
            : s.trips,
        }));
        return id;
      },

      updateDestination: (id, patch) =>
        set((s) => ({
          destinations: s.destinations.map((d) =>
            d.id === id ? { ...d, ...patch } : d
          ),
        })),

      deleteDestination: (id) =>
        set((s) => ({
          destinations: s.destinations.filter((d) => d.id !== id),
          trips: s.trips.map((t) => ({
            ...t,
            destinationIds: t.destinationIds.filter((d) => d !== id),
          })),
        })),

      setDestinationStatus: (id, status) =>
        set((s) => ({
          destinations: s.destinations.map((d) =>
            d.id === id ? { ...d, status } : d
          ),
        })),

      attachDestinationToTrip: (destId, tripId) =>
        set((s) => {
          const destinations = s.destinations.map((d) =>
            d.id === destId ? { ...d, tripId: tripId ?? undefined } : d
          );
          const trips = s.trips.map((t) => {
            const has = t.destinationIds.includes(destId);
            if (t.id === tripId && !has) {
              return { ...t, destinationIds: [...t.destinationIds, destId] };
            }
            if (t.id !== tripId && has) {
              return {
                ...t,
                destinationIds: t.destinationIds.filter((d) => d !== destId),
              };
            }
            return t;
          });
          return { destinations, trips };
        }),

      addBudgetItem: (tripId, item) =>
        set((s) => ({
          trips: s.trips.map((t) =>
            t.id === tripId
              ? { ...t, budget: [...t.budget, { ...item, id: nanoid() }] }
              : t
          ),
        })),

      updateBudgetItem: (tripId, itemId, patch) =>
        set((s) => ({
          trips: s.trips.map((t) =>
            t.id === tripId
              ? {
                  ...t,
                  budget: t.budget.map((b) =>
                    b.id === itemId ? { ...b, ...patch } : b
                  ),
                }
              : t
          ),
        })),

      removeBudgetItem: (tripId, itemId) =>
        set((s) => ({
          trips: s.trips.map((t) =>
            t.id === tripId
              ? { ...t, budget: t.budget.filter((b) => b.id !== itemId) }
              : t
          ),
        })),

      addPackingItem: (tripId, label) =>
        set((s) => ({
          trips: s.trips.map((t) =>
            t.id === tripId
              ? {
                  ...t,
                  packing: [
                    ...t.packing,
                    { id: nanoid(), label, packed: false } as PackingItem,
                  ],
                }
              : t
          ),
        })),

      togglePackingItem: (tripId, itemId) =>
        set((s) => ({
          trips: s.trips.map((t) =>
            t.id === tripId
              ? {
                  ...t,
                  packing: t.packing.map((p) =>
                    p.id === itemId ? { ...p, packed: !p.packed } : p
                  ),
                }
              : t
          ),
        })),

      removePackingItem: (tripId, itemId) =>
        set((s) => ({
          trips: s.trips.map((t) =>
            t.id === tripId
              ? { ...t, packing: t.packing.filter((p) => p.id !== itemId) }
              : t
          ),
        })),
    }),
    {
      name: "pd.travel.v1",
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
);
