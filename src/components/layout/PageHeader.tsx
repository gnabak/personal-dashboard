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
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",
        className
      )}
    >
      <div className="space-y-2">
        {eyebrow && (
          <div
            className={cn(
              "text-xs text-comment",
              isMono ? "font-mono" : "font-sans tracking-wide uppercase"
            )}
          >
            {showPrompt && <span className="text-comment/70 mr-1.5">$</span>}
            {eyebrow}
          </div>
        )}
        <h1
          className={cn(
            "font-display text-2xl sm:text-3xl leading-tight text-emphasis"
          )}
        >
          {title}
        </h1>
        {description && (
          <p
            className={cn(
              "text-sm text-comment max-w-2xl",
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
