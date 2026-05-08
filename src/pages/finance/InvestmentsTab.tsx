import { useMemo, useState } from "react";
import { useFinanceStore } from "@/store/finance";
import { fmtCurrency, fmtCurrencyCompact } from "@/lib/finance";
import { Button } from "@/components/ui/Button";
import { Plus, RefreshCw, Trash2 } from "lucide-react";
import { useTheme } from "@/themes/context";
import { fetchLastPrices } from "@/lib/prices";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export function InvestmentsTab({ onAdd }: { onAdd: () => void }) {
  const holdings = useFinanceStore((s) => s.holdings);
  const updateHolding = useFinanceStore((s) => s.updateHolding);
  const deleteHolding = useFinanceStore((s) => s.deleteHolding);
  const theme = useTheme();
  const c = theme.copy.finance;
  const [refreshing, setRefreshing] = useState(false);

  const groups = useMemo(() => {
    const m = new Map<string, typeof holdings>();
    for (const h of holdings) {
      const arr = m.get(h.currency) ?? [];
      arr.push(h);
      m.set(h.currency, arr);
    }
    return [...m.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [holdings]);

  async function refresh() {
    if (holdings.length === 0) return;
    setRefreshing(true);
    try {
      const tickers = holdings.map((h) => h.ticker);
      const prices = await fetchLastPrices(tickers);
      let ok = 0;
      let failed: string[] = [];
      for (const h of holdings) {
        const p = prices[h.ticker];
        if (p) {
          updateHolding(h.id, {
            lastPrice: p.price,
            priceUpdatedAt: p.fetchedAt,
          });
          ok++;
        } else {
          failed.push(h.ticker);
        }
      }
      if (ok > 0) toast.success(`Refreshed ${ok} of ${holdings.length}`);
      if (failed.length > 0) {
        toast.error(`Couldn't fetch: ${failed.slice(0, 3).join(", ")}${failed.length > 3 ? "…" : ""}`);
      }
    } catch (e) {
      toast.error("Refresh failed");
    } finally {
      setRefreshing(false);
    }
  }

  if (holdings.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-border p-6 text-center text-sm text-comment mt-4 space-y-3">
        <p>{c.emptyStates.holdings}</p>
        <Button size="sm" onClick={onAdd}>
          <Plus className="h-3.5 w-3.5" /> {c.actions.addHolding}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 pt-4">
      <div className="flex justify-end gap-2">
        <Button
          size="sm"
          variant="secondary"
          onClick={refresh}
          disabled={refreshing}
        >
          <RefreshCw
            className={cn("h-3.5 w-3.5", refreshing && "animate-spin")}
          />{" "}
          {c.actions.refreshPrices}
        </Button>
        <Button size="sm" onClick={onAdd}>
          <Plus className="h-3.5 w-3.5" /> {c.actions.addHolding}
        </Button>
      </div>

      {groups.map(([currency, items]) => {
        const totalValue = items.reduce((s, h) => s + h.shares * h.lastPrice, 0);
        const totalCost = items.reduce((s, h) => s + h.shares * h.avgCost, 0);
        const pnl = totalValue - totalCost;
        return (
          <div key={currency} className="space-y-2">
            <div className="flex items-baseline justify-between">
              <h3 className="font-display text-sm uppercase tracking-wider text-emphasis">
                {currency} positions · {items.length}
              </h3>
              <div className="text-sm tabular-nums">
                <span className="text-comment">value </span>
                <span className="font-display">
                  {fmtCurrencyCompact(totalValue, currency)}
                </span>
                <span className="ml-3 text-comment">P&L </span>
                <span
                  className={cn(
                    "font-display",
                    pnl >= 0 ? "text-primary" : "text-danger"
                  )}
                >
                  {pnl >= 0 ? "+" : "−"}
                  {fmtCurrencyCompact(Math.abs(pnl), currency)}
                </span>
              </div>
            </div>

            <div className="rounded-md border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted text-comment uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="text-left px-3 py-2">Ticker</th>
                    <th className="text-right px-3 py-2">Shares</th>
                    <th className="text-right px-3 py-2">Avg cost</th>
                    <th className="text-right px-3 py-2">Last price</th>
                    <th className="text-right px-3 py-2">Value</th>
                    <th className="text-right px-3 py-2">P&L</th>
                    <th className="text-right px-3 py-2">As of</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {items.map((h) => {
                    const value = h.shares * h.lastPrice;
                    const cost = h.shares * h.avgCost;
                    const p = value - cost;
                    const pPct = cost > 0 ? (p / cost) * 100 : 0;
                    return (
                      <tr
                        key={h.id}
                        className="border-t border-border hover:bg-muted/40 group"
                      >
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-2">
                            <span
                              className="h-2 w-2 rounded-sm"
                              style={{ background: h.color }}
                            />
                            <span className="font-medium font-mono">
                              {h.ticker}
                            </span>
                            {h.name && (
                              <span className="text-xs text-comment truncate">
                                {h.name}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-3 py-2 text-right tabular-nums">
                          {h.shares}
                        </td>
                        <td className="px-3 py-2 text-right tabular-nums text-comment">
                          {fmtCurrency(h.avgCost, currency)}
                        </td>
                        <td className="px-3 py-2 text-right tabular-nums">
                          <input
                            type="number"
                            step="0.01"
                            value={h.lastPrice}
                            onChange={(e) => {
                              const n = parseFloat(e.target.value);
                              if (Number.isFinite(n)) {
                                updateHolding(h.id, {
                                  lastPrice: n,
                                  priceUpdatedAt: new Date().toISOString(),
                                });
                              }
                            }}
                            className="w-24 rounded border border-border bg-transparent px-1.5 py-0.5 text-right text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                          />
                        </td>
                        <td className="px-3 py-2 text-right tabular-nums">
                          {fmtCurrency(value, currency)}
                        </td>
                        <td
                          className={cn(
                            "px-3 py-2 text-right tabular-nums",
                            p >= 0 ? "text-primary" : "text-danger"
                          )}
                        >
                          {p >= 0 ? "+" : "−"}
                          {fmtCurrency(Math.abs(p), currency)}
                          <div className="text-[10px] opacity-70">
                            {p >= 0 ? "+" : ""}
                            {pPct.toFixed(1)}%
                          </div>
                        </td>
                        <td className="px-3 py-2 text-right text-xs text-comment whitespace-nowrap">
                          {h.priceUpdatedAt
                            ? format(new Date(h.priceUpdatedAt), "MMM d")
                            : "—"}
                        </td>
                        <td className="px-3 py-2 text-right">
                          <button
                            onClick={() => deleteHolding(h.id)}
                            className="opacity-0 group-hover:opacity-100 text-comment hover:text-destructive transition-opacity"
                            aria-label="Remove"
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
          </div>
        );
      })}
    </div>
  );
}
