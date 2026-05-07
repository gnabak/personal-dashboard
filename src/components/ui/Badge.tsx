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
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border",
        variant === "default" && "bg-white/10 border-white/10 text-foreground",
        variant === "outline" && "bg-transparent border-white/20 text-foreground",
        variant === "soft" && "border-transparent",
        className
      )}
      style={
        variant === "soft" && color
          ? { background: `${color}1f`, color, ...style }
          : style
      }
      {...props}
    />
  );
}
