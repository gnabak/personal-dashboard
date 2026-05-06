import { useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { useHobbiesStore } from "@/store/hobbies";
import { useTravelStore } from "@/store/travel";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/layout/PageHeader";
import { Progress } from "@/components/ui/Progress";
import { Badge } from "@/components/ui/Badge";
import {
  ArrowRight,
  Check,
  Clock,
  Download,
  Map,
  MapPin,
  Sparkles,
  Upload,
} from "lucide-react";
import { format } from "date-fns";
import { formatMinutes, formatRelativeDays } from "@/lib/utils";
import { toast } from "sonner";

interface ActivityItem {
  id: string;
  date: string;
  kind: "milestone" | "session" | "destination";
  title: string;
  detail?: string;
  color?: string;
}

export function Overview() {
  const hobbies = useHobbiesStore((s) => s.hobbies);
  const trips = useTravelStore((s) => s.trips);
  const destinations = useTravelStore((s) => s.destinations);

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 5) return "Burning the midnight oil";
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  const stats = useMemo(() => {
    const milestonesDoneThisMonth = hobbies
      .flatMap((h) => h.milestones)
      .filter((m) => {
        if (!m.done || !m.doneAt) return false;
        const d = new Date(m.doneAt);
        const now = new Date();
        return (
          d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
        );
      }).length;

    const minutesThisWeek = hobbies
      .flatMap((h) => h.sessions)
      .filter((s) => {
        const d = new Date(s.date);
        if (Number.isNaN(d.getTime())) return false;
        const now = new Date();
        const weekStart = new Date(now);
        const day = weekStart.getDay();
        weekStart.setDate(weekStart.getDate() - ((day + 6) % 7));
        weekStart.setHours(0, 0, 0, 0);
        return d.getTime() >= weekStart.getTime();
      })
      .reduce((s, x) => s + x.minutes, 0);

    return {
      hobbies: hobbies.length,
      milestonesDoneThisMonth,
      minutesThisWeek,
      trips: trips.length,
      visited: destinations.filter((d) => d.status === "visited").length,
      wishlist: destinations.filter((d) => d.status === "wishlist").length,
    };
  }, [hobbies, trips, destinations]);

  const activity = useMemo<ActivityItem[]>(() => {
    const items: ActivityItem[] = [];
    for (const h of hobbies) {
      for (const m of h.milestones) {
        if (m.done && m.doneAt) {
          items.push({
            id: `m-${m.id}`,
            date: m.doneAt,
            kind: "milestone",
            title: `Completed “${m.title}”`,
            detail: h.name,
            color: h.accentColor,
          });
        }
      }
      for (const s of h.sessions) {
        items.push({
          id: `s-${s.id}`,
          date: s.date,
          kind: "session",
          title: `${formatMinutes(s.minutes)} on ${h.name}`,
          detail: s.note,
          color: h.accentColor,
        });
      }
    }
    for (const d of destinations) {
      items.push({
        id: `d-${d.id}`,
        date: d.createdAt,
        kind: "destination",
        title: `Pinned ${d.name}`,
        detail: d.status,
      });
    }
    return items
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 12);
  }, [hobbies, destinations]);

  const fileInput = useRef<HTMLInputElement>(null);

  function handleExport() {
    const data = {
      version: 1,
      exportedAt: new Date().toISOString(),
      hobbies: useHobbiesStore.getState().hobbies,
      travel: {
        trips: useTravelStore.getState().trips,
        destinations: useTravelStore.getState().destinations,
      },
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `personal-dashboard-${format(new Date(), "yyyy-MM-dd")}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Backup downloaded");
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    file.text().then((text) => {
      try {
        const parsed = JSON.parse(text);
        if (
          !confirm(
            "Importing will replace your current data. Continue?"
          )
        )
          return;
        useHobbiesStore.setState({ hobbies: parsed.hobbies ?? [] });
        useTravelStore.setState({
          trips: parsed.travel?.trips ?? [],
          destinations: parsed.travel?.destinations ?? [],
        });
        toast.success("Data restored");
      } catch {
        toast.error("That doesn't look like a backup file");
      } finally {
        if (fileInput.current) fileInput.current.value = "";
      }
    });
  }

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-8 animate-fade-in">
      <PageHeader
        eyebrow={format(new Date(), "EEEE, MMM d")}
        title={`${greeting}.`}
        description="A bird's-eye view of what you're chasing right now."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={handleExport}>
              <Download className="h-3.5 w-3.5" /> Export
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => fileInput.current?.click()}
            >
              <Upload className="h-3.5 w-3.5" /> Import
            </Button>
            <input
              ref={fileInput}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={handleImport}
            />
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          icon={<Sparkles className="h-4 w-4" />}
          label="Active hobbies"
          value={stats.hobbies}
          accent="#10b981"
          to="/hobbies"
        />
        <SummaryCard
          icon={<Check className="h-4 w-4" />}
          label="Milestones this month"
          value={stats.milestonesDoneThisMonth}
          accent="#6366f1"
          to="/hobbies"
        />
        <SummaryCard
          icon={<Clock className="h-4 w-4" />}
          label="Logged this week"
          value={formatMinutes(stats.minutesThisWeek)}
          accent="#f59e0b"
          to="/hobbies"
        />
        <SummaryCard
          icon={<Map className="h-4 w-4" />}
          label="Trips planned"
          value={stats.trips}
          subValue={`${stats.visited} visited · ${stats.wishlist} wishlist`}
          accent="#ec4899"
          to="/travel"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 glass p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Hobbies in progress</h2>
            <Link
              to="/hobbies"
              className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {hobbies.length === 0 ? (
            <EmptyHint
              text="No hobbies yet."
              cta="Add one"
              to="/hobbies"
            />
          ) : (
            <ul className="space-y-3">
              {hobbies.slice(0, 4).map((h) => {
                const total = h.milestones.length;
                const done = h.milestones.filter((m) => m.done).length;
                const pct = total === 0 ? 0 : Math.round((done / total) * 100);
                return (
                  <li
                    key={h.id}
                    className="rounded-xl border border-white/10 bg-white/[0.03] p-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-medium text-sm">{h.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {done}/{total}
                      </div>
                    </div>
                    <Progress
                      className="mt-2 h-1.5"
                      value={pct}
                      indicatorColor={`linear-gradient(90deg, ${h.accentColor}, ${h.accentColor}aa)`}
                    />
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="glass p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Travel pulse</h2>
            <Link
              to="/travel"
              className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
            >
              Open map <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {trips.length === 0 && destinations.length === 0 ? (
            <EmptyHint text="No trips or pins yet." cta="Plan one" to="/travel" />
          ) : (
            <ul className="space-y-2">
              {trips.slice(0, 4).map((t) => (
                <li
                  key={t.id}
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-3"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: t.coverColor }}
                    />
                    <div className="font-medium text-sm flex-1 truncate">
                      {t.title}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {t.destinationIds.length} stops
                    </span>
                  </div>
                </li>
              ))}
              {trips.length === 0 && destinations.length > 0 && (
                <li className="text-xs text-muted-foreground">
                  {destinations.length} destinations pinned, no trips yet.
                </li>
              )}
            </ul>
          )}
        </div>
      </div>

      <div className="glass p-6 space-y-4">
        <h2 className="font-semibold">Recent activity</h2>
        {activity.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nothing here yet. Complete a milestone, log a session, or pin a
            destination — it'll show up here.
          </p>
        ) : (
          <ul className="space-y-2">
            {activity.map((a) => (
              <li
                key={a.id}
                className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2"
              >
                <ActivityIcon kind={a.kind} color={a.color} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm">{a.title}</div>
                  {a.detail && (
                    <div className="text-xs text-muted-foreground truncate">
                      {a.detail}
                    </div>
                  )}
                </div>
                <Badge variant="outline" className="shrink-0 text-[11px]">
                  {formatRelativeDays(a.date)}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  subValue,
  accent,
  to,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  subValue?: string;
  accent: string;
  to: string;
}) {
  return (
    <Link
      to={to}
      className="group glass glass-hover p-5 transition-transform hover:-translate-y-0.5"
    >
      <div className="flex items-center justify-between">
        <div
          className="h-8 w-8 rounded-lg grid place-items-center border"
          style={{
            background: `${accent}1a`,
            borderColor: `${accent}40`,
            color: accent,
          }}
        >
          {icon}
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-foreground transition-colors" />
      </div>
      <div className="mt-3 text-[11px] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
      {subValue && (
        <div className="text-xs text-muted-foreground mt-0.5">{subValue}</div>
      )}
    </Link>
  );
}

function ActivityIcon({
  kind,
  color,
}: {
  kind: ActivityItem["kind"];
  color?: string;
}) {
  const c = color ?? "#94a3b8";
  const Icon =
    kind === "milestone" ? Check : kind === "session" ? Clock : MapPin;
  return (
    <div
      className="h-7 w-7 rounded-lg grid place-items-center border shrink-0"
      style={{
        background: `${c}1a`,
        borderColor: `${c}40`,
        color: c,
      }}
    >
      <Icon className="h-3.5 w-3.5" />
    </div>
  );
}

function EmptyHint({
  text,
  cta,
  to,
}: {
  text: string;
  cta: string;
  to: string;
}) {
  return (
    <div className="rounded-xl border border-dashed border-white/10 p-6 text-center text-sm text-muted-foreground space-y-2">
      <div>{text}</div>
      <Link
        to={to}
        className="inline-flex items-center gap-1 text-primary hover:underline"
      >
        {cta} <ArrowRight className="h-3 w-3" />
      </Link>
    </div>
  );
}
