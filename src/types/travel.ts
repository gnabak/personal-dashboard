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
  { value: "flights", label: "Flights", color: "#60a5fa" },
  { value: "lodging", label: "Lodging", color: "#a78bfa" },
  { value: "food", label: "Food", color: "#f472b6" },
  { value: "activities", label: "Activities", color: "#34d399" },
  { value: "transport", label: "Transport", color: "#facc15" },
  { value: "other", label: "Other", color: "#94a3b8" },
];
