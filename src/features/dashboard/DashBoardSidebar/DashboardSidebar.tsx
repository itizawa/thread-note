import { Suspense } from "react";
import {
  SidebarThreadList,
  SidebarThreadListSkeleton,
} from "../../dashboard/SidebarThreadList";
import {
  SidebarUserInformation,
  SidebarUserInformationSkeleton,
} from "../SidebarUserInformation";
import { DashboardSidebarLayout } from "./DashboardSidebar.layout";

export const DashBoardSidebar = () => {
  return (
    <DashboardSidebarLayout
      userSection={
        <Suspense fallback={<SidebarUserInformationSkeleton />}>
          <SidebarUserInformation />
        </Suspense>
      }
      threadListSection={
        <Suspense fallback={<SidebarThreadListSkeleton />}>
          <SidebarThreadList />
        </Suspense>
      }
    />
  );
};
