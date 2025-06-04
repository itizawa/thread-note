import { LucideIcon } from "lucide-react";
import { ComponentPropsWithoutRef, forwardRef } from "react";
import { DropdownMenuItem } from "./dropdown-menu";
import { cn } from "@/shared/lib/utils";

type DropdownMenuItemWithIconProps = ComponentPropsWithoutRef<
  typeof DropdownMenuItem
> & {
  icon: LucideIcon;
  text: string;
  variant?: "default" | "destructive";
};

export const DropdownMenuItemWithIcon = forwardRef<
  React.ElementRef<typeof DropdownMenuItem>,
  DropdownMenuItemWithIconProps
>(({ icon: Icon, text, variant = "default", className, ...props }, ref) => {
  return (
    <DropdownMenuItem
      ref={ref}
      className={cn(
        variant === "destructive" && "text-destructive focus:text-destructive",
        className
      )}
      {...props}
    >
      <Icon className="h-4 w-4" />
      {text}
    </DropdownMenuItem>
  );
});

DropdownMenuItemWithIcon.displayName = "DropdownMenuItemWithIcon";