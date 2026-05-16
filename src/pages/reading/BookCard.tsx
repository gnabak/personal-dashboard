import type { Book } from "@/types/reading";
import { Progress } from "@/components/ui/Progress";
import { useTheme } from "@/themes/context";
import { BookOpen, Star } from "lucide-react";

export function BookCard({
  book,
  onClick,
}: {
  book: Book;
  onClick: () => void;
}) {
  const theme = useTheme();
  const status = theme.copy.reading.statusLabels[book.status];
  const pct =
    book.totalPages && book.totalPages > 0
      ? Math.min(
          100,
          Math.round(((book.currentPage ?? 0) / book.totalPages) * 100)
        )
      : 0;

  return (
    <button
      onClick={onClick}
      className="group glass glass-hover p-4 text-left space-y-3 transition-transform hover:-translate-y-0.5"
    >
      <div className="flex items-start gap-3">
        <div
          className="h-10 w-10 rounded-md grid place-items-center border shrink-0"
          style={{
            background: `${book.coverColor}1f`,
            borderColor: `${book.coverColor}50`,
            color: book.coverColor,
          }}
        >
          <BookOpen className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-medium truncate">{book.title}</div>
          {book.author && (
            <div className="text-xs text-comment truncate mt-0.5">
              {book.author}
            </div>
          )}
        </div>
        <span
          className="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-mono"
          style={{ color: book.coverColor }}
        >
          {status}
        </span>
      </div>

      {book.totalPages != null && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] text-comment tabular-nums">
            <span>
              {book.currentPage ?? 0} / {book.totalPages}
            </span>
            <span>{pct}%</span>
          </div>
          <Progress
            className="h-1"
            value={pct}
            indicatorColor={book.coverColor}
          />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 text-[11px] text-comment">
        <span className="capitalize">{book.format}</span>
        {book.rating && (
          <>
            <span>·</span>
            <span className="inline-flex items-center gap-0.5 text-emphasis">
              {Array.from({ length: book.rating }).map((_, i) => (
                <Star key={i} className="h-3 w-3 fill-current" />
              ))}
            </span>
          </>
        )}
        {book.tags.length > 0 && (
          <>
            <span>·</span>
            <div className="flex flex-wrap gap-1">
              {book.tags.slice(0, 3).map((t) => (
                <span
                  key={t}
                  className="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-mono text-orange"
                >
                  {t}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
    </button>
  );
}
