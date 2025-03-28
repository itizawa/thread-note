"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/ui/sheet";
import { AlignJustify } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export const SidebarSheet = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathName = usePathname();

  useEffect(() => {
    if (pathName) setIsOpen(false);
  }, [pathName]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger>
        <AlignJustify className="h-6 w-6" />
      </SheetTrigger>
      <SheetContent side="left" className="gap-0" forceMount>
        <SheetHeader>
          <SheetTitle className="text-lg font-medium">
            Thread Note (β)
          </SheetTitle>
          <SheetDescription />
        </SheetHeader>
        {children}
      </SheetContent>
    </Sheet>
  );
};
