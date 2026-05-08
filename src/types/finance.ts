export type AccountType =
  | "checking"
  | "savings"
  | "credit"
  | "cash"
  | "investment";

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  currency: string;
  color: string;
  createdAt: string;
}

export type TransactionType = "expense" | "income" | "transfer";

export type TxCategory =
  | "food"
  | "transport"
  | "housing"
  | "health"
  | "leisure"
  | "shopping"
  | "subscriptions"
  | "utilities"
  | "salary"
  | "investment"
  | "transfer"
  | "other";

export interface Transaction {
  id: string;
  accountId: string;
  date: string; // ISO yyyy-MM-dd
  description: string;
  amount: number; // always positive; sign comes from `type`
  type: TransactionType;
  category: TxCategory;
  notes?: string;
  source: "manual" | "csv";
  /** Original raw CSV row, kept for traceability when imported */
  raw?: string;
}

export interface Holding {
  id: string;
  ticker: string;
  name?: string;
  shares: number;
  /** Average cost per share */
  avgCost: number;
  /** Last known closing price per share */
  lastPrice: number;
  currency: string;
  /** ISO timestamp of when lastPrice was set */
  priceUpdatedAt?: string;
  notes?: string;
  color: string;
}

export type FinanceGoalSource = "manual" | "investments" | "savings";

export interface FinanceGoal {
  id: string;
  title: string;
  targetAmount: number;
  /** Manual current amount; ignored when source !== 'manual' */
  currentAmount: number;
  currency: string;
  deadline?: string;
  /** Where to read the current amount from */
  source: FinanceGoalSource;
  /** When source is 'investments', restrict to this currency. When 'savings',
   *  optional account ids — empty array means all non-credit, non-investment. */
  accountIds?: string[];
  notes?: string;
  color: string;
  createdAt: string;
}

/** A simple keyword → category rule for auto-classifying CSV imports */
export interface CategoryRule {
  id: string;
  /** Lowercased substring matched against transaction description */
  keyword: string;
  category: TxCategory;
}

export const ACCOUNT_TYPES: { value: AccountType; label: string }[] = [
  { value: "checking", label: "Checking" },
  { value: "savings", label: "Savings" },
  { value: "credit", label: "Credit card" },
  { value: "cash", label: "Cash" },
  { value: "investment", label: "Investment" },
];

export const TX_CATEGORIES: { value: TxCategory; label: string; color: string }[] = [
  { value: "food", label: "Food", color: "#ffa537" },
  { value: "transport", label: "Transport", color: "#5fc3f5" },
  { value: "housing", label: "Housing", color: "#b89cff" },
  { value: "health", label: "Health", color: "#ff6e64" },
  { value: "leisure", label: "Leisure", color: "#f48cb1" },
  { value: "shopping", label: "Shopping", color: "#f0c34b" },
  { value: "subscriptions", label: "Subscriptions", color: "#789b64" },
  { value: "utilities", label: "Utilities", color: "#55dc78" },
  { value: "salary", label: "Salary", color: "#22c55e" },
  { value: "investment", label: "Investment", color: "#a78bfa" },
  { value: "transfer", label: "Transfer", color: "#94a3b8" },
  { value: "other", label: "Other", color: "#64748b" },
];

export const FINANCE_COLORS = [
  "#55dc78",
  "#5fc3f5",
  "#ffa537",
  "#f0c34b",
  "#b89cff",
  "#f48cb1",
];

/** Default keyword → category rules. Lowercased keyword, matches description. */
export const DEFAULT_RULES: Omit<CategoryRule, "id">[] = [
  { keyword: "uber", category: "transport" },
  { keyword: "lyft", category: "transport" },
  { keyword: "99 ", category: "transport" },
  { keyword: "metro", category: "transport" },
  { keyword: "rappi", category: "food" },
  { keyword: "ifood", category: "food" },
  { keyword: "doordash", category: "food" },
  { keyword: "spotify", category: "subscriptions" },
  { keyword: "netflix", category: "subscriptions" },
  { keyword: "youtube premium", category: "subscriptions" },
  { keyword: "icloud", category: "subscriptions" },
  { keyword: "github", category: "subscriptions" },
  { keyword: "rent", category: "housing" },
  { keyword: "aluguel", category: "housing" },
  { keyword: "amazon", category: "shopping" },
  { keyword: "mercado", category: "food" },
  { keyword: "supermarket", category: "food" },
  { keyword: "pharmacy", category: "health" },
  { keyword: "drogaria", category: "health" },
  { keyword: "cinema", category: "leisure" },
  { keyword: "salary", category: "salary" },
  { keyword: "salário", category: "salary" },
  { keyword: "transfer", category: "transfer" },
  { keyword: "ted ", category: "transfer" },
  { keyword: "pix ", category: "transfer" },
];
