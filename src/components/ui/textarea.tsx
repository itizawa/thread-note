import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea"> & { forceFocus?: boolean }
>(({ className, forceFocus, ...props }, ref) => {
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (!forceFocus) return;
    if (!inputRef.current) return;

    const len = inputRef.current.value.length || null;
    inputRef.current.focus();
    inputRef.current.setSelectionRange(len, len);
  }, [forceFocus]);

  return (
    <textarea
      className={cn(
        "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      ref={ref || inputRef}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
