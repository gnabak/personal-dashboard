import { useMemo } from "react";
import { useFinanceStore, computeGoalCurrent } from "@/store/finance";
import { useTheme } from "@/themes/context";
import {
  fmtCurrency,
  fmtCurrencyCompact,
  formatMonth,
  monthKey,
  startOfMonth,
  summarizeByMonth,
} from "@/lib/finance";
import { TX_CATEGORIES } from "@/types/finance";
import type { TxCategory } from "@/types/finance";
import { Progress } from "@/components/ui/Progress";

export function FinanceOverviewTab() {
  const accounts = useFinanceStore((s) => s.accounts);
  const transactions = useFinanceStore((s) => s.transactions);
  const holdings = useFinanceStore((s) => s.holdings);
  const goals = useFinanceStore((s) => s.goals);
  const defaultCurrency = useFinanceStore((s) => s.defaultCurrency);
  const theme = useTheme();
  const c = theme.copy.finance;

  // Choose a working currency: pick the first account's currency if defaultCurrency
  // has none, else default.
  const currency = useMemo(() => {
    if (accounts.some((a) => a.currency === defaultCurrency))
      return defaultCurrency;
    return accounts[0]?.currency ?? defaultCurrency;
  }, [accounts, defaultCurrency]);

  const currencyByAccount = useMemo(() => {
    const m = new Map<string, string>();
    for (const a of accounts) m.set(a.id, a.currency);
    return m;
  }, [accounts]);

  const monthly = useMemo(
    () => summarizeByMonth(transactions, currencyByAccount, currency),
    [transactions, currencyByAccount, currency]
  );

  const now = new Date();
  const thisKey = monthKey(now);
  const lastKey = monthKey(new Date(now.getFullYear(), now.getMonth() - 1, 1));
  const thisMonth = monthly.get(thisKey) ?? { income: 0, expense: 0, net: 0 };
  const lastMonth = monthly.get(lastKey) ?? { income: 0, expense: 0, net: 0 };

  // Top categories this month
  const categoryTotals = useMemo(() => {
    const map = new Map<TxCategory, number>();
    const startOfThisMonth = startOfMonth(now).getTime();
    for (const t of transactions) {
      if (t.type !== "expense") continue;
      if (currencyByAccount.get(t.accountId) !== currency) continue;
      const d = new Date(t.date);
      if (Number.isNaN(d.getTime())) continue;
      if (d.getTime() < startOfThisMonth) continue;
      map.set(t.category, (map.get(t.category) ?? 0) + t.amount);
    }
    return [...map.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([cat, total]) => ({
        category: cat,
        total,
        meta: TX_CATEGORIES.find((c) => c.value === cat),
      }));
  }, [transactions, currency, currencyByAccount, now]);

  const portfolioValue = useMemo(
    () =>
      holdings
        .filter((h) => h.currency === currency)
        .reduce((s, h) => s + h.shares * h.lastPrice, 0),
    [holdings, currency]
  );
  const portfolioCost = useMemo(
    () =>
      holdings
        .filter((h) => h.currency === currency)
        .reduce((s, h) => s + h.shares * h.avgCost, 0),
    [holdings, currency]
  );
  const portfolioPnL = portfolioValue - portfolioCost;

  const sparkline = useMemo(() => {
    const months: { key: string; date: Date }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({ key: monthKey(d), date: d });
    }
    const data = months.map((m) => {
      const stats = monthly.get(m.key) ?? { income: 0, expense: 0, net: 0 };
      return { ...m, ...stats };
    });
    const max = Math.max(1, ...data.map((d) => Math.max(d.income, d.expense)));
    return { data, max };
  }, [monthly, now]);

  const fmt = (n: number) => fmtCurrency(n, currency);

  const delta = thisMonth.net - lastMonth.net;
  const deltaPct =
    lastMonth.net !== 0 ? (delta / Math.abs(lastMonth.net)) * 100 : 0;

  return (
    <div className="space-y-4 pt-4">
      {accounts.length === 0 ? (
        <p className="text-sm text-comment">
          Add an account above to get started.
        </p>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Stat
              label={c.fields.netThisMonth}
              value={fmt(thisMonth.net)}
              subValue={
                <span
                  className={delta >= 0 ? "text-primary" : "text-danger"}
                >
                  {delta >= 0 ? "▲" : "▼"} {fmt(Math.abs(delta))}
                  {Number.isFinite(deltaPct) &&
                    ` (${deltaPct.toFixed(0)}%)`}{" "}
                  vs {formatMonth(new Date(now.getFullYear(), now.getMonth() - 1, 1))}
                </span>
              }
            />
            <Stat
              label={c.fields.spendingThisMonth}
              value={fmt(thisMonth.expense)}
              accentColor="rgb(var(--color-danger))"
            />
            <Stat
              label={c.fields.incomeThisMonth}
              value={fmt(thisMonth.income)}
              accentColor="rgb(var(--color-primary))"
            />
            <Stat
              label={c.fields.portfolioValue}
              value={fmt(portfolioValue)}
              subValue={
                holdings.length > 0 ? (
                  <span
                    className={portfolioPnL >= 0 ? "text-primary" : "text-danger"}
                  >
                    {portfolioPnL >= 0 ? "▲" : "▼"}{" "}
                    {fmt(Math.abs(portfolioPnL))} {c.fields.gainLoss.toLowerCase()}
                  </span>
                ) : null
              }
              accentColor="rgb(var(--color-emphasis))"
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="glass p-5 lg:col-span-2 space-y-3">
              <h3 className="font-display text-sm text-emphasis uppercase tracking-wider">
                Last 6 months — {currency}
              </h3>
              <Sparkline data={sparkline.data} max={sparkline.max} fmt={fmt} />
              <div className="flex items-center gap-4 text-[11px] text-comment">
                <Legend color="rgb(var(--color-primary))" label="Income" />
                <Legend color="rgb(var(--color-danger))" label="Expenses" />
              </div>
            </div>

            <div className="glass p-5 space-y-3">
              <h3 className="font-display text-sm text-emphasis uppercase tracking-wider">
                Top categories — {formatMonth(now)}
              </h3>
              {categoryTotals.length === 0 ? (
                <p className="text-sm text-comment">
                  Nothing logged this month yet.
                </p>
              ) : (
                <ul className="space-y-2">
                  {categoryTotals.map(({ category, total, meta }) => {
                    const pct =
                      thisMonth.expense > 0
                        ? Math.round((total / thisMonth.expense) * 100)
                        : 0;
                    return (
                      <li key={category} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="inline-flex items-center gap-2">
                            <span
                              className="h-2 w-2 rounded-sm"
                              style={{ background: meta?.color ?? "#789b64" }}
                            />
                            <span className="capitalize">
                              {meta?.label ?? category}
                            </span>
                          </span>
                          <span className="text-comment tabular-nums">
                            {fmtCurrencyCompact(total, currency)}
                            <span className="ml-2 text-comment/60">{pct}%</span>
                          </span>
                        </div>
                        <div className="h-1.5 rounded-sm bg-muted border border-border overflow-hidden">
                          <div
                            className="h-full"
                            style={{
                              width: `${Math.min(100, pct)}%`,
                              background: meta?.color ?? "#789b64",
                            }}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>

          {goals.length > 0 && (
            <div className="glass p-5 space-y-3">
              <h3 className="font-display text-sm text-emphasis uppercase tracking-wider">
                Goal progress
              </h3>
              <ul className="space-y-3">
                {goals.slice(0, 4).map((g) => {
                  const cur = computeGoalCurrent(g, {
                    holdings,
                    transactions,
                    accounts,
                  });
                  const pct =
                    g.targetAmount > 0
                      ? Math.min(100, Math.round((cur / g.targetAmount) * 100))
                      : 0;
                  return (
                    <li key={g.id} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{g.title}</span>
                        <span className="text-comment tabular-nums">
                          {fmtCurrencyCompact(cur, g.currency)} /{" "}
                          {fmtCurrencyCompact(g.targetAmount, g.currency)}
                        </span>
                      </div>
                      <Progress
                        value={pct}
                        indicatorColor={g.color}
                        className="h-1.5"
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  subValue,
  accentColor,
}: {
  label: string;
  value: string;
  subValue?: React.ReactNode;
  accentColor?: string;
}) {
  return (
    <div className="glass p-4">
      <div className="text-[11px] uppercase tracking-[0.18em] text-comment">
        {label}
      </div>
      <div
        className="font-display text-2xl mt-1 tabular-nums"
        style={accentColor ? { color: accentColor } : undefined}
      >
        {value}
      </div>
      {subValue && (
        <div className="text-xs text-comment mt-0.5">{subValue}</div>
      )}
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="h-1.5 w-3 rounded-sm"
        style={{ background: color }}
      />
      {label}
    </span>
  );
}

function Sparkline({
  data,
  max,
  fmt,
}: {
  data: { key: string; date: Date; income: number; expense: number; net: number }[];
  max: number;
  fmt: (n: number) => string;
}) {
  const W = 100;
  const H = 56;
  const barWidth = (W / data.length) * 0.7;
  const groupWidth = W / data.length;
  return (
    <div className="space-y-2">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="w-full h-20"
      >
        {data.map((d, i) => {
          const baseX = i * groupWidth + (groupWidth - barWidth) / 2;
          const incH = (d.income / max) * (H - 8);
          const expH = (d.expense / max) * (H - 8);
          return (
            <g key={d.key}>
              <rect
                x={baseX}
                y={H - incH}
                width={barWidth / 2 - 0.3}
                height={incH}
                fill="rgb(var(--color-primary))"
                opacity={0.9}
              />
              <rect
                x={baseX + barWidth / 2 + 0.3}
                y={H - expH}
                width={barWidth / 2 - 0.3}
                height={expH}
                fill="rgb(var(--color-danger))"
                opacity={0.9}
              />
            </g>
          );
        })}
      </svg>
      <div className="grid grid-cols-6 gap-1 text-[10px] text-comment text-center tabular-nums">
        {data.map((d) => (
          <div key={d.key} className="space-y-0.5">
            <div>{d.date.toLocaleDateString(undefined, { month: "short" })}</div>
            <div className="text-foreground/80" title={fmt(d.net)}>
              {d.net >= 0 ? "+" : "−"}
              {fmtCurrencyCompactInline(Math.abs(d.net))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function fmtCurrencyCompactInline(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toFixed(0);
}
