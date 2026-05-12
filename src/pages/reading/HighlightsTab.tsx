import { useReadingStore } from "@/store/reading";
import { useTheme } from "@/themes/context";
import { Trash2 } from "lucide-react";
import { formatRelativeDays } from "@/lib/utils";

export function HighlightsTab({
  onOpenBook,
}: {
  onOpenBook: (id: string) => void;
}) {
  const highlights = useReadingStore((s) => s.highlights);
  const books = useReadingStore((s) => s.books);
  const removeHighlight = useReadingStore((s) => s.removeHighlight);
  const theme = useTheme();
  const c = theme.copy.reading;

  if (highlights.length === 0) {
    return <div className="pd-empty-hint mt-4">{c.empty.highlights}</div>;
  }

  const sorted = [...highlights].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  );

  return (
    <ul className="pt-4 space-y-2">
      {sorted.map((h) => {
        const b = books.find((bk) => bk.id === h.bookId);
        return (
          <li
            key={h.id}
            className="group flex flex-col gap-1 rounded-md border border-border bg-muted/40 px-3 py-2"
            style={
              b ? { borderLeft: `3px solid ${b.coverColor}` } : undefined
            }
          >
            <div className="flex items-start justify-between gap-2">
              <div className="text-sm whitespace-pre-wrap flex-1">{h.text}</div>
              <button
                onClick={() => removeHighlight(h.id)}
                className="opacity-0 group-hover:opacity-100 text-comment hover:text-destructive transition-opacity shrink-0"
                aria-label="Remove"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
            {h.note && (
              <div className="text-xs text-comment whitespace-pre-wrap">
                {h.note}
              </div>
            )}
            <div className="text-[10px] text-comment inline-flex items-center gap-1.5">
              {b && (
                <button
                  onClick={() => onOpenBook(b.id)}
                  className="hover:text-primary transition-colors"
                >
                  {b.title}
                </button>
              )}
              {h.page != null && (
                <>
                  <span>·</span>
                  <span>p.{h.page}</span>
                </>
              )}
              <span>·</span>
              <span>{formatRelativeDays(h.createdAt)}</span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
