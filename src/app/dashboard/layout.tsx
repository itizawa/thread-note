import { DashboardNavigation } from "@/features/dashboard/DashboardNavigation";
import { DashBoardSidebar } from "@/features/dashboard/DashBoardSidebar";
import type React from "react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="block md:hidden">
        <DashboardNavigation />
      </div>
      <div className="flex h-[calc(100vh-56px)] md:h-screen bg-gray-100">
        <div className="md:block hidden w-60 border-r">
          <DashBoardSidebar />
        </div>
        <div className="flex-1 h-full overflow-y-auto">{children}</div>
      </div>
    </>
  );
}
