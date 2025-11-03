import { DashBoardSidebar } from "@/features/dashboard/DashBoardSidebar";
import { Box } from "@/shared/components/Box";
import { Stack } from "@/shared/components/Stack";
import { Typography } from "@/shared/components/Typography";
import { CircularProgress } from "@mui/material";
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
          errorFallback={
            <Box width="100%" height="100%">
              <Typography variant="body1" color="error">
                エラーが発生しました
              </Typography>
            </Box>
          }
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
