import { Skeleton } from "@/shared/ui/skeleton";
import Link from "next/link";
import { Suspense } from "react";
import { DashBoardSidebar } from "../DashBoardSidebar";
import { NavigationUserIcon } from "./parts/NavigationUserIcon";
import { SidebarSheet } from "./parts/SidebarSheet";

export const DashboardNavigation = () => {
  return (
    <header className="sticky z-50 top-0 bg-white shadow-md">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="md:hidden h-6">
          <SidebarSheet>
            <DashBoardSidebar />
          </SidebarSheet>
        </div>
        <div className="flex items-center space-x-3">
          <Link href={"/"}>
            <h1 className="text-lg font-medium">Thread Note (β)</h1>
          </Link>
        </div>
        <Suspense fallback={<Skeleton className="w-8 h-8 rounded-full" />}>
          <NavigationUserIcon />
        </Suspense>
      </div>
    </header>
  );
};
