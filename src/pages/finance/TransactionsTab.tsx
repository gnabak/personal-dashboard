import { useMemo, useState } from "react";
import { useFinanceStore } from "@/store/finance";
import { fmtCurrency, monthKey, formatMonth } from "@/lib/finance";
import { TX_CATEGORIES } from "@/types/finance";
import type { TxCategory } from "@/types/finance";
import { Trash2, Upload, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/themes/context";
import { cn } from "@/lib/utils";

const ALL = "__all__";

export function TransactionsTab({
  onImport,
  onAdd,
}: {
  onImport: () => void;
  onAdd: () => void;
}) {
  const accounts = useFinanceStore((s) => s.accounts);
  const transactions = useFinanceStore((s) => s.transactions);
  const removeTx = useFinanceStore((s) => s.deleteTransaction);
  const updateTx = useFinanceStore((s) => s.updateTransaction);
  const theme = useTheme();
  const c = theme.copy.finance;

  const [accountId, setAccountId] = useState<string>(ALL);
  const [category, setCategory] = useState<TxCategory | typeof ALL>(ALL);
  const [month, setMonth] = useState<string>(ALL);

  const filtered = useMemo(() => {
    return transactions
      .filter((t) => (accountId === ALL ? true : t.accountId === accountId))
      .filter((t) => (category === ALL ? true : t.category === category))
      .filter((t) => {
        if (month === ALL) return true;
        const d = new Date(t.date);
        return monthKey(d) === month;
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [transactions, accountId, category, month]);

  const months = useMemo(() => {
    const set = new Set<string>();
    for (const t of transactions) {
      const d = new Date(t.date);
      if (!Number.isNaN(d.getTime())) set.add(monthKey(d));
    }
    return Array.from(set).sort().reverse();
  }, [transactions]);

  if (accounts.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-border p-6 text-center text-sm text-comment mt-4">
        Add an account first.
      </div>
    );
  }

  return (
    <div className="space-y-3 pt-4">
      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={accountId}
          onChange={setAccountId}
          options={[
            { value: ALL, label: "All accounts" },
            ...accounts.map((a) => ({ value: a.id, label: a.name })),
          ]}
        />
        <Select
          value={category}
          onChange={(v) => setCategory(v as TxCategory | typeof ALL)}
          options={[
            { value: ALL, label: "All categories" },
            ...TX_CATEGORIES.map((c) => ({ value: c.value, label: c.label })),
          ]}
        />
        <Select
          value={month}
          onChange={setMonth}
          options={[
            { value: ALL, label: "All months" },
            ...months.map((m) => {
              const [y, mm] = m.split("-");
              const d = new Date(Number(y), Number(mm) - 1, 1);
              return { value: m, label: formatMonth(d) };
            }),
          ]}
        />
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" variant="secondary" onClick={onImport}>
            <Upload className="h-3.5 w-3.5" /> {c.actions.importCsv}
          </Button>
          <Button size="sm" onClick={onAdd}>
            <Plus className="h-3.5 w-3.5" /> {c.actions.addTransaction}
          </Button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-md border border-dashed border-border p-6 text-center text-sm text-comment">
          {c.emptyStates.transactions}
        </div>
      ) : (
        <div className="rounded-md border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted text-comment uppercase tracking-wider text-[11px]">
              <tr>
                <th className="text-left px-3 py-2">Date</th>
                <th className="text-left px-3 py-2">Description</th>
                <th className="text-left px-3 py-2">Category</th>
                <th className="text-left px-3 py-2">Account</th>
                <th className="text-right px-3 py-2">Amount</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => {
                const a = accounts.find((x) => x.id === t.accountId);
                const cat = TX_CATEGORIES.find((c) => c.value === t.category);
                const isExpense = t.type === "expense";
                return (
                  <tr
                    key={t.id}
                    className="border-t border-border hover:bg-muted/40 group"
                  >
                    <td className="px-3 py-2 text-comment whitespace-nowrap font-mono text-xs">
                      {t.date}
                    </td>
                    <td className="px-3 py-2 truncate max-w-[280px]">
                      {t.description}
                    </td>
                    <td className="px-3 py-2">
                      <select
                        value={t.category}
                        onChange={(e) =>
                          updateTx(t.id, {
                            category: e.target.value as TxCategory,
                          })
                        }
                        className="rounded border border-border bg-transparent text-xs px-1.5 py-0.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        style={{ color: cat?.color }}
                      >
                        {TX_CATEGORIES.map((c) => (
                          <option key={c.value} value={c.value}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-2 text-comment text-xs">
                      {a?.name ?? "—"}
                    </td>
                    <td
                      className={cn(
                        "px-3 py-2 text-right font-mono tabular-nums",
                        isExpense ? "text-danger" : "text-primary"
                      )}
                    >
                      {isExpense ? "−" : "+"}
                      {fmtCurrency(t.amount, a?.currency ?? "USD")}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <button
                        onClick={() => removeTx(t.id)}
                        className="opacity-0 group-hover:opacity-100 text-comment hover:text-destructive transition-opacity"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-8 rounded-md border border-border bg-muted/40 px-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
