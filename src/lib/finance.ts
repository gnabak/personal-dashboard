import type { Transaction } from "@/types/finance";

export function startOfMonth(date: Date): Date {
  const d = new Date(date);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

export function monthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function formatMonth(date: Date): string {
  return date.toLocaleDateString(undefined, {
    month: "short",
    year: "numeric",
  });
}

/**
 * Group transactions by yyyy-MM. Returns a map of monthKey → totals.
 */
export function summarizeByMonth(
  transactions: Transaction[],
  currencyByAccount: Map<string, string>,
  currency: string
): Map<string, { income: number; expense: number; net: number }> {
  const out = new Map<
    string,
    { income: number; expense: number; net: number }
  >();
  for (const t of transactions) {
    if (currencyByAccount.get(t.accountId) !== currency) continue;
    const d = new Date(t.date);
    if (Number.isNaN(d.getTime())) continue;
    const key = monthKey(d);
    const cur = out.get(key) ?? { income: 0, expense: 0, net: 0 };
    if (t.type === "income") cur.income += t.amount;
    else if (t.type === "expense") cur.expense += t.amount;
    cur.net = cur.income - cur.expense;
    out.set(key, cur);
  }
  return out;
}

export function fmtCurrency(n: number, currency: string): string {
  try {
    return n.toLocaleString(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    });
  } catch {
    return `${currency} ${n.toFixed(2)}`;
  }
}

/** Compact form: "$1.2k", "$3.4M". Falls back to fmtCurrency for small values. */
export function fmtCurrencyCompact(n: number, currency: string): string {
  const abs = Math.abs(n);
  if (abs < 1000) return fmtCurrency(n, currency);
  try {
    return n.toLocaleString(undefined, {
      style: "currency",
      currency,
      notation: "compact",
      maximumFractionDigits: 1,
    });
  } catch {
    return fmtCurrency(n, currency);
  }
}
