import { DashBoardSidebar } from "@/features/dashboard/DashBoardSidebar";
import { Box } from "@/shared/components/Box";
import { CircularProgress, Skeleton, Stack } from "@mui/material";
import type React from "react";
import { LoginRequired } from "../_components/LoginRequired";

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
        <DashBoardSidebar />
      </Box>
      <Box flex={1} minHeight="0" sx={{ overflowY: "auto" }}>
        <LoginRequired
          errorFallback={<Skeleton className="w-full h-full" />}
          renderLoading={() => (
            <Stack
              height="100%"
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <CircularProgress />
            </Stack>
          )}
        >
          {children}
        </LoginRequired>
      </Box>
    </Box>
  );
}
