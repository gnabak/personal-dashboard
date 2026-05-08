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
import { fetchLastPrice } from "@/lib/prices";
import { Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const CURRENCIES = ["USD", "EUR", "GBP", "BRL", "JPY", "CAD", "AUD"];

export function NewHoldingDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const addHolding = useFinanceStore((s) => s.addHolding);
  const [ticker, setTicker] = useState("");
  const [name, setName] = useState("");
  const [shares, setShares] = useState("");
  const [avgCost, setAvgCost] = useState("");
  const [lastPrice, setLastPrice] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [color, setColor] = useState(FINANCE_COLORS[0]);
  const [notes, setNotes] = useState("");
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (!open) {
      setTicker("");
      setName("");
      setShares("");
      setAvgCost("");
      setLastPrice("");
      setCurrency("USD");
      setColor(FINANCE_COLORS[0]);
      setNotes("");
    }
  }, [open]);

  async function tryFetchPrice() {
    if (!ticker.trim()) {
      toast.error("Enter a ticker first");
      return;
    }
    setFetching(true);
    try {
      const r = await fetchLastPrice(ticker.trim().toUpperCase());
      if (r) {
        setLastPrice(String(r.price));
        if (r.currency) setCurrency(r.currency);
        toast.success(`Last price: ${r.price}`);
      } else {
        toast.error("Couldn't fetch — enter manually");
      }
    } finally {
      setFetching(false);
    }
  }

  function save() {
    const s = parseFloat(shares);
    const ac = parseFloat(avgCost);
    const lp = parseFloat(lastPrice);
    if (!ticker.trim()) {
      toast.error("Ticker required");
      return;
    }
    if (![s, ac, lp].every((n) => Number.isFinite(n) && n >= 0)) {
      toast.error("Numbers must be ≥ 0");
      return;
    }
    addHolding({
      ticker: ticker.trim().toUpperCase(),
      name: name.trim() || undefined,
      shares: s,
      avgCost: ac,
      lastPrice: lp,
      currency,
      color,
      notes: notes.trim() || undefined,
      priceUpdatedAt: new Date().toISOString(),
    });
    toast.success("Holding added");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add holding</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <Label>Ticker</Label>
              <Input
                autoFocus
                placeholder="AAPL"
                value={ticker}
                onChange={(e) => setTicker(e.target.value.toUpperCase())}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Name</Label>
              <Input
                placeholder="Apple Inc."
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1.5">
              <Label>Shares</Label>
              <Input
                type="number"
                step="0.0001"
                min="0"
                value={shares}
                onChange={(e) => setShares(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Avg cost</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={avgCost}
                onChange={(e) => setAvgCost(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Last price</Label>
              <div className="flex gap-1">
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={lastPrice}
                  onChange={(e) => setLastPrice(e.target.value)}
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  onClick={tryFetchPrice}
                  disabled={fetching}
                  title="Fetch last close"
                >
                  <Download
                    className={cn("h-3.5 w-3.5", fetching && "animate-pulse")}
                  />
                </Button>
              </div>
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
          <Button onClick={save}>Add holding</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
