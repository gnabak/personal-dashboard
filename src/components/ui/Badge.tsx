import * as React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outline" | "soft";
  color?: string;
}

export function Badge({
  className,
  variant = "default",
  color,
  style,
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded px-2 py-0.5 text-[11px] font-mono border leading-tight",
        variant === "default" &&
          "bg-muted border-border text-orange",
        variant === "outline" &&
          "bg-transparent border-border text-comment",
        variant === "soft" && "border-transparent bg-muted",
        className
      )}
      style={
        variant === "soft" && color
          ? { color, borderColor: `${color}40`, ...style }
          : style
      }
      {...props}
    />
  );
}
