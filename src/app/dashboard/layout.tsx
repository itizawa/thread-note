import { DashBoardSidebar } from "@/features/dashboard/DashBoardSidebar";
import { DashboardNavigation } from "@/features/dashboard/DashboardNavigation";
import { Box } from "@/shared/components/Box";
import { Stack } from "@/shared/components/Stack";
import type React from "react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Stack height="100vh">
      <DashboardNavigation />
      <Box display="flex" flex={1} minHeight="0">
        <Box
          display={{ xs: "none", md: "block" }}
          width="240px"
          borderRight="1px solid"
          borderColor="divider"
        >
          <DashBoardSidebar />
        </Box>
        <Box flex={1} minHeight="0" sx={{ overflowY: "auto" }}>
          {children}
        </Box>
      </Box>
    </Stack>
  );
}
