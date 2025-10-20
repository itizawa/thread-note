"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/ui/sheet";
import { MenuOutlined } from "@mui/icons-material";
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
        <MenuOutlined sx={{ color: "primary.contrastText" }} />
      </SheetTrigger>
      <SheetContent side="left" className="gap-0" forceMount>
        <SheetHeader>
          <SheetTitle className="text-lg font-medium">
            Thread Note (β)
          </SheetTitle>
        </SheetHeader>
        {children}
      </SheetContent>
    </Sheet>
  );
};
