import * as React from "react";

import { cn } from "@/shared/lib/utils";

const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input"> & {
    forceFocus?: boolean;
    error?: boolean;
    errorMessage?: string;
  }
>(({ className, type, forceFocus, error, errorMessage, ...props }, ref) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (!forceFocus) return;
    if (!inputRef.current) return;

    const len = inputRef.current.value.length || null;
    inputRef.current.focus();
    inputRef.current.setSelectionRange(len, len);
  }, [forceFocus]);

  return (
    <div className="flex flex-col space-y-2">
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          error
            ? "border-red-500 focus-visible:ring-red-500"
            : "border-input focus-visible:ring-ring",
          className
        )}
        ref={ref || inputRef}
        {...props}
      />
      {errorMessage && <p className="text-red-500 text-xs">{errorMessage}</p>}
    </div>
  );
});
Input.displayName = "Input";

export { Input };
