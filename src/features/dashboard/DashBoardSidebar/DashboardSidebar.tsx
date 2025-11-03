import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
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
        <ErrorBoundary fallback={<SidebarUserInformationSkeleton />}>
          <Suspense fallback={<SidebarUserInformationSkeleton />}>
            <SidebarUserInformation />
          </Suspense>
        </ErrorBoundary>
      }
      threadListSection={
        <ErrorBoundary fallback={<SidebarThreadListSkeleton />}>
          <Suspense fallback={<SidebarThreadListSkeleton />}>
            <SidebarThreadList />
          </Suspense>
        </ErrorBoundary>
      }
    />
  );
};
