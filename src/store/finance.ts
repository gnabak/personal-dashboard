import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { nanoid } from "nanoid";
import type {
  Account,
  AccountType,
  CategoryRule,
  FinanceGoal,
  Holding,
  Transaction,
  TxCategory,
  TransactionType,
} from "@/types/finance";
import { DEFAULT_RULES, FINANCE_COLORS } from "@/types/finance";

interface FinanceState {
  accounts: Account[];
  transactions: Transaction[];
  holdings: Holding[];
  goals: FinanceGoal[];
  rules: CategoryRule[];
  defaultCurrency: string;

  setDefaultCurrency: (c: string) => void;

  addAccount: (a: Omit<Account, "id" | "createdAt"> & { id?: string }) => string;
  updateAccount: (id: string, patch: Partial<Account>) => void;
  deleteAccount: (id: string) => void;

  addTransaction: (
    t: Omit<Transaction, "id" | "source"> & { source?: Transaction["source"] }
  ) => string;
  bulkAddTransactions: (rows: Omit<Transaction, "id">[]) => number;
  updateTransaction: (id: string, patch: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;

  addHolding: (h: Omit<Holding, "id">) => string;
  updateHolding: (id: string, patch: Partial<Holding>) => void;
  deleteHolding: (id: string) => void;

  addGoal: (g: Omit<FinanceGoal, "id" | "createdAt">) => string;
  updateGoal: (id: string, patch: Partial<FinanceGoal>) => void;
  deleteGoal: (id: string) => void;

  addRule: (r: Omit<CategoryRule, "id">) => void;
  removeRule: (id: string) => void;
}

function pickColor(): string {
  return FINANCE_COLORS[Math.floor(Math.random() * FINANCE_COLORS.length)];
}

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set) => ({
      accounts: [],
      transactions: [],
      holdings: [],
      goals: [],
      rules: DEFAULT_RULES.map((r) => ({ ...r, id: nanoid() })),
      defaultCurrency: "USD",

      setDefaultCurrency: (c) => set({ defaultCurrency: c }),

      addAccount: (data) => {
        const id = data.id ?? nanoid();
        const account: Account = {
          id,
          name: data.name,
          type: (data.type ?? "checking") as AccountType,
          currency: data.currency,
          color: data.color ?? pickColor(),
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ accounts: [...s.accounts, account] }));
        return id;
      },
      updateAccount: (id, patch) =>
        set((s) => ({
          accounts: s.accounts.map((a) =>
            a.id === id ? { ...a, ...patch } : a
          ),
        })),
      deleteAccount: (id) =>
        set((s) => ({
          accounts: s.accounts.filter((a) => a.id !== id),
          transactions: s.transactions.filter((t) => t.accountId !== id),
        })),

      addTransaction: (t) => {
        const id = nanoid();
        set((s) => ({
          transactions: [
            { ...t, id, source: t.source ?? "manual" } as Transaction,
            ...s.transactions,
          ],
        }));
        return id;
      },
      bulkAddTransactions: (rows) => {
        const stamped = rows.map((r) => ({ ...r, id: nanoid() } as Transaction));
        set((s) => ({ transactions: [...stamped, ...s.transactions] }));
        return stamped.length;
      },
      updateTransaction: (id, patch) =>
        set((s) => ({
          transactions: s.transactions.map((t) =>
            t.id === id ? { ...t, ...patch } : t
          ),
        })),
      deleteTransaction: (id) =>
        set((s) => ({
          transactions: s.transactions.filter((t) => t.id !== id),
        })),

      addHolding: (h) => {
        const id = nanoid();
        set((s) => ({
          holdings: [{ ...h, id, color: h.color ?? pickColor() }, ...s.holdings],
        }));
        return id;
      },
      updateHolding: (id, patch) =>
        set((s) => ({
          holdings: s.holdings.map((h) =>
            h.id === id ? { ...h, ...patch } : h
          ),
        })),
      deleteHolding: (id) =>
        set((s) => ({ holdings: s.holdings.filter((h) => h.id !== id) })),

      addGoal: (g) => {
        const id = nanoid();
        set((s) => ({
          goals: [
            {
              ...g,
              id,
              color: g.color ?? pickColor(),
              createdAt: new Date().toISOString(),
            },
            ...s.goals,
          ],
        }));
        return id;
      },
      updateGoal: (id, patch) =>
        set((s) => ({
          goals: s.goals.map((g) => (g.id === id ? { ...g, ...patch } : g)),
        })),
      deleteGoal: (id) =>
        set((s) => ({ goals: s.goals.filter((g) => g.id !== id) })),

      addRule: (r) =>
        set((s) => ({
          rules: [...s.rules, { ...r, id: nanoid() }],
        })),
      removeRule: (id) =>
        set((s) => ({ rules: s.rules.filter((r) => r.id !== id) })),
    }),
    {
      name: "pd.finance.v1",
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
);

/* ─────────────────────────────────────────────────────────────────
 * Selectors / helpers
 * ───────────────────────────────────────────────────────────────── */

export function categorize(
  description: string,
  rules: CategoryRule[]
): TxCategory | null {
  const d = description.toLowerCase();
  for (const r of rules) {
    if (d.includes(r.keyword.toLowerCase())) return r.category;
  }
  return null;
}

export function inferType(amount: number): TransactionType {
  return amount < 0 ? "expense" : "income";
}

/**
 * Compute "current amount" for a goal based on its source.
 * Manual → goal.currentAmount.
 * Investments → sum(holding.shares * holding.lastPrice) for matching currency.
 * Savings → sum of (income - expense) per matching account, since-account-creation.
 */
export function computeGoalCurrent(
  goal: FinanceGoal,
  state: Pick<FinanceState, "holdings" | "transactions" | "accounts">
): number {
  if (goal.source === "manual") return goal.currentAmount;
  if (goal.source === "investments") {
    return state.holdings
      .filter((h) => h.currency === goal.currency)
      .reduce((sum, h) => sum + h.shares * h.lastPrice, 0);
  }
  // savings
  const accountIds =
    goal.accountIds && goal.accountIds.length > 0
      ? new Set(goal.accountIds)
      : new Set(
          state.accounts
            .filter(
              (a) =>
                a.currency === goal.currency &&
                a.type !== "credit" &&
                a.type !== "investment"
            )
            .map((a) => a.id)
        );
  let net = 0;
  for (const t of state.transactions) {
    if (!accountIds.has(t.accountId)) continue;
    const acct = state.accounts.find((a) => a.id === t.accountId);
    if (!acct || acct.currency !== goal.currency) continue;
    if (t.type === "income") net += t.amount;
    else if (t.type === "expense") net -= t.amount;
  }
  return net;
}
