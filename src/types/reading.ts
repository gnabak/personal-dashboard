export type ReadingStatus = "wishlist" | "reading" | "finished" | "dropped";

export type BookFormat = "paper" | "ebook" | "audio";

export interface Book {
  id: string;
  title: string;
  author?: string;
  /** Accent colour used on cards and detail headers. */
  coverColor: string;
  status: ReadingStatus;
  format: BookFormat;
  totalPages?: number;
  /** Updated automatically when a session logs `pages`, but can also be set manually. */
  currentPage?: number;
  rating?: 1 | 2 | 3 | 4 | 5;
  tags: string[];
  notes?: string;
  startedAt?: string; // ISO date
  finishedAt?: string; // ISO date
  createdAt: string;
}

export interface ReadingSession {
  id: string;
  bookId: string;
  date: string; // yyyy-MM-dd
  pages?: number;
  minutes?: number;
  note?: string;
}

export interface Highlight {
  id: string;
  bookId: string;
  page?: number;
  /** For e-books / audio where there is no fixed page number. */
  location?: string;
  text: string;
  note?: string;
  createdAt: string;
}

export const BOOK_FORMATS: { value: BookFormat; label: string }[] = [
  { value: "paper", label: "Paper" },
  { value: "ebook", label: "E-book" },
  { value: "audio", label: "Audio" },
];

export const BOOK_COLORS = [
  "#55dc78",
  "#5fc3f5",
  "#ffa537",
  "#f0c34b",
  "#b89cff",
  "#f48cb1",
  "#ff6e64",
  "#789b64",
];
