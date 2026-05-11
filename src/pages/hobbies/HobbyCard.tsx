import { Progress } from "@/components/ui/Progress";
import { Badge } from "@/components/ui/Badge";
import { formatMinutes, formatRelativeDays } from "@/lib/utils";
import type { Hobby } from "@/types/hobbies";
import { getHobbyIcon } from "./iconMap";
import { Flame, ListChecks, Timer } from "lucide-react";

interface HobbyCardProps {
  hobby: Hobby;
  onClick: () => void;
}

export function HobbyCard({ hobby, onClick }: HobbyCardProps) {
  const Icon = getHobbyIcon(hobby.icon);
  const total = hobby.milestones.length;
  const done = hobby.milestones.filter((m) => m.done).length;
  const progress = total === 0 ? 0 : Math.round((done / total) * 100);
  const totalMinutes = hobby.sessions.reduce((s, x) => s + x.minutes, 0);
  const lastDate = hobby.sessions
    .map((s) => s.date)
    .sort()
    .at(-1);

  const accent = hobby.accentColor;

  return (
    <button
      onClick={onClick}
      className="group pd-hobby-card"
      style={{ ["--accent" as string]: accent }}
    >
      <div
        className="pd-hobby-card__edge"
        style={{
          background: `linear-gradient(90deg, transparent, ${accent}80, transparent)`,
        }}
      />
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="pd-hobby-card__icon"
            style={{
              background: `${accent}1a`,
              borderColor: `${accent}40`,
              color: accent,
            }}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <div className="font-semibold leading-tight">{hobby.name}</div>
            {hobby.description && (
              <div className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                {hobby.description}
              </div>
            )}
          </div>
        </div>
        <Badge variant="soft" color={accent}>
          <Flame className="h-3 w-3 mr-1" />
          {formatRelativeDays(lastDate)}
        </Badge>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Milestones</span>
          <span className="text-foreground/80">
            {done} / {total || 0}
          </span>
        </div>
        <Progress
          value={progress}
          indicatorColor={`linear-gradient(90deg, ${accent}, ${accent}aa)`}
        />
      </div>

      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <ListChecks className="h-3.5 w-3.5" /> {total} total
        </span>
        <span className="inline-flex items-center gap-1">
          <Timer className="h-3.5 w-3.5" /> {formatMinutes(totalMinutes)}
        </span>
      </div>
    </button>
  );
}
