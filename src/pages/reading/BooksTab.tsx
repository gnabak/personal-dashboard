import { useState } from "react";
import { useReadingStore } from "@/store/reading";
import { useTheme } from "@/themes/context";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { BookCard } from "./BookCard";
import { cn } from "@/lib/utils";
import type { ReadingStatus } from "@/types/reading";

const ORDER: Record<ReadingStatus, number> = {
  reading: 0,
  wishlist: 1,
  finished: 2,
  dropped: 3,
};

export function BooksTab({
  onNew,
  onOpen,
}: {
  onNew: () => void;
  onOpen: (id: string) => void;
}) {
  const books = useReadingStore((s) => s.books);
  const theme = useTheme();
  const c = theme.copy.reading;
  const [filter, setFilter] = useState<"all" | ReadingStatus>("all");

  if (books.length === 0) {
    return (
      <div className="pd-empty-hint mt-4 space-y-3">
        <p>{c.empty.books.text}</p>
        <Button size="sm" onClick={onNew}>
          <Plus className="h-3.5 w-3.5" /> {c.empty.books.cta}
        </Button>
      </div>
    );
  }

  const filtered =
    filter === "all"
      ? [...books].sort((a, b) => ORDER[a.status] - ORDER[b.status])
      : books.filter((b) => b.status === filter);

  return (
    <div className="space-y-4 pt-4">
      <div className="flex flex-wrap gap-1.5">
        <Chip
          label="All"
          active={filter === "all"}
          onClick={() => setFilter("all")}
        />
        {(["reading", "wishlist", "finished", "dropped"] as ReadingStatus[]).map(
          (s) => (
            <Chip
              key={s}
              label={c.statusLabels[s]}
              active={filter === s}
              onClick={() => setFilter(s)}
            />
          )
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="pd-empty-hint">Nothing on this shelf.</div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((b) => (
            <BookCard key={b.id} book={b} onClick={() => onOpen(b.id)} />
          ))}
        </div>
      )}
    </div>
  );
}

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn("pd-chip", active ? "pd-chip--active" : "pd-chip--inactive")}
    >
      {label}
    </button>
  );
}
