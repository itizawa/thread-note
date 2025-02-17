import { DashBoardSidebar } from "@/components/feature/layout/Sidebar";
import { notFound } from "next/navigation";
import type React from "react";
import { getCurrentUser } from "../actions/user";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return notFound();
  }

  return (
    <div className="flex h-[calc(100vh-56px)] bg-gray-100">
      <div className="lg:block hidden">
        <DashBoardSidebar />
      </div>
      <div className="flex-1 h-full">{children}</div>
    </div>
  );
}
