import { DashBoardSidebar } from "@/features/dashboard/DashBoardSidebar";
import { DashboardNavigation } from "@/features/dashboard/DashboardNavigation";
import type React from "react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <DashboardNavigation />
      <div className="flex h-[calc(100vh-56px)] md:h-screen bg-gray-100">
        <div className="md:block hidden w-60 border-r">
          <DashBoardSidebar />
        </div>
        <div className="flex-1 h-full overflow-y-auto">{children}</div>
      </div>
    </>
  );
}
