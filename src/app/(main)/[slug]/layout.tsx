import { Box } from "@/shared/components/Box";
import type React from "react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box display="flex" flex={1} minHeight="0">
      <Box
        display={{ xs: "none", md: "block" }}
        width="240px"
        borderRight="1px solid"
        borderColor="divider"
      >
        TODO(ここにワークスペースのサイドバー)
      </Box>
      <Box flex={1} minHeight="0" sx={{ overflowY: "auto" }}>
        {children}
      </Box>
    </Box>
  );
}
