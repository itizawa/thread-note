import * as React from "react";

import { cn } from "@/shared/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea"> & {
    forceFocus?: boolean;
    error?: boolean;
    errorMessage?: string;
  }
>(({ className, forceFocus, error, errorMessage, ...props }, ref) => {
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  React.useImperativeHandle(ref, () => inputRef.current!, [inputRef]);

  React.useEffect(() => {
    if (!forceFocus) return;
    if (!inputRef.current) return;

    const len = inputRef.current.value.length || null;
    inputRef.current.focus();
    inputRef.current.setSelectionRange(len, len);
  }, [forceFocus]);

  return (
    <div className="flex flex-col space-y-2">
      <textarea
        className={cn(
          "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          error
            ? "border-red-500 focus-visible:ring-red-500"
            : "border-input focus-visible:ring-ring",
          className
        )}
        ref={inputRef}
        {...props}
      />
      {errorMessage && <p className="text-red-500 text-xs">{errorMessage}</p>}
    </div>
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
