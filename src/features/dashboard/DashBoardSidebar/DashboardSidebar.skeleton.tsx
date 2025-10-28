import { Skeleton } from "@/shared/components/Skeleton";
import { SidebarThreadListSkeleton } from "../../dashboard/SidebarThreadList";
import { DashboardSidebarLayout } from "./DashboardSidebar.layout";

export const DashboardSidebarSkeleton = () => {
  return (
    <DashboardSidebarLayout
      userSection={
        <>
          <Skeleton variant="circular" sx={{ width: 32, height: 32 }} />
          <Skeleton sx={{ flex: 1, minWidth: 0 }} height={24} />
          <Skeleton variant="rounded" width={28} height={28} />
        </>
      }
      threadListSection={<SidebarThreadListSkeleton />}
    />
  );
};
