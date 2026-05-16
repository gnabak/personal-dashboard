import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import { useReadingStore, totalMinutes as totalMin } from "@/store/reading";
import { useTheme } from "@/themes/context";
import { BookOpen, Plus, Star, Trash2, Pencil, Clock } from "lucide-react";
import { cn, formatMinutes, formatRelativeDays } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "sonner";
import type { ReadingStatus } from "@/types/reading";

const STATUSES: ReadingStatus[] = ["wishlist", "reading", "finished", "dropped"];

export function BookDetail({
  bookId,
  onClose,
  onEdit,
  onLogSession,
}: {
  bookId: string | null;
  onClose: () => void;
  onEdit: (id: string) => void;
  onLogSession: (id: string) => void;
}) {
  const books = useReadingStore((s) => s.books);
  const sessions = useReadingStore((s) => s.sessions);
  const highlights = useReadingStore((s) => s.highlights);
  const setStatus = useReadingStore((s) => s.setStatus);
  const setRating = useReadingStore((s) => s.setRating);
  const removeSession = useReadingStore((s) => s.removeSession);
  const addHighlight = useReadingStore((s) => s.addHighlight);
  const removeHighlight = useReadingStore((s) => s.removeHighlight);
  const theme = useTheme();

  const book = bookId ? books.find((b) => b.id === bookId) : null;
  if (!book) return null;

  const c = theme.copy.reading;
  const accent = book.coverColor;
  const bookSessions = sessions
    .filter((s) => s.bookId === book.id)
    .sort((a, b) => b.date.localeCompare(a.date));
  const bookHighlights = highlights.filter((h) => h.bookId === book.id);
  const minutes = totalMin(book.id, sessions);
  const pct =
    book.totalPages && book.totalPages > 0
      ? Math.min(
          100,
          Math.round(((book.currentPage ?? 0) / book.totalPages) * 100)
        )
      : 0;

  return (
    <Dialog open={!!book} onOpenChange={(o) => !o && onClose()}>
      <DialogContent side="right" className="max-w-md sm:max-w-lg">
        <div className="flex items-start gap-3">
          <div
            className="h-12 w-12 rounded-md grid place-items-center border shrink-0"
            style={{
              background: `${accent}1f`,
              borderColor: `${accent}50`,
              color: accent,
            }}
          >
            <BookOpen className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <DialogTitle className="truncate">{book.title}</DialogTitle>
            {book.author && (
              <p className="text-sm text-comment mt-0.5 truncate">
                {book.author}
              </p>
            )}
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="pd-tile p-2.5">
                <div className="pd-field-caption">Progress</div>
                <div className="text-lg font-semibold">
                  {book.totalPages != null ? `${pct}%` : "—"}
                </div>
                {book.totalPages != null && (
                  <Progress
                    className="mt-1.5 h-1.5"
                    value={pct}
                    indicatorColor={accent}
                  />
                )}
              </div>
              <div className="pd-tile p-2.5">
                <div className="pd-field-caption">Time read</div>
                <div className="text-lg font-semibold">
                  {formatMinutes(minutes)}
                </div>
                <div className="text-[11px] text-comment mt-1">
                  {bookSessions.length} sessions
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-4">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(book.id, s)}
              className={cn(
                "pd-chip",
                book.status === s ? "pd-chip--active" : "pd-chip--inactive"
              )}
            >
              {c.statusLabels[s]}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 mt-2">
          <span className="pd-field-caption">Rating</span>
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() =>
                  setRating(book.id, (book.rating === n ? undefined : (n as 1 | 2 | 3 | 4 | 5)))
                }
                className="text-emphasis"
                aria-label={`${n} stars`}
              >
                <Star
                  className={cn(
                    "h-4 w-4",
                    book.rating && book.rating >= n
                      ? "fill-current"
                      : "opacity-30"
                  )}
                />
              </button>
            ))}
          </div>
        </div>

        <Tabs defaultValue="about" className="mt-4">
          <TabsList className="w-full">
            <TabsTrigger value="about" className="flex-1">
              About
            </TabsTrigger>
            <TabsTrigger value="sessions" className="flex-1">
              {c.tabs.sessions}
            </TabsTrigger>
            <TabsTrigger value="highlights" className="flex-1">
              {c.tabs.highlights}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="space-y-3">
            <div className="text-sm text-comment whitespace-pre-wrap">
              {book.notes || "No notes yet."}
            </div>
            <div className="flex flex-wrap gap-2 text-[11px] text-comment">
              <span className="capitalize">{book.format}</span>
              {book.totalPages != null && (
                <>
                  <span>·</span>
                  <span>
                    {book.currentPage ?? 0} / {book.totalPages} pages
                  </span>
                </>
              )}
              {book.startedAt && (
                <>
                  <span>·</span>
                  <span>started {format(new Date(book.startedAt), "MMM d, yyyy")}</span>
                </>
              )}
              {book.finishedAt && (
                <>
                  <span>·</span>
                  <span>finished {format(new Date(book.finishedAt), "MMM d, yyyy")}</span>
                </>
              )}
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => onEdit(book.id)}
              >
                <Pencil className="h-3.5 w-3.5" /> Edit
              </Button>
              <Button size="sm" onClick={() => onLogSession(book.id)}>
                <Plus className="h-3.5 w-3.5" /> {c.actions.logSession}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="sessions" className="space-y-2">
            {bookSessions.length === 0 ? (
              <div className="pd-empty-hint">{c.empty.sessions}</div>
            ) : (
              <ul className="space-y-1.5">
                {bookSessions.map((s) => (
                  <li
                    key={s.id}
                    className="group flex items-start gap-3 rounded-md border border-border bg-muted/40 px-3 py-2"
                  >
                    <div className="text-xs text-comment shrink-0 w-20 pt-0.5">
                      {format(new Date(s.date), "MMM d")}
                    </div>
                    <div className="flex-1 min-w-0 space-y-0.5 text-sm">
                      <div className="inline-flex items-center gap-2">
                        {s.pages != null && <span>{s.pages} pages</span>}
                        {s.minutes != null && (
                          <span className="inline-flex items-center gap-1 text-comment">
                            <Clock className="h-3 w-3" />
                            {formatMinutes(s.minutes)}
                          </span>
                        )}
                      </div>
                      {s.note && (
                        <div className="text-xs text-comment line-clamp-2">
                          {s.note}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => removeSession(s.id)}
                      className="opacity-0 group-hover:opacity-100 text-comment hover:text-destructive transition-opacity"
                      aria-label="Remove"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>

          <TabsContent value="highlights" className="space-y-2">
            <NewHighlightForm
              onSave={(text, page, note) => {
                if (!text.trim()) return;
                addHighlight({
                  bookId: book.id,
                  text: text.trim(),
                  page: page,
                  note: note?.trim() || undefined,
                });
                toast.success("Highlight saved");
              }}
            />
            {bookHighlights.length === 0 ? (
              <div className="pd-empty-hint">{c.empty.highlights}</div>
            ) : (
              <ul className="space-y-1.5">
                {bookHighlights.map((h) => (
                  <li
                    key={h.id}
                    className="group flex flex-col gap-1 rounded-md border border-border bg-muted/40 px-3 py-2"
                    style={{ borderLeft: `3px solid ${accent}` }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-sm whitespace-pre-wrap flex-1">
                        {h.text}
                      </div>
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
                    <div className="text-[10px] text-comment">
                      {h.page != null ? `p.${h.page} · ` : ""}
                      {formatRelativeDays(h.createdAt)}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function NewHighlightForm({
  onSave,
}: {
  onSave: (text: string, page: number | undefined, note: string) => void;
}) {
  const [text, setText] = useState("");
  const [page, setPage] = useState("");
  const [note, setNote] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const p = parseInt(page, 10);
        onSave(text, Number.isFinite(p) ? p : undefined, note);
        setText("");
        setPage("");
        setNote("");
      }}
      className="pd-tile p-3 space-y-2"
    >
      <Textarea
        rows={2}
        placeholder="A line worth keeping…"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="grid grid-cols-[5rem_1fr] gap-2">
        <Input
          type="number"
          min={1}
          placeholder="page"
          value={page}
          onChange={(e) => setPage(e.target.value)}
        />
        <Input
          placeholder="Note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>
      <div className="flex justify-end">
        <Button size="sm" type="submit">
          <Plus className="h-3.5 w-3.5" /> Add highlight
        </Button>
      </div>
    </form>
  );
}
