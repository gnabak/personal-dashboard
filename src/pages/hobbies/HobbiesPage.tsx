import { useState } from "react";
import { useHobbiesStore } from "@/store/hobbies";
import { HobbyCard } from "./HobbyCard";
import { HobbyDetail } from "./HobbyDetail";
import { NewHobbyDialog } from "./NewHobbyDialog";
import { Button } from "@/components/ui/Button";
import { Plus, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";

export function HobbiesPage() {
  const hobbies = useHobbiesStore((s) => s.hobbies);
  const [newOpen, setNewOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const active = hobbies.find((h) => h.id === activeId) ?? null;

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      <PageHeader
        eyebrow="ls ~/hobbies"
        title="things you're working on"
        description="track milestones, log time, watch yourself level up week by week."
        actions={
          <Button onClick={() => setNewOpen(true)}>
            <Plus className="h-4 w-4" /> new hobby
          </Button>
        }
      />

      {hobbies.length === 0 ? (
        <EmptyState onCreate={() => setNewOpen(true)} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {hobbies.map((h) => (
            <HobbyCard
              key={h.id}
              hobby={h}
              onClick={() => setActiveId(h.id)}
            />
          ))}
        </div>
      )}

      <NewHobbyDialog
        open={newOpen}
        onOpenChange={setNewOpen}
        onCreated={(id) => setActiveId(id)}
      />
      <HobbyDetail
        hobby={active}
        open={!!active}
        onOpenChange={(o) => !o && setActiveId(null)}
      />
    </div>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="glass p-10 text-center space-y-4 max-w-xl mx-auto">
      <div className="h-14 w-14 mx-auto rounded-md border border-border bg-muted grid place-items-center">
        <Sparkles className="h-6 w-6 text-gold" />
      </div>
      <div className="space-y-1.5">
        <h2 className="font-display text-xl font-bold text-gold">
          pick something to get good at
        </h2>
        <p className="text-sm font-mono text-comment">
          <span className="text-comment/60">{"//"}</span> a hobby is just a
          goal you've decided is fun. add one and start tracking milestones
          and time.
        </p>
      </div>
      <Button onClick={onCreate}>
        <Plus className="h-4 w-4" /> add your first hobby
      </Button>
    </div>
  );
}
