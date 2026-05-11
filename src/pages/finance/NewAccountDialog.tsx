import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogClose,
} from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { useFinanceStore } from "@/store/finance";
import { ACCOUNT_TYPES, FINANCE_COLORS } from "@/types/finance";
import type { AccountType } from "@/types/finance";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const CURRENCIES = ["USD", "EUR", "GBP", "BRL", "JPY", "CAD", "AUD"];

export function NewAccountDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const addAccount = useFinanceStore((s) => s.addAccount);
  const accounts = useFinanceStore((s) => s.accounts);
  const setDefaultCurrency = useFinanceStore((s) => s.setDefaultCurrency);
  const [name, setName] = useState("");
  const [type, setType] = useState<AccountType>("checking");
  const [currency, setCurrency] = useState("USD");
  const [color, setColor] = useState(FINANCE_COLORS[0]);

  function reset() {
    setName("");
    setType("checking");
    setCurrency("USD");
    setColor(FINANCE_COLORS[0]);
  }

  function handleCreate() {
    if (!name.trim()) {
      toast.error("Account needs a name");
      return;
    }
    addAccount({ name: name.trim(), type, currency, color });
    if (accounts.length === 0) setDefaultCurrency(currency);
    toast.success("Account added");
    reset();
    onOpenChange(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) reset();
        onOpenChange(o);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New account</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="acct-name">Name</Label>
            <Input
              id="acct-name"
              autoFocus
              placeholder="Nubank credit card"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Type</Label>
            <div className="flex flex-wrap gap-1.5">
              {ACCOUNT_TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setType(t.value)}
                  className={cn(
                    "rounded border px-2 py-1 text-xs transition-colors",
                    type === t.value
                      ? "border-emphasis bg-muted text-emphasis"
                      : "border-border bg-muted/40 hover:bg-muted/60"
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Currency</Label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="flex h-9 w-full rounded-md border border-border bg-muted/40 px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Color</Label>
              <div className="flex flex-wrap gap-2">
                {FINANCE_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={cn(
                      "h-7 w-7 rounded-full border-2 transition-transform",
                      color === c
                        ? "border-foreground scale-110"
                        : "border-border hover:scale-105"
                    )}
                    style={{ background: c }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button onClick={handleCreate}>Create account</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
