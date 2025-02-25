import { DashboardNavigation } from "@/components/feature/dashboard/DashboardNavigation";
import { DashBoardSidebar } from "@/components/feature/layout/Sidebar";
import { notFound } from "next/navigation";
import type React from "react";
import { getCurrentUser } from "../actions/userActions";

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
