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
import { useReadingStore } from "@/store/reading";
import { format } from "date-fns";
import { toast } from "sonner";

export function LogSessionDialog({
  open,
  defaultBookId,
  onOpenChange,
}: {
  open: boolean;
  defaultBookId: string | null;
  onOpenChange: (o: boolean) => void;
}) {
  const books = useReadingStore((s) => s.books);
  const addSession = useReadingStore((s) => s.addSession);

  const [bookId, setBookId] = useState("");
  const [date, setDate] = useState(() => format(new Date(), "yyyy-MM-dd"));
  const [pages, setPages] = useState("");
  const [minutes, setMinutes] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!open) return;
    setBookId(defaultBookId ?? books[0]?.id ?? "");
    setDate(format(new Date(), "yyyy-MM-dd"));
    setPages("");
    setMinutes("");
    setNote("");
  }, [open, defaultBookId, books]);

  function save() {
    if (!bookId) {
      toast.error("Pick a book");
      return;
    }
    const p = parseInt(pages, 10);
    const m = parseInt(minutes, 10);
    if (!Number.isFinite(p) && !Number.isFinite(m)) {
      toast.error("Add pages, minutes, or both");
      return;
    }
    addSession({
      bookId,
      date,
      pages: Number.isFinite(p) && p > 0 ? p : undefined,
      minutes: Number.isFinite(m) && m > 0 ? m : undefined,
      note: note.trim() || undefined,
    });
    toast.success("Session logged");
    onOpenChange(false);
  }

  if (books.length === 0) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log reading session</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-comment">
            Add a book first, then log a session against it.
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log reading session</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Book</Label>
            <select
              value={bookId}
              onChange={(e) => setBookId(e.target.value)}
              className="pd-select"
            >
              {books.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.title}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1.5">
              <Label>Date</Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Pages</Label>
              <Input
                type="number"
                min={1}
                value={pages}
                onChange={(e) => setPages(e.target.value)}
                placeholder="20"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Minutes</Label>
              <Input
                type="number"
                min={1}
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                placeholder="30"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Note</Label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Optional"
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button onClick={save}>Log session</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
