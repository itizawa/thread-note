import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { AlignJustify } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { DashBoardSidebar } from "../../layout/Sidebar";
import { NavigationUserIcon } from "./parts/NavigationUserIcon";

export const DashboardNavigation = () => {
  return (
    <header className="sticky z-50 top-0 bg-white shadow-md">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="md:hidden h-6">
          <Sheet>
            <SheetTrigger>
              <AlignJustify className="h-6 w-6" />
            </SheetTrigger>
            <SheetContent side="left" className="gap-0">
              <SheetHeader>
                <SheetTitle>
                  <Link href={"/"}>
                    <h1 className="text-lg font-medium">Thread Note (β)</h1>
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <DashBoardSidebar />
            </SheetContent>
          </Sheet>
        </div>
        <div className="flex items-center space-x-3">
          <Link href={"/"}>
            <h1 className="text-lg font-medium">Thread Note (β)</h1>
          </Link>
        </div>
        {/* <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
            <span className="sr-only">検索</span>
            </Button>
            </div> */}
        <Suspense fallback={<Skeleton className="w-8 h-8 rounded-full" />}>
          <NavigationUserIcon />
        </Suspense>
      </div>
    </header>
  );
};
