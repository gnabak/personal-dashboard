import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/themes/context";
import { Plus } from "lucide-react";
import { BooksTab } from "./BooksTab";
import { SessionsTab } from "./SessionsTab";
import { HighlightsTab } from "./HighlightsTab";
import { BookDialog } from "./BookDialog";
import { BookDetail } from "./BookDetail";
import { LogSessionDialog } from "./LogSessionDialog";

type TabId = "books" | "sessions" | "highlights";

export function ReadingPage() {
  const theme = useTheme();
  const c = theme.copy.reading;
  const [tab, setTab] = useState<TabId>("books");

  const [bookDialog, setBookDialog] = useState<{
    open: boolean;
    bookId: string | null;
  }>({ open: false, bookId: null });
  const [activeBookId, setActiveBookId] = useState<string | null>(null);
  const [sessionDialog, setSessionDialog] = useState<{
    open: boolean;
    bookId: string | null;
  }>({ open: false, bookId: null });

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <PageHeader
        eyebrow={c.eyebrow}
        title={c.title}
        description={c.description}
        actions={
          <>
            {tab === "books" && (
              <Button
                size="sm"
                onClick={() => setBookDialog({ open: true, bookId: null })}
              >
                <Plus className="h-3.5 w-3.5" /> {c.actions.newBook}
              </Button>
            )}
            {tab === "sessions" && (
              <Button
                size="sm"
                onClick={() =>
                  setSessionDialog({ open: true, bookId: null })
                }
              >
                <Plus className="h-3.5 w-3.5" /> {c.actions.logSession}
              </Button>
            )}
          </>
        }
      />

      <Tabs value={tab} onValueChange={(v) => setTab(v as TabId)}>
        <TabsList>
          <TabsTrigger value="books">{c.tabs.books}</TabsTrigger>
          <TabsTrigger value="sessions">{c.tabs.sessions}</TabsTrigger>
          <TabsTrigger value="highlights">{c.tabs.highlights}</TabsTrigger>
        </TabsList>

        <TabsContent value="books">
          <BooksTab
            onNew={() => setBookDialog({ open: true, bookId: null })}
            onOpen={(id) => setActiveBookId(id)}
          />
        </TabsContent>
        <TabsContent value="sessions">
          <SessionsTab
            onLog={() => setSessionDialog({ open: true, bookId: null })}
          />
        </TabsContent>
        <TabsContent value="highlights">
          <HighlightsTab onOpenBook={(id) => setActiveBookId(id)} />
        </TabsContent>
      </Tabs>

      <BookDialog
        open={bookDialog.open}
        bookId={bookDialog.bookId}
        onOpenChange={(o) =>
          setBookDialog((d) => ({ open: o, bookId: o ? d.bookId : null }))
        }
      />
      <BookDetail
        bookId={activeBookId}
        onClose={() => setActiveBookId(null)}
        onEdit={(id) => {
          setActiveBookId(null);
          setBookDialog({ open: true, bookId: id });
        }}
        onLogSession={(id) => setSessionDialog({ open: true, bookId: id })}
      />
      <LogSessionDialog
        open={sessionDialog.open}
        defaultBookId={sessionDialog.bookId}
        onOpenChange={(o) =>
          setSessionDialog((d) => ({ open: o, bookId: o ? d.bookId : null }))
        }
      />
    </div>
  );
}
