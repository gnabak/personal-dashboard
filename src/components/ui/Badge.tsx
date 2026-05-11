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
        "pd-badge",
        variant === "default" && "pd-badge--default",
        variant === "outline" && "pd-badge--outline",
        variant === "soft" && "pd-badge--soft",
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
