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
import { useFinanceStore } from "@/store/finance";
import { FINANCE_COLORS } from "@/types/finance";
import type { FinanceGoalSource } from "@/types/finance";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const CURRENCIES = ["USD", "EUR", "GBP", "BRL", "JPY", "CAD", "AUD"];

const SOURCES: { value: FinanceGoalSource; label: string; help: string }[] = [
  {
    value: "manual",
    label: "Manual",
    help: "You update progress yourself.",
  },
  {
    value: "investments",
    label: "Investments",
    help: "Auto: total value of holdings in this currency.",
  },
  {
    value: "savings",
    label: "Savings",
    help: "Auto: net (income − expense) of selected accounts in this currency.",
  },
];

export function NewGoalDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const accounts = useFinanceStore((s) => s.accounts);
  const addGoal = useFinanceStore((s) => s.addGoal);

  const [title, setTitle] = useState("");
  const [target, setTarget] = useState("");
  const [current, setCurrent] = useState("0");
  const [currency, setCurrency] = useState("USD");
  const [source, setSource] = useState<FinanceGoalSource>("manual");
  const [deadline, setDeadline] = useState<string>("");
  const [color, setColor] = useState(FINANCE_COLORS[0]);
  const [notes, setNotes] = useState("");
  const [accountIds, setAccountIds] = useState<string[]>([]);

  useEffect(() => {
    if (!open) {
      setTitle("");
      setTarget("");
      setCurrent("0");
      setCurrency("USD");
      setSource("manual");
      setDeadline("");
      setColor(FINANCE_COLORS[0]);
      setNotes("");
      setAccountIds([]);
    }
  }, [open]);

  function save() {
    if (!title.trim()) {
      toast.error("Goal needs a title");
      return;
    }
    const t = parseFloat(target);
    if (!Number.isFinite(t) || t <= 0) {
      toast.error("Target must be > 0");
      return;
    }
    const cur = parseFloat(current);
    addGoal({
      title: title.trim(),
      targetAmount: t,
      currentAmount: Number.isFinite(cur) ? cur : 0,
      currency,
      source,
      deadline: deadline || undefined,
      accountIds: source === "savings" && accountIds.length > 0 ? accountIds : undefined,
      color,
      notes: notes.trim() || undefined,
    });
    toast.success("Goal added");
    onOpenChange(false);
  }

  const eligibleAccounts = accounts.filter(
    (a) => a.currency === currency && a.type !== "credit" && a.type !== "investment"
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New finance goal</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Title</Label>
            <Input
              autoFocus
              placeholder="Emergency fund"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <Label>Target</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
              />
            </div>
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
          </div>

          <div className="space-y-1.5">
            <Label>Track current amount from</Label>
            <div className="grid grid-cols-3 gap-2">
              {SOURCES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setSource(s.value)}
                  className={cn(
                    "rounded border px-2 py-2 text-left text-xs transition-colors",
                    source === s.value
                      ? "border-emphasis bg-muted"
                      : "border-border bg-muted/40 hover:bg-muted/60"
                  )}
                >
                  <div className="font-medium">{s.label}</div>
                  <div className="text-comment mt-0.5">{s.help}</div>
                </button>
              ))}
            </div>
          </div>

          {source === "manual" && (
            <div className="space-y-1.5">
              <Label>Current amount</Label>
              <Input
                type="number"
                step="0.01"
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
              />
            </div>
          )}

          {source === "savings" && (
            <div className="space-y-1.5">
              <Label>Accounts (leave empty for all in {currency})</Label>
              <div className="rounded-md border border-border bg-muted/40 p-2 max-h-32 overflow-y-auto scrollbar-thin space-y-1">
                {eligibleAccounts.length === 0 ? (
                  <p className="text-xs text-comment">
                    No eligible accounts in {currency}.
                  </p>
                ) : (
                  eligibleAccounts.map((a) => {
                    const checked = accountIds.includes(a.id);
                    return (
                      <label
                        key={a.id}
                        className="flex items-center gap-2 text-sm cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            setAccountIds((ids) =>
                              checked
                                ? ids.filter((x) => x !== a.id)
                                : [...ids, a.id]
                            );
                          }}
                        />
                        {a.name}
                      </label>
                    );
                  })
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <Label>Deadline</Label>
              <Input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
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
                      "h-6 w-6 rounded-full border-2 transition-transform",
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

          <div className="space-y-1.5">
            <Label>Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button onClick={save}>Create goal</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
