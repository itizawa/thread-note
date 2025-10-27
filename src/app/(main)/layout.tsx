import { DashboardNavigation } from "@/features/dashboard/DashboardNavigation";
import { Stack } from "@/shared/components/Stack";
import type React from "react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Stack height="100dvh" sx={{ overflowY: "auto" }}>
      <DashboardNavigation />
      {children}
    </Stack>
  );
}
