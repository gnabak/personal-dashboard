import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/Dialog";
import { Input, Textarea } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { useReadingStore } from "@/store/reading";
import { BOOK_COLORS, BOOK_FORMATS } from "@/types/reading";
import type { BookFormat, ReadingStatus } from "@/types/reading";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const STATUSES: ReadingStatus[] = [
  "wishlist",
  "reading",
  "finished",
  "dropped",
];

export function BookDialog({
  open,
  bookId,
  onOpenChange,
}: {
  open: boolean;
  bookId: string | null;
  onOpenChange: (o: boolean) => void;
}) {
  const books = useReadingStore((s) => s.books);
  const addBook = useReadingStore((s) => s.addBook);
  const updateBook = useReadingStore((s) => s.updateBook);
  const deleteBook = useReadingStore((s) => s.deleteBook);
  const existing = bookId ? books.find((b) => b.id === bookId) : null;

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [status, setStatus] = useState<ReadingStatus>("wishlist");
  const [format, setFormat] = useState<BookFormat>("paper");
  const [totalPages, setTotalPages] = useState("");
  const [currentPage, setCurrentPage] = useState("");
  const [tags, setTags] = useState("");
  const [notes, setNotes] = useState("");
  const [color, setColor] = useState(BOOK_COLORS[0]);

  useEffect(() => {
    if (!open) return;
    if (existing) {
      setTitle(existing.title);
      setAuthor(existing.author ?? "");
      setStatus(existing.status);
      setFormat(existing.format);
      setTotalPages(
        existing.totalPages != null ? String(existing.totalPages) : ""
      );
      setCurrentPage(
        existing.currentPage != null ? String(existing.currentPage) : ""
      );
      setTags(existing.tags.join(", "));
      setNotes(existing.notes ?? "");
      setColor(existing.coverColor);
    } else {
      setTitle("");
      setAuthor("");
      setStatus("wishlist");
      setFormat("paper");
      setTotalPages("");
      setCurrentPage("");
      setTags("");
      setNotes("");
      setColor(BOOK_COLORS[Math.floor(Math.random() * BOOK_COLORS.length)]);
    }
  }, [open, existing]);

  function save() {
    if (!title.trim()) {
      toast.error("Book needs a title");
      return;
    }
    const tp = parseInt(totalPages, 10);
    const cp = parseInt(currentPage, 10);
    const tagList = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const payload = {
      title: title.trim(),
      author: author.trim() || undefined,
      status,
      format,
      totalPages: Number.isFinite(tp) && tp > 0 ? tp : undefined,
      currentPage: Number.isFinite(cp) && cp >= 0 ? cp : undefined,
      tags: tagList,
      notes: notes.trim() || undefined,
      coverColor: color,
    };
    if (existing) {
      updateBook(existing.id, payload);
      toast.success("Book updated");
    } else {
      addBook(payload);
      toast.success(`${payload.title} added`);
    }
    onOpenChange(false);
  }

  function handleDelete() {
    if (!existing) return;
    if (!confirm(`Delete "${existing.title}"?`)) return;
    deleteBook(existing.id);
    onOpenChange(false);
    toast.success("Book deleted");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{existing ? "Edit book" : "New book"}</DialogTitle>
          <DialogDescription>
            Track the title across shelves, log sessions to advance the page
            counter automatically.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="grid sm:grid-cols-3 gap-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Title</Label>
              <Input
                autoFocus
                placeholder="The Pragmatic Programmer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Author</Label>
              <Input
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Optional"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <Label>Status</Label>
              <div className="flex gap-1.5 flex-wrap">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(s)}
                    className={cn(
                      "pd-chip",
                      status === s ? "pd-chip--active" : "pd-chip--inactive"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Format</Label>
              <div className="flex gap-1.5 flex-wrap">
                {BOOK_FORMATS.map((f) => (
                  <button
                    key={f.value}
                    type="button"
                    onClick={() => setFormat(f.value)}
                    className={cn(
                      "pd-chip",
                      format === f.value
                        ? "pd-chip--active"
                        : "pd-chip--inactive"
                    )}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <Label>Total pages</Label>
              <Input
                type="number"
                min={1}
                value={totalPages}
                onChange={(e) => setTotalPages(e.target.value)}
                placeholder="Optional"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Current page</Label>
              <Input
                type="number"
                min={0}
                value={currentPage}
                onChange={(e) => setCurrentPage(e.target.value)}
                placeholder="Optional"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Tags (comma-separated)</Label>
            <Input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="fiction, classics"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Cover color</Label>
            <div className="flex flex-wrap gap-2">
              {BOOK_COLORS.map((c) => (
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

        <DialogFooter>
          {existing && (
            <Button
              variant="destructive"
              size="sm"
              className="mr-auto"
              onClick={handleDelete}
            >
              Delete
            </Button>
          )}
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button onClick={save}>{existing ? "Save" : "Add book"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
