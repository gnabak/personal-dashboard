import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  value?: number;
  indicatorColor?: string;
}

export const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value = 0, indicatorColor, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn("pd-progress", className)}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="pd-progress__indicator"
      style={{
        width: `${Math.min(100, Math.max(0, value))}%`,
        background: indicatorColor ?? "rgb(var(--color-emphasis))",
      }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = "Progress";
