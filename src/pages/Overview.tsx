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
        eyebrow={`last login: ${format(new Date(), "EEEE, MMM d HH:mm").toLowerCase()}`}
        title={`${greeting.toLowerCase()}.`}
        description="a bird's-eye view of what you're chasing right now."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={handleExport}>
              <Download className="h-3.5 w-3.5" /> export
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => fileInput.current?.click()}
            >
              <Upload className="h-3.5 w-3.5" /> import
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
          label="active hobbies"
          value={stats.hobbies}
          accent="#55dc78"
          to="/hobbies"
        />
        <SummaryCard
          icon={<Check className="h-4 w-4" />}
          label="milestones this month"
          value={stats.milestonesDoneThisMonth}
          accent="#5fc3f5"
          to="/hobbies"
        />
        <SummaryCard
          icon={<Clock className="h-4 w-4" />}
          label="logged this week"
          value={formatMinutes(stats.minutesThisWeek)}
          accent="#ffa537"
          to="/hobbies"
        />
        <SummaryCard
          icon={<Map className="h-4 w-4" />}
          label="trips planned"
          value={stats.trips}
          subValue={`${stats.visited} visited · ${stats.wishlist} wishlist`}
          accent="#f0c34b"
          to="/travel"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 glass p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-gold">
              <span className="text-comment mr-2">$</span>./hobbies-in-progress
            </h2>
            <Link
              to="/hobbies"
              className="font-mono text-xs text-comment hover:text-green inline-flex items-center gap-1 transition-colors"
            >
              cd ~/hobbies <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {hobbies.length === 0 ? (
            <EmptyHint
              text="// no hobbies yet."
              cta="add one"
              to="/hobbies"
            />
          ) : (
            <ul className="space-y-2">
              {hobbies.slice(0, 4).map((h) => {
                const total = h.milestones.length;
                const done = h.milestones.filter((m) => m.done).length;
                const pct = total === 0 ? 0 : Math.round((done / total) * 100);
                return (
                  <li
                    key={h.id}
                    className="rounded-md border border-border bg-muted/40 p-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-mono text-sm text-foreground">
                        {h.name}
                      </div>
                      <div className="font-mono text-xs text-comment tabular-nums">
                        {done}/{total}
                      </div>
                    </div>
                    <Progress
                      className="mt-2 h-1"
                      value={pct}
                      indicatorColor={h.accentColor}
                    />
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="glass p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-gold">
              <span className="text-comment mr-2">$</span>./travel-pulse
            </h2>
            <Link
              to="/travel"
              className="font-mono text-xs text-comment hover:text-green inline-flex items-center gap-1 transition-colors"
            >
              cd ~/travel <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {trips.length === 0 && destinations.length === 0 ? (
            <EmptyHint text="// no trips or pins yet." cta="plan one" to="/travel" />
          ) : (
            <ul className="space-y-2">
              {trips.slice(0, 4).map((t) => (
                <li
                  key={t.id}
                  className="rounded-md border border-border bg-muted/40 p-3"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-1.5 w-1.5 rounded-sm"
                      style={{ background: t.coverColor }}
                    />
                    <div className="font-mono text-sm flex-1 truncate">
                      {t.title}
                    </div>
                    <span className="font-mono text-[11px] text-comment">
                      {t.destinationIds.length} stops
                    </span>
                  </div>
                </li>
              ))}
              {trips.length === 0 && destinations.length > 0 && (
                <li className="font-mono text-xs text-comment">
                  // {destinations.length} destinations pinned, no trips yet
                </li>
              )}
            </ul>
          )}
        </div>
      </div>

      <div className="glass p-6 space-y-4">
        <h2 className="font-display text-lg font-bold text-gold">
          <span className="text-comment mr-2">$</span>tail -n 12 activity.log
        </h2>
        {activity.length === 0 ? (
          <p className="font-mono text-sm text-comment">
            <span className="text-comment/60">{"//"}</span> nothing here yet.
            complete a milestone, log a session, or pin a destination — it'll
            show up here.
          </p>
        ) : (
          <ul className="space-y-1.5">
            {activity.map((a) => (
              <li
                key={a.id}
                className="flex items-start gap-3 rounded-md border border-border bg-muted/40 px-3 py-2"
              >
                <ActivityIcon kind={a.kind} color={a.color} />
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-sm">{a.title}</div>
                  {a.detail && (
                    <div className="font-mono text-xs text-comment truncate">
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
      className="group glass glass-hover p-4 transition-colors block"
    >
      <div className="flex items-center justify-between">
        <div
          className="h-7 w-7 rounded-sm grid place-items-center border"
          style={{
            background: `${accent}14`,
            borderColor: `${accent}50`,
            color: accent,
          }}
        >
          {icon}
        </div>
        <ArrowRight className="h-3.5 w-3.5 text-comment/60 group-hover:text-green transition-colors" />
      </div>
      <div className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-comment">
        {label}
      </div>
      <div className="font-display text-2xl font-bold mt-1 text-foreground tabular-nums">
        {value}
      </div>
      {subValue && (
        <div className="font-mono text-xs text-comment mt-0.5">{subValue}</div>
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
  const c = color ?? "#789b64";
  const Icon =
    kind === "milestone" ? Check : kind === "session" ? Clock : MapPin;
  return (
    <div
      className="h-6 w-6 rounded-sm grid place-items-center border shrink-0"
      style={{
        background: `${c}14`,
        borderColor: `${c}50`,
        color: c,
      }}
    >
      <Icon className="h-3 w-3" />
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
    <div className="rounded-md border border-dashed border-border p-6 text-center font-mono text-sm text-comment space-y-2">
      <div>{text}</div>
      <Link
        to={to}
        className="inline-flex items-center gap-1 text-green hover:underline underline-offset-4 decoration-green/40 hover:decoration-green"
      >
        {cta} <ArrowRight className="h-3 w-3" />
      </Link>
    </div>
  );
}
