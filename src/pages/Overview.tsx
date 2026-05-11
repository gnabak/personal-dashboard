import { useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { useHobbiesStore } from "@/store/hobbies";
import { useTravelStore } from "@/store/travel";
import { useFinanceStore, computeGoalCurrent } from "@/store/finance";
import { fmtCurrencyCompact } from "@/lib/finance";
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
  Wallet,
} from "lucide-react";
import { format } from "date-fns";
import { cn, formatMinutes, formatRelativeDays } from "@/lib/utils";
import { toast } from "sonner";
import { useTheme } from "@/themes/context";
import type { Theme } from "@/themes";

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
  const financeGoals = useFinanceStore((s) => s.goals);
  const holdings = useFinanceStore((s) => s.holdings);
  const finTransactions = useFinanceStore((s) => s.transactions);
  const finAccounts = useFinanceStore((s) => s.accounts);
  const theme = useTheme();
  const c = theme.copy.overview;
  const isMono = theme.id === "terminal";

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 5) return theme.copy.greeting.late;
    if (h < 12) return theme.copy.greeting.morning;
    if (h < 18) return theme.copy.greeting.afternoon;
    return theme.copy.greeting.evening;
  }, [theme.copy.greeting]);

  const stats = useMemo(() => {
    const milestonesDoneThisMonth = hobbies
      .flatMap((h) => h.milestones)
      .filter((m) => {
        if (!m.done || !m.doneAt) return false;
        const d = new Date(m.doneAt);
        const now = new Date();
        return (
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
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
    return items.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 12);
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
        if (!confirm("Importing will replace your current data. Continue?"))
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

  const dateStr = format(new Date(), "EEEE, MMM d");
  const timeStr = format(new Date(), "HH:mm");

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-8 animate-fade-in">
      <PageHeader
        eyebrow={c.eyebrow(dateStr, timeStr)}
        title={greeting}
        description={c.description}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={handleExport}>
              <Download className="h-3.5 w-3.5" /> {c.actions.export}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => fileInput.current?.click()}
            >
              <Upload className="h-3.5 w-3.5" /> {c.actions.import}
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
          label={c.cards.hobbies}
          value={stats.hobbies}
          accentVar="--color-primary"
          to="/hobbies"
        />
        <SummaryCard
          icon={<Check className="h-4 w-4" />}
          label={c.cards.milestones}
          value={stats.milestonesDoneThisMonth}
          accentVar="--color-cool"
          to="/hobbies"
        />
        <SummaryCard
          icon={<Clock className="h-4 w-4" />}
          label={c.cards.logged}
          value={formatMinutes(stats.minutesThisWeek)}
          accentVar="--color-warm"
          to="/hobbies"
        />
        <SummaryCard
          icon={<Map className="h-4 w-4" />}
          label={c.cards.trips}
          value={stats.trips}
          subValue={`${stats.visited} visited · ${stats.wishlist} wishlist`}
          accentVar="--color-emphasis"
          to="/travel"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 glass p-6 space-y-4">
          <div className="flex items-center justify-between">
            <SectionHeading theme={theme}>
              {c.sections.hobbiesInProgress}
            </SectionHeading>
            <Link
              to="/hobbies"
              className={cn(
                "text-xs text-comment hover:text-primary inline-flex items-center gap-1 transition-colors",
                isMono ? "font-mono" : "font-sans"
              )}
            >
              {c.links.hobbies} <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {hobbies.length === 0 ? (
            <EmptyHint
              text={c.emptyHints.hobbies.text}
              cta={c.emptyHints.hobbies.cta}
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
                      <div
                        className={cn(
                          "text-sm",
                          isMono ? "font-mono" : "font-sans font-medium"
                        )}
                      >
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
            <SectionHeading theme={theme}>
              {c.sections.travelPulse}
            </SectionHeading>
            <Link
              to="/travel"
              className={cn(
                "text-xs text-comment hover:text-primary inline-flex items-center gap-1 transition-colors",
                isMono ? "font-mono" : "font-sans"
              )}
            >
              {c.links.travel} <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {trips.length === 0 && destinations.length === 0 ? (
            <EmptyHint
              text={c.emptyHints.travel.text}
              cta={c.emptyHints.travel.cta}
              to="/travel"
            />
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
                    <div
                      className={cn(
                        "text-sm flex-1 truncate",
                        isMono ? "font-mono" : "font-sans"
                      )}
                    >
                      {t.title}
                    </div>
                    <span className="font-mono text-[11px] text-comment">
                      {t.destinationIds.length} stops
                    </span>
                  </div>
                </li>
              ))}
              {trips.length === 0 && destinations.length > 0 && (
                <li className="text-xs text-comment">
                  {destinations.length} destinations pinned, no trips yet.
                </li>
              )}
            </ul>
          )}
        </div>
      </div>

      {financeGoals.length > 0 && (
        <div className="glass p-6 space-y-4">
          <div className="flex items-center justify-between">
            <SectionHeading theme={theme}>
              {theme.copy.finance.tabs.goals}
            </SectionHeading>
            <Link
              to="/finance"
              className={cn(
                "text-xs text-comment hover:text-primary inline-flex items-center gap-1 transition-colors",
                isMono ? "font-mono" : "font-sans"
              )}
            >
              <Wallet className="h-3 w-3" /> {theme.copy.nav.finance}
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {financeGoals.slice(0, 4).map((g) => {
              const cur = computeGoalCurrent(g, {
                holdings,
                transactions: finTransactions,
                accounts: finAccounts,
              });
              const pct =
                g.targetAmount > 0
                  ? Math.min(100, Math.round((cur / g.targetAmount) * 100))
                  : 0;
              return (
                <li
                  key={g.id}
                  className="rounded-md border border-border bg-muted/40 p-3 space-y-1.5"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span
                      className={cn(
                        "text-sm font-medium truncate",
                        isMono ? "font-mono" : "font-sans"
                      )}
                    >
                      {g.title}
                    </span>
                    <span className="font-mono text-[11px] text-comment tabular-nums shrink-0">
                      {fmtCurrencyCompact(cur, g.currency)} /{" "}
                      {fmtCurrencyCompact(g.targetAmount, g.currency)}
                    </span>
                  </div>
                  <Progress
                    value={pct}
                    indicatorColor={g.color}
                    className="h-1"
                  />
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="glass p-6 space-y-4">
        <SectionHeading theme={theme}>{c.sections.activity}</SectionHeading>
        {activity.length === 0 ? (
          <p
            className={cn(
              "text-sm text-comment",
              isMono ? "font-mono" : "font-sans"
            )}
          >
            {c.emptyHints.activity}
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
                  <div
                    className={cn(
                      "text-sm",
                      isMono ? "font-mono" : "font-sans"
                    )}
                  >
                    {a.title}
                  </div>
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

function SectionHeading({
  theme,
  children,
}: {
  theme: Theme;
  children: React.ReactNode;
}) {
  const isMono = theme.id === "terminal";
  return (
    <h2
      className={cn(
        "font-display text-lg text-emphasis",
        isMono && "font-bold"
      )}
    >
      {theme.voice.sectionPrefix && (
        <span className="text-comment mr-2">{theme.voice.sectionPrefix}</span>
      )}
      {children}
    </h2>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  subValue,
  accentVar,
  to,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  subValue?: string;
  /** CSS variable name to read the accent from (e.g. "--color-primary") */
  accentVar: string;
  to: string;
}) {
  const theme = useTheme();
  const isMono = theme.id === "terminal";
  const accent = `rgb(var(${accentVar}))`;
  return (
    <Link
      to={to}
      className="group glass glass-hover p-4 transition-colors block"
    >
      <div className="flex items-center justify-between">
        <div
          className="h-7 w-7 rounded-sm grid place-items-center border"
          style={{
            background: `rgb(var(${accentVar}) / 0.12)`,
            borderColor: `rgb(var(${accentVar}) / 0.45)`,
            color: accent,
          }}
        >
          {icon}
        </div>
        <ArrowRight className="h-3.5 w-3.5 text-comment/60 group-hover:text-primary transition-colors" />
      </div>
      <div
        className={cn(
          "mt-3 text-[11px] uppercase tracking-[0.18em] text-comment",
          isMono ? "font-mono" : "font-sans"
        )}
      >
        {label}
      </div>
      <div className="font-display text-2xl mt-1 text-foreground tabular-nums">
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
  const c = color ?? `rgb(var(--color-subtle))`;
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
  const theme = useTheme();
  const isMono = theme.id === "terminal";
  return (
    <div
      className={cn(
        "rounded-md border border-dashed border-border p-6 text-center text-sm text-comment space-y-2",
        isMono ? "font-mono" : "font-sans"
      )}
    >
      <div>{text}</div>
      <Link
        to={to}
        className="inline-flex items-center gap-1 text-primary hover:underline underline-offset-4 decoration-primary/40 hover:decoration-primary"
      >
        {cta} <ArrowRight className="h-3 w-3" />
      </Link>
    </div>
  );
}
