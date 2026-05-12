import { useMemo } from "react";
import { useReadingStore } from "@/store/reading";
import { Button } from "@/components/ui/Button";
import { Plus, Trash2 } from "lucide-react";
import { useTheme } from "@/themes/context";
import { formatMinutes } from "@/lib/utils";
import { format } from "date-fns";

export function SessionsTab({ onLog }: { onLog: () => void }) {
  const sessions = useReadingStore((s) => s.sessions);
  const books = useReadingStore((s) => s.books);
  const removeSession = useReadingStore((s) => s.removeSession);
  const theme = useTheme();
  const c = theme.copy.reading;

  const sorted = useMemo(
    () => [...sessions].sort((a, b) => b.date.localeCompare(a.date)),
    [sessions]
  );

  if (sorted.length === 0) {
    return (
      <div className="pd-empty-hint mt-4 space-y-3">
        <p>{c.empty.sessions}</p>
        <Button size="sm" onClick={onLog}>
          <Plus className="h-3.5 w-3.5" /> {c.actions.logSession}
        </Button>
      </div>
    );
  }

  return (
    <div className="pt-4 rounded-md border border-border overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted text-comment uppercase tracking-wider text-[11px]">
          <tr>
            <th className="text-left px-3 py-2">Date</th>
            <th className="text-left px-3 py-2">Book</th>
            <th className="text-right px-3 py-2">Pages</th>
            <th className="text-right px-3 py-2">Time</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {sorted.map((s) => {
            const b = books.find((bk) => bk.id === s.bookId);
            return (
              <tr
                key={s.id}
                className="border-t border-border hover:bg-muted/40 group"
              >
                <td className="px-3 py-2 text-comment whitespace-nowrap font-mono text-xs">
                  {format(new Date(s.date), "MMM d, yyyy")}
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    {b && (
                      <span
                        className="h-1.5 w-1.5 rounded-sm shrink-0"
                        style={{ background: b.coverColor }}
                      />
                    )}
                    <span className="truncate">{b?.title ?? "(deleted)"}</span>
                  </div>
                </td>
                <td className="px-3 py-2 text-right tabular-nums">
                  {s.pages ?? "—"}
                </td>
                <td className="px-3 py-2 text-right tabular-nums">
                  {s.minutes != null ? formatMinutes(s.minutes) : "—"}
                </td>
                <td className="px-3 py-2 text-right">
                  <button
                    onClick={() => removeSession(s.id)}
                    className="opacity-0 group-hover:opacity-100 text-comment hover:text-destructive transition-opacity"
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
  );
}
