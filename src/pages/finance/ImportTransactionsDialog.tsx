import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/Dialog";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { useFinanceStore, categorize, inferType } from "@/store/finance";
import { TX_CATEGORIES } from "@/types/finance";
import type { TxCategory, Transaction } from "@/types/finance";
import {
  parseCsv,
  parseFlexibleAmount,
  parseFlexibleDate,
} from "@/lib/csv";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const NONE = "__none__";

export function ImportTransactionsDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const accounts = useFinanceStore((s) => s.accounts);
  const rules = useFinanceStore((s) => s.rules);
  const bulkAdd = useFinanceStore((s) => s.bulkAddTransactions);

  const [csvText, setCsvText] = useState<string | null>(null);
  const [accountId, setAccountId] = useState("");
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const [delim, setDelim] = useState<"," | ";">(",");
  const [colDate, setColDate] = useState<number>(-1);
  const [colDesc, setColDesc] = useState<number>(-1);
  const [colAmount, setColAmount] = useState<number>(-1);
  const [signFlip, setSignFlip] = useState(false);

  useEffect(() => {
    if (!open) {
      setCsvText(null);
      setHeaders([]);
      setRows([]);
      setColDate(-1);
      setColDesc(-1);
      setColAmount(-1);
      setSignFlip(false);
      setAccountId(accounts[0]?.id ?? "");
    } else if (!accountId && accounts.length > 0) {
      setAccountId(accounts[0].id);
    }
  }, [open, accounts]);

  function autoDetectColumns(headers: string[]) {
    const lower = headers.map((h) => h.toLowerCase());
    const findIdx = (...needles: string[]): number => {
      for (let i = 0; i < lower.length; i++) {
        if (needles.some((n) => lower[i].includes(n))) return i;
      }
      return -1;
    };
    const date = findIdx("date", "data", "fecha");
    const desc = findIdx("description", "memo", "title", "history", "histórico", "narrative", "descrição", "concept");
    const amt = findIdx("amount", "value", "valor", "debit", "credit");
    setColDate(date);
    setColDesc(desc);
    setColAmount(amt);
  }

  function handleFile(file: File) {
    file.text().then((text) => {
      const parsed = parseCsv(text);
      if (parsed.headers.length === 0) {
        toast.error("Couldn't read that file");
        return;
      }
      setCsvText(text);
      setHeaders(parsed.headers);
      setRows(parsed.rows);
      setDelim(parsed.delimiter);
      autoDetectColumns(parsed.headers);
    });
  }

  const preview = useMemo<
    Array<{ date: string | null; description: string; amount: number | null; category: TxCategory; type: Transaction["type"] }>
  >(() => {
    if (colDate < 0 || colDesc < 0 || colAmount < 0) return [];
    return rows.slice(0, 6).map((r) => {
      const date = parseFlexibleDate(r[colDate] ?? "");
      const description = (r[colDesc] ?? "").trim();
      const rawAmt = parseFlexibleAmount(r[colAmount] ?? "");
      const amount = rawAmt == null ? null : signFlip ? -rawAmt : rawAmt;
      const guess = categorize(description, rules) ?? "other";
      const type = amount == null ? "expense" : inferType(amount);
      return { date, description, amount, category: guess, type };
    });
  }, [rows, colDate, colDesc, colAmount, signFlip, rules]);

  function commit() {
    if (!accountId) {
      toast.error("Pick an account");
      return;
    }
    if (colDate < 0 || colDesc < 0 || colAmount < 0) {
      toast.error("Map all three columns");
      return;
    }
    const built: Omit<Transaction, "id">[] = [];
    let skipped = 0;
    for (const r of rows) {
      const date = parseFlexibleDate(r[colDate] ?? "");
      const description = (r[colDesc] ?? "").trim();
      const rawAmt = parseFlexibleAmount(r[colAmount] ?? "");
      const signed = rawAmt == null ? null : signFlip ? -rawAmt : rawAmt;
      if (!date || !description || signed == null || signed === 0) {
        skipped++;
        continue;
      }
      const type = inferType(signed);
      const category = categorize(description, rules) ?? "other";
      built.push({
        accountId,
        date,
        description,
        amount: Math.abs(signed),
        type,
        category,
        source: "csv",
        raw: r.join(delim),
      });
    }
    if (built.length === 0) {
      toast.error("No usable rows");
      return;
    }
    const added = bulkAdd(built);
    toast.success(
      `Imported ${added}${skipped > 0 ? ` · skipped ${skipped}` : ""}`
    );
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Import transactions</DialogTitle>
          <DialogDescription>
            Upload a CSV from your bank or credit card. Map the columns,
            preview, then import.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
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

          {!csvText ? (
            <FileDropZone onFile={handleFile} />
          ) : (
            <>
              <div className="text-xs text-comment">
                Detected delimiter: <code>{delim}</code>. {rows.length} rows,{" "}
                {headers.length} columns.
              </div>

              <div className="grid grid-cols-3 gap-2">
                <ColumnPicker
                  label="Date column"
                  headers={headers}
                  value={colDate}
                  onChange={setColDate}
                />
                <ColumnPicker
                  label="Description column"
                  headers={headers}
                  value={colDesc}
                  onChange={setColDesc}
                />
                <ColumnPicker
                  label="Amount column"
                  headers={headers}
                  value={colAmount}
                  onChange={setColAmount}
                />
              </div>

              <label className="flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={signFlip}
                  onChange={(e) => setSignFlip(e.target.checked)}
                />
                Flip sign — useful for credit-card statements where amounts are
                positive but represent expenses
              </label>

              <div className="space-y-2">
                <Label>Preview · first 6 rows</Label>
                {preview.length === 0 ? (
                  <div className="rounded-md border border-dashed border-border p-3 text-xs text-comment">
                    Map all three columns to see a preview.
                  </div>
                ) : (
                  <div className="rounded-md border border-border overflow-hidden text-xs">
                    <table className="w-full">
                      <thead className="bg-muted text-comment uppercase text-[10px] tracking-wider">
                        <tr>
                          <th className="text-left px-2 py-1.5">Date</th>
                          <th className="text-left px-2 py-1.5">Description</th>
                          <th className="text-left px-2 py-1.5">Cat</th>
                          <th className="text-right px-2 py-1.5">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {preview.map((p, i) => {
                          const cat = TX_CATEGORIES.find(
                            (c) => c.value === p.category
                          );
                          return (
                            <tr
                              key={i}
                              className="border-t border-border"
                            >
                              <td className="px-2 py-1.5 text-comment">
                                {p.date ?? <span className="text-danger">?</span>}
                              </td>
                              <td className="px-2 py-1.5 truncate max-w-[260px]">
                                {p.description || (
                                  <span className="text-danger">empty</span>
                                )}
                              </td>
                              <td className="px-2 py-1.5">
                                <span style={{ color: cat?.color }}>
                                  {cat?.label}
                                </span>
                              </td>
                              <td
                                className={cn(
                                  "px-2 py-1.5 text-right tabular-nums",
                                  p.type === "expense"
                                    ? "text-danger"
                                    : "text-primary"
                                )}
                              >
                                {p.amount == null
                                  ? "?"
                                  : `${p.type === "expense" ? "−" : "+"}${Math.abs(p.amount).toFixed(2)}`}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button onClick={commit} disabled={!csvText}>
            Import {rows.length > 0 ? `· ${rows.length} rows` : ""}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function FileDropZone({ onFile }: { onFile: (f: File) => void }) {
  const [drag, setDrag] = useState(false);
  return (
    <label
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed p-8 cursor-pointer transition-colors",
        drag
          ? "border-emphasis bg-muted/60"
          : "border-border bg-muted/30 hover:bg-muted/50"
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        const f = e.dataTransfer.files?.[0];
        if (f) onFile(f);
      }}
    >
      <Upload className="h-6 w-6 text-comment" />
      <div className="text-sm">Drop a CSV here or click to choose</div>
      <div className="text-[11px] text-comment">
        Comma- or semicolon-separated. UTF-8.
      </div>
      <input
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
        }}
      />
    </label>
  );
}

function ColumnPicker({
  label,
  headers,
  value,
  onChange,
}: {
  label: string;
  headers: string[];
  value: number;
  onChange: (i: number) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <select
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="flex h-9 w-full rounded-md border border-border bg-muted/40 px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
      >
        <option value={-1}>{NONE === "__none__" ? "—" : "—"}</option>
        {headers.map((h, i) => (
          <option key={i} value={i}>
            {h || `column ${i + 1}`}
          </option>
        ))}
      </select>
    </div>
  );
}
