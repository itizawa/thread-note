import { DashBoardSidebar } from "@/components/feature/layout/Sidebar";
import type React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <DashBoardSidebar />
      {children}
    </div>
  );
}
