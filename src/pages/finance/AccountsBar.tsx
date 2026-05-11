import { useFinanceStore } from "@/store/finance";
import { fmtCurrency } from "@/lib/finance";
import { Plus, Wallet, CreditCard, Banknote, PiggyBank, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { AccountType } from "@/types/finance";
import { useTheme } from "@/themes/context";

const ACCOUNT_ICON: Record<AccountType, React.ComponentType<{ className?: string }>> = {
  checking: Wallet,
  savings: PiggyBank,
  credit: CreditCard,
  cash: Banknote,
  investment: TrendingUp,
};

export function AccountsBar({ onAddAccount }: { onAddAccount: () => void }) {
  const accounts = useFinanceStore((s) => s.accounts);
  const transactions = useFinanceStore((s) => s.transactions);
  const theme = useTheme();
  const c = theme.copy.finance;

  if (accounts.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-border p-4 flex items-center justify-between gap-3">
        <p className="text-sm text-comment">{c.emptyStates.accounts.text}</p>
        <Button size="sm" onClick={onAddAccount}>
          <Plus className="h-3.5 w-3.5" /> {c.emptyStates.accounts.cta}
        </Button>
      </div>
    );
  }

  // Per-account net (income - expense)
  const balances = new Map<string, number>();
  for (const t of transactions) {
    const cur = balances.get(t.accountId) ?? 0;
    if (t.type === "income") balances.set(t.accountId, cur + t.amount);
    else if (t.type === "expense") balances.set(t.accountId, cur - t.amount);
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
      {accounts.map((a) => {
        const Icon = ACCOUNT_ICON[a.type] ?? Wallet;
        const bal = balances.get(a.id) ?? 0;
        const isCredit = a.type === "credit";
        return (
          <div
            key={a.id}
            className="pd-tile--padded"
          >
            <div className="flex items-center gap-2">
              <span
                className="h-7 w-7 rounded-sm grid place-items-center border"
                style={{
                  background: `${a.color}1f`,
                  borderColor: `${a.color}50`,
                  color: a.color,
                }}
              >
                <Icon className="h-3.5 w-3.5" />
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-comment uppercase tracking-wider">
                  {a.type}
                </div>
                <div className="text-sm font-medium truncate">{a.name}</div>
              </div>
            </div>
            <div className="mt-2 font-display text-base tabular-nums">
              <span className={isCredit ? "text-warm" : ""}>
                {fmtCurrency(isCredit ? -bal : bal, a.currency)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
