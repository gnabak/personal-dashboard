import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogClose,
} from "@/components/ui/Dialog";
import { Input, Textarea } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { useFinanceStore, categorize } from "@/store/finance";
import { TX_CATEGORIES } from "@/types/finance";
import type { TransactionType, TxCategory } from "@/types/finance";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "sonner";

export function NewTransactionDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const accounts = useFinanceStore((s) => s.accounts);
  const rules = useFinanceStore((s) => s.rules);
  const addTx = useFinanceStore((s) => s.addTransaction);

  const [accountId, setAccountId] = useState("");
  const [type, setType] = useState<TransactionType>("expense");
  const [date, setDate] = useState(() => format(new Date(), "yyyy-MM-dd"));
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<TxCategory>("other");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!open) return;
    setAccountId(accounts[0]?.id ?? "");
    setType("expense");
    setDate(format(new Date(), "yyyy-MM-dd"));
    setDescription("");
    setAmount("");
    setCategory("other");
    setNotes("");
  }, [open, accounts]);

  // Auto-categorize as you type
  useEffect(() => {
    if (!description.trim()) return;
    const guess = categorize(description, rules);
    if (guess) setCategory(guess);
  }, [description, rules]);

  function handleSave() {
    if (!accountId) {
      toast.error("Pick an account");
      return;
    }
    const n = parseFloat(amount);
    if (!Number.isFinite(n) || n <= 0) {
      toast.error("Amount must be > 0");
      return;
    }
    if (!description.trim()) {
      toast.error("Add a description");
      return;
    }
    addTx({
      accountId,
      type,
      date,
      description: description.trim(),
      amount: n,
      category,
      notes: notes.trim() || undefined,
    });
    toast.success("Transaction added");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New transaction</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <Label>Account</Label>
              <select
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="flex h-9 w-full rounded-md border border-border bg-muted/40 px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
              >
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} · {a.currency}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Date</Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Type</Label>
            <div className="flex gap-2">
              {(["expense", "income", "transfer"] as TransactionType[]).map(
                (t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={cn(
                      "flex-1 rounded border px-3 py-1.5 text-sm capitalize transition-colors",
                      type === t
                        ? "border-emphasis bg-muted text-emphasis"
                        : "border-border bg-muted/40 hover:bg-muted/60"
                    )}
                  >
                    {t}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Description</Label>
            <Input
              autoFocus
              placeholder="e.g. Spotify"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <Label>Amount</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TxCategory)}
                className="flex h-9 w-full rounded-md border border-border bg-muted/40 px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
              >
                {TX_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional"
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSave}>Add transaction</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
