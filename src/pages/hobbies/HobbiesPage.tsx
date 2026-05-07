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
        eyebrow="Hobbies & projects"
        title="Things you're working on"
        description="Track milestones, log time, and watch yourself level up — week by week."
        actions={
          <Button onClick={() => setNewOpen(true)}>
            <Plus className="h-4 w-4" /> New hobby
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
      <div className="h-14 w-14 mx-auto rounded-2xl bg-gradient-to-br from-emerald-400/30 to-indigo-500/30 grid place-items-center">
        <Sparkles className="h-6 w-6 text-emerald-300" />
      </div>
      <div className="space-y-1.5">
        <h2 className="text-xl font-semibold">Pick something to get good at</h2>
        <p className="text-sm text-muted-foreground">
          A hobby is just a goal you've decided is fun. Add one and start
          tracking milestones and time.
        </p>
      </div>
      <Button onClick={onCreate}>
        <Plus className="h-4 w-4" /> Add your first hobby
      </Button>
    </div>
  );
}
