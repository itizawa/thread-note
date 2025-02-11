import { DashBoardSidebar } from "@/components/feature/layout/Sidebar";
import type React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-[calc(100vh-56px)] bg-gray-100">
      <div className="lg:block hidden">
        <DashBoardSidebar />
      </div>
      <div className="flex-1 h-full">{children}</div>
    </div>
  );
}
