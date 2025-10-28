import { DashboardNavigation } from "@/features/dashboard/DashboardNavigation";
import { WorkSpaceSidebar } from "@/features/workSpaceSwitcher/WorkSpaceSidebar";
import { Box } from "@/shared/components/Box";
import { Stack } from "@/shared/components/Stack";
import { trpc } from "@/trpc/server";
import type React from "react";
import { Suspense } from "react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  trpc.workSpace.listWorkSpaces.prefetch();
  trpc.user.getCurrentUser.prefetch();

  return (
    <Stack height="100dvh" sx={{ overflowY: "auto" }}>
      <DashboardNavigation />
      <Box display="flex" flex={1} minHeight="0">
        <Box display={{ xs: "none", md: "block" }} height="100%">
          <Suspense fallback={<p>...loading</p>}>
            <WorkSpaceSidebar />
          </Suspense>
        </Box>
        {children}
      </Box>
    </Stack>
  );
}
