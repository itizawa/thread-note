import * as React from "react";

import { cn } from "@/shared/lib/utils";

const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input"> & { forceFocus?: boolean }
>(({ className, type, forceFocus, ...props }, ref) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (!forceFocus) return;
    if (!inputRef.current) return;

    const len = inputRef.current.value.length || null;
    inputRef.current.focus();
    inputRef.current.setSelectionRange(len, len);
  }, [forceFocus]);

  return (
    <input
      type={type}
      className={cn(
        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      ref={ref || inputRef}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
