import { DashBoardSidebar } from "@/features/dashboard/DashBoardSidebar";
import type React from "react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-100 relative">
      <div className="md:block hidden w-60 border-r">
        <DashBoardSidebar />
      </div>
      <div className="flex-1 h-full overflow-y-auto">{children}</div>
    </div>
  );
}
