import { Box } from "@/shared/components/Box";
import { Typography } from "@/shared/components/Typography";
import { Skeleton } from "@/shared/ui/skeleton";
import Link from "next/link";
import { Suspense } from "react";
import { DashBoardSidebar } from "../DashBoardSidebar";
import { NavigationUserIcon } from "./parts/NavigationUserIcon";
import { SidebarSheet } from "./parts/SidebarSheet";

export const DashboardNavigation = () => {
  return (
    <Box
      bgcolor="navbar.main"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      p="8px 16px"
      borderBottom="1px solid"
      borderColor="divider"
    >
      <Box display={{ xs: "block", md: "none" }} height="24px">
        <SidebarSheet>
          <DashBoardSidebar />
        </SidebarSheet>
      </Box>
      <Link href={"/"}>
        <Typography variant="body1" bold color="primary.contrastText">
          Thread Note (β)
        </Typography>
      </Link>
      <Suspense fallback={<Skeleton className="w-8 h-8 rounded-full" />}>
        <NavigationUserIcon />
      </Suspense>
    </Box>
  );
};
