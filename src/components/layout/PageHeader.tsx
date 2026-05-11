import * as React from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/themes/context";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  const theme = useTheme();
  const showPrompt = !!theme.voice.promptPrefix;
  const showCommentMarker = theme.id === "terminal";
  const isMono = theme.id === "terminal";
  return (
    <div className={cn("pd-page-header", className)}>
      <div className="space-y-2">
        {eyebrow && (
          <div
            className={cn(
              "pd-page-header__eyebrow",
              isMono
                ? "pd-page-header__eyebrow--mono"
                : "pd-page-header__eyebrow--sans"
            )}
          >
            {showPrompt && <span className="text-comment/70 mr-1.5">$</span>}
            {eyebrow}
          </div>
        )}
        <h1 className="pd-page-header__title">{title}</h1>
        {description && (
          <p
            className={cn(
              "pd-page-header__description",
              isMono ? "font-mono" : "font-sans"
            )}
          >
            {showCommentMarker && (
              <span className="text-comment/60 mr-1">{">"}</span>
            )}
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
