import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import { Badge } from "@/components/ui/Badge";
import { Label } from "@/components/ui/Label";
import { useHobbiesStore } from "@/store/hobbies";
import type { Hobby } from "@/types/hobbies";
import { getHobbyIcon } from "./iconMap";
import {
  Check,
  CircleDashed,
  Plus,
  Trash2,
  Clock,
  CalendarDays,
} from "lucide-react";
import { cn, formatMinutes, formatRelativeDays } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "sonner";

interface HobbyDetailProps {
  hobby: Hobby | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function HobbyDetail({ hobby, open, onOpenChange }: HobbyDetailProps) {
  if (!hobby) return null;
  const Icon = getHobbyIcon(hobby.icon);
  const accent = hobby.accentColor;

  const total = hobby.milestones.length;
  const done = hobby.milestones.filter((m) => m.done).length;
  const progress = total === 0 ? 0 : Math.round((done / total) * 100);
  const totalMinutes = hobby.sessions.reduce((s, x) => s + x.minutes, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent side="right" className="max-w-md sm:max-w-lg">
        <div className="flex items-start gap-3">
          <div
            className="h-12 w-12 rounded-xl grid place-items-center border shrink-0"
            style={{
              background: `${accent}1a`,
              borderColor: `${accent}40`,
              color: accent,
            }}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <DialogTitle className="truncate">{hobby.name}</DialogTitle>
            {hobby.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {hobby.description}
              </p>
            )}
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-lg border border-border bg-muted/40 p-2.5">
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  Progress
                </div>
                <div className="text-lg font-semibold">{progress}%</div>
                <Progress
                  className="mt-1.5 h-1.5"
                  value={progress}
                  indicatorColor={`linear-gradient(90deg, ${accent}, ${accent}aa)`}
                />
              </div>
              <div className="rounded-lg border border-border bg-muted/40 p-2.5">
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  Time logged
                </div>
                <div className="text-lg font-semibold">
                  {formatMinutes(totalMinutes)}
                </div>
                <div className="text-[11px] text-muted-foreground mt-1">
                  {hobby.sessions.length} sessions
                </div>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="milestones" className="mt-4">
          <TabsList className="w-full">
            <TabsTrigger value="milestones" className="flex-1">
              Milestones
            </TabsTrigger>
            <TabsTrigger value="sessions" className="flex-1">
              Sessions
            </TabsTrigger>
            <TabsTrigger value="about" className="flex-1">
              About
            </TabsTrigger>
          </TabsList>

          <TabsContent value="milestones">
            <MilestonesTab hobby={hobby} accent={accent} />
          </TabsContent>
          <TabsContent value="sessions">
            <SessionsTab hobby={hobby} accent={accent} />
          </TabsContent>
          <TabsContent value="about">
            <AboutTab
              hobby={hobby}
              onClose={() => onOpenChange(false)}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function MilestonesTab({ hobby, accent }: { hobby: Hobby; accent: string }) {
  const addMilestone = useHobbiesStore((s) => s.addMilestone);
  const toggleMilestone = useHobbiesStore((s) => s.toggleMilestone);
  const removeMilestone = useHobbiesStore((s) => s.removeMilestone);
  const [title, setTitle] = useState("");

  function handleAdd() {
    const t = title.trim();
    if (!t) return;
    addMilestone(hobby.id, t);
    setTitle("");
  }

  const sorted = useMemo(
    () =>
      [...hobby.milestones].sort((a, b) => {
        if (a.done !== b.done) return a.done ? 1 : -1;
        return a.createdAt.localeCompare(b.createdAt);
      }),
    [hobby.milestones]
  );

  return (
    <div className="space-y-3">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAdd();
        }}
        className="flex gap-2"
      >
        <Input
          placeholder="Add a milestone"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Button type="submit" size="icon" aria-label="Add milestone">
          <Plus className="h-4 w-4" />
        </Button>
      </form>

      {sorted.length === 0 ? (
        <EmptyHint>No milestones yet — add one above.</EmptyHint>
      ) : (
        <ul className="space-y-1.5">
          {sorted.map((m) => (
            <li
              key={m.id}
              className={cn(
                "group flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-2.5 py-2",
                m.done && "opacity-60"
              )}
            >
              <button
                onClick={() => toggleMilestone(hobby.id, m.id)}
                className={cn(
                  "h-5 w-5 rounded-full border-2 grid place-items-center shrink-0 transition-colors",
                  m.done
                    ? "border-transparent text-black"
                    : "border-border hover:border-comment"
                )}
                style={m.done ? { background: accent } : undefined}
                aria-label={m.done ? "Mark incomplete" : "Mark complete"}
              >
                {m.done ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <CircleDashed className="h-3 w-3 opacity-0" />
                )}
              </button>
              <span
                className={cn(
                  "flex-1 text-sm",
                  m.done && "line-through text-muted-foreground"
                )}
              >
                {m.title}
              </span>
              {m.done && m.doneAt && (
                <span className="text-[11px] text-muted-foreground">
                  {formatRelativeDays(m.doneAt)}
                </span>
              )}
              <button
                onClick={() => removeMilestone(hobby.id, m.id)}
                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                aria-label="Remove milestone"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SessionsTab({ hobby, accent }: { hobby: Hobby; accent: string }) {
  const addSession = useHobbiesStore((s) => s.addSession);
  const removeSession = useHobbiesStore((s) => s.removeSession);
  const [date, setDate] = useState(() => format(new Date(), "yyyy-MM-dd"));
  const [minutes, setMinutes] = useState("30");
  const [note, setNote] = useState("");

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const m = parseInt(minutes, 10);
    if (!date || !Number.isFinite(m) || m <= 0) {
      toast.error("Pick a date and minutes > 0");
      return;
    }
    addSession(hobby.id, { date, minutes: m, note: note.trim() || undefined });
    setNote("");
    toast.success(`Logged ${m}m`);
  }

  const sorted = [...hobby.sessions].sort((a, b) =>
    b.date.localeCompare(a.date)
  );

  const weekly = useMemo(() => buildWeeklyTotals(hobby.sessions), [hobby.sessions]);
  const max = Math.max(1, ...weekly.map((w) => w.minutes));

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-muted/40 p-3">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">
          Last 8 weeks
        </div>
        <div className="flex items-end gap-1.5 h-16">
          {weekly.map((w) => (
            <div key={w.weekStart} className="flex-1 flex flex-col items-stretch">
              <div className="flex-1 flex items-end">
                <div
                  className="w-full rounded-md transition-all"
                  style={{
                    height: `${(w.minutes / max) * 100}%`,
                    background: `${accent}cc`,
                    minHeight: w.minutes > 0 ? 3 : 0,
                  }}
                  title={`${formatMinutes(w.minutes)} for week of ${w.weekStart}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <form
        onSubmit={handleAdd}
        className="rounded-xl border border-border bg-muted/40 p-3 space-y-2"
      >
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label>Date</Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label>Minutes</Label>
            <Input
              type="number"
              min={1}
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-1">
          <Label>Note</Label>
          <Input
            placeholder="What did you work on?"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
        <div className="flex justify-end">
          <Button size="sm" type="submit">
            <Plus className="h-3.5 w-3.5" /> Log session
          </Button>
        </div>
      </form>

      {sorted.length === 0 ? (
        <EmptyHint>No sessions logged yet.</EmptyHint>
      ) : (
        <ul className="space-y-1.5">
          {sorted.map((s) => (
            <li
              key={s.id}
              className="group flex items-start gap-3 rounded-lg border border-border bg-muted/40 px-3 py-2"
            >
              <div className="text-xs text-muted-foreground shrink-0 w-20 pt-0.5 inline-flex items-center gap-1">
                <CalendarDays className="h-3 w-3" />
                {format(new Date(s.date), "MMM d")}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" style={{ color: accent }} />
                  {formatMinutes(s.minutes)}
                </div>
                {s.note && (
                  <div className="text-xs text-muted-foreground mt-0.5 break-words">
                    {s.note}
                  </div>
                )}
              </div>
              <button
                onClick={() => removeSession(hobby.id, s.id)}
                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                aria-label="Remove session"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function AboutTab({
  hobby,
  onClose,
}: {
  hobby: Hobby;
  onClose: () => void;
}) {
  const updateHobby = useHobbiesStore((s) => s.updateHobby);
  const deleteHobby = useHobbiesStore((s) => s.deleteHobby);
  const [name, setName] = useState(hobby.name);
  const [description, setDescription] = useState(hobby.description ?? "");

  function save() {
    updateHobby(hobby.id, {
      name: name.trim() || hobby.name,
      description: description.trim() || undefined,
    });
    toast.success("Saved");
  }

  function remove() {
    if (!confirm(`Delete "${hobby.name}"? This cannot be undone.`)) return;
    deleteHobby(hobby.id);
    onClose();
    toast.success("Hobby deleted");
  }

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor="about-name">Name</Label>
        <Input
          id="about-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="about-desc">Description</Label>
        <Textarea
          id="about-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Badge variant="soft" color={hobby.accentColor}>
          {hobby.icon}
        </Badge>
        <span>Created {formatRelativeDays(hobby.createdAt)}</span>
      </div>
      <div className="flex justify-between pt-2">
        <Button variant="destructive" size="sm" onClick={remove}>
          <Trash2 className="h-3.5 w-3.5" /> Delete
        </Button>
        <Button size="sm" onClick={save}>
          Save changes
        </Button>
      </div>
    </div>
  );
}

function EmptyHint({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
      {children}
    </div>
  );
}

function buildWeeklyTotals(
  sessions: { date: string; minutes: number }[]
): { weekStart: string; minutes: number }[] {
  const buckets = new Map<string, number>();
  const now = new Date();
  const startOfThisWeek = startOfWeek(now);
  for (let i = 7; i >= 0; i--) {
    const d = addDays(startOfThisWeek, -i * 7);
    buckets.set(formatISODate(d), 0);
  }
  for (const s of sessions) {
    const d = new Date(s.date);
    if (Number.isNaN(d.getTime())) continue;
    const ws = formatISODate(startOfWeek(d));
    if (buckets.has(ws)) {
      buckets.set(ws, (buckets.get(ws) ?? 0) + s.minutes);
    }
  }
  return [...buckets.entries()].map(([weekStart, minutes]) => ({
    weekStart,
    minutes,
  }));
}

function startOfWeek(d: Date): Date {
  const out = new Date(d);
  const day = out.getDay();
  const diff = (day + 6) % 7;
  out.setDate(out.getDate() - diff);
  out.setHours(0, 0, 0, 0);
  return out;
}
function addDays(d: Date, n: number): Date {
  const out = new Date(d);
  out.setDate(out.getDate() + n);
  return out;
}
function formatISODate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
