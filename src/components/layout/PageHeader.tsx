import * as React from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
  command?: string;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
  command,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",
        className
      )}
    >
      <div className="space-y-2">
        {eyebrow && (
          <div className="font-mono text-xs text-comment">
            <span className="text-comment/70">$</span> {eyebrow}
          </div>
        )}
        <h1 className="font-display text-2xl sm:text-3xl font-bold leading-tight tracking-tight text-gold">
          {command && <span className="text-comment mr-2">$</span>}
          {title}
        </h1>
        {description && (
          <p className="text-sm font-mono text-comment max-w-2xl">
            <span className="text-comment/60">{">"}</span> {description}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
