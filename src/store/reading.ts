import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { nanoid } from "nanoid";
import type {
  Book,
  Highlight,
  ReadingSession,
  ReadingStatus,
} from "@/types/reading";
import { BOOK_COLORS } from "@/types/reading";

interface ReadingState {
  books: Book[];
  sessions: ReadingSession[];
  highlights: Highlight[];

  addBook: (
    data: Omit<Book, "id" | "createdAt" | "coverColor"> & { coverColor?: string }
  ) => string;
  updateBook: (id: string, patch: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  setStatus: (id: string, status: ReadingStatus) => void;
  setRating: (id: string, rating: Book["rating"]) => void;

  addSession: (s: Omit<ReadingSession, "id">) => string;
  removeSession: (id: string) => void;

  addHighlight: (h: Omit<Highlight, "id" | "createdAt">) => string;
  removeHighlight: (id: string) => void;
}

function pickColor(): string {
  return BOOK_COLORS[Math.floor(Math.random() * BOOK_COLORS.length)];
}

export const useReadingStore = create<ReadingState>()(
  persist(
    (set) => ({
      books: [],
      sessions: [],
      highlights: [],

      addBook: (data) => {
        const id = nanoid();
        set((s) => ({
          books: [
            {
              id,
              title: data.title,
              author: data.author,
              coverColor: data.coverColor ?? pickColor(),
              status: data.status,
              format: data.format,
              totalPages: data.totalPages,
              currentPage: data.currentPage,
              rating: data.rating,
              tags: data.tags ?? [],
              notes: data.notes,
              startedAt:
                data.startedAt ??
                (data.status === "reading"
                  ? new Date().toISOString().slice(0, 10)
                  : undefined),
              finishedAt: data.finishedAt,
              createdAt: new Date().toISOString(),
            },
            ...s.books,
          ],
        }));
        return id;
      },

      updateBook: (id, patch) =>
        set((s) => ({
          books: s.books.map((b) => (b.id === id ? { ...b, ...patch } : b)),
        })),

      deleteBook: (id) =>
        set((s) => ({
          books: s.books.filter((b) => b.id !== id),
          sessions: s.sessions.filter((x) => x.bookId !== id),
          highlights: s.highlights.filter((x) => x.bookId !== id),
        })),

      setStatus: (id, status) =>
        set((s) => ({
          books: s.books.map((b) => {
            if (b.id !== id) return b;
            const today = new Date().toISOString().slice(0, 10);
            const patch: Partial<Book> = { status };
            if (status === "reading" && !b.startedAt) patch.startedAt = today;
            if (status === "finished" && !b.finishedAt) patch.finishedAt = today;
            if (status !== "finished") patch.finishedAt = undefined;
            return { ...b, ...patch };
          }),
        })),

      setRating: (id, rating) =>
        set((s) => ({
          books: s.books.map((b) => (b.id === id ? { ...b, rating } : b)),
        })),

      addSession: (data) => {
        const id = nanoid();
        set((s) => {
          // Auto-advance currentPage if pages provided
          const newSessions = [{ ...data, id }, ...s.sessions];
          const books = s.books.map((b) => {
            if (b.id !== data.bookId) return b;
            const next: Book = { ...b };
            if (data.pages && data.pages > 0) {
              const baseline = b.currentPage ?? 0;
              next.currentPage =
                b.totalPages != null
                  ? Math.min(b.totalPages, baseline + data.pages)
                  : baseline + data.pages;
            }
            if (b.status === "wishlist") {
              next.status = "reading";
              if (!b.startedAt)
                next.startedAt = new Date().toISOString().slice(0, 10);
            }
            return next;
          });
          return { sessions: newSessions, books };
        });
        return id;
      },

      removeSession: (id) =>
        set((s) => ({ sessions: s.sessions.filter((x) => x.id !== id) })),

      addHighlight: (data) => {
        const id = nanoid();
        set((s) => ({
          highlights: [
            { ...data, id, createdAt: new Date().toISOString() },
            ...s.highlights,
          ],
        }));
        return id;
      },

      removeHighlight: (id) =>
        set((s) => ({ highlights: s.highlights.filter((x) => x.id !== id) })),
    }),
    {
      name: "pd.reading.v1",
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
);

/** Total minutes read from sessions for a book. */
export function totalMinutes(
  bookId: string,
  sessions: ReadingSession[]
): number {
  return sessions
    .filter((s) => s.bookId === bookId)
    .reduce((sum, s) => sum + (s.minutes ?? 0), 0);
}
