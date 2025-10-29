import { Box } from "@/shared/components/Box";
import { Typography } from "@/shared/components/Typography";
import { Skeleton } from "@/shared/ui/skeleton";
import { trpc } from "@/trpc/server";
import Link from "next/link";
import { Suspense } from "react";
import {
  DashBoardSidebar,
  DashboardSidebarSkeleton,
} from "../DashBoardSidebar";
import { NavigationUserIcon } from "./parts/NavigationUserIcon";
import { SidebarSheet } from "./parts/SidebarSheet";

export const DashboardNavigation = () => {
  // 並列でデータを取得
  const currentUserPromise = trpc.user.getCurrentUser();
  const threadsPromise = trpc.thread.listThreadsByCurrentUser({
    limit: 20,
    sort: { type: "lastPostedAt", direction: "desc" },
    excludeClosed: true,
  });

  return (
    <Box
      bgcolor="navbar.main"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      p="8px 16px"
      borderColor="divider"
    >
      <Box display={{ xs: "block", md: "none" }} height="24px">
        <SidebarSheet>
          <Suspense fallback={<DashboardSidebarSkeleton />}>
            <DashBoardSidebar
              currentUserPromise={currentUserPromise}
              threadsPromise={threadsPromise}
            />
          </Suspense>
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
