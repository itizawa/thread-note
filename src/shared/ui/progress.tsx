"use client";

import * as ProgressPrimitive from "@radix-ui/react-progress";
import * as React from "react";

import { cn } from "@/shared/lib/utils";

const getColor = (value?: number | null) => {
  if (!value) return "bg-primary";
  if (value < 50) return "bg-primary";
  if (value < 90) return "bg-yellow-500";
  return "bg-red-500";
};

function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={`${getColor(value)} h-full w-full flex-1 transition-all`}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
