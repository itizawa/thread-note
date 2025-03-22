import { DashboardNavigation } from "@/feature/dashboard/DashboardNavigation";
import { DashBoardSidebar } from "@/feature/layout/Sidebar";
import type React from "react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <DashboardNavigation />
      <div className="flex h-[calc(100vh-56px)] bg-gray-100">
        <div className="md:block hidden w-60 border-r">
          <DashBoardSidebar />
        </div>
        <div className="flex-1 h-full overflow-y-auto">{children}</div>
      </div>
    </>
  );
}
