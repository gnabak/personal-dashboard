export type DestinationStatus = "wishlist" | "planned" | "visited";

export interface Destination {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: DestinationStatus;
  notes?: string;
  tripId?: string;
  createdAt: string;
}

export type BudgetCategory =
  | "flights"
  | "lodging"
  | "food"
  | "activities"
  | "transport"
  | "other";

export interface BudgetItem {
  id: string;
  label: string;
  category: BudgetCategory;
  amount: number;
}

export interface PackingItem {
  id: string;
  label: string;
  packed: boolean;
}

export interface Trip {
  id: string;
  title: string;
  startDate?: string;
  endDate?: string;
  destinationIds: string[];
  budget: BudgetItem[];
  packing: PackingItem[];
  notes?: string;
  coverColor: string;
  currency: string;
  createdAt: string;
}

export const BUDGET_CATEGORIES: { value: BudgetCategory; label: string; color: string }[] = [
  { value: "flights", label: "Flights", color: "#5fc3f5" },
  { value: "lodging", label: "Lodging", color: "#b89cff" },
  { value: "food", label: "Food", color: "#ffa537" },
  { value: "activities", label: "Activities", color: "#55dc78" },
  { value: "transport", label: "Transport", color: "#f0c34b" },
  { value: "other", label: "Other", color: "#789b64" },
];
