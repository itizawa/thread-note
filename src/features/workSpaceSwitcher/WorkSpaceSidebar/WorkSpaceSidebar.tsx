import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { WorkSpaceList, WorkSpaceListSkeleton } from "../WorkSpaceList";
import {
  WorkSpaceUserAvator,
  WorkSpaceUserAvatorSkeleton,
} from "../WorkSpaceUserAvator";
import { WorkSpaceSidebarLayout } from "./WorkSpaceSidebar.layout";

export const WorkSpaceSidebar = () => {
  return (
    <WorkSpaceSidebarLayout
      userSection={
        <ErrorBoundary fallback={<WorkSpaceUserAvatorSkeleton />}>
          <Suspense fallback={<WorkSpaceUserAvatorSkeleton />}>
            <WorkSpaceUserAvator />
          </Suspense>
        </ErrorBoundary>
      }
      workSpaceListSection={
        <ErrorBoundary fallback={<WorkSpaceListSkeleton />}>
          <Suspense fallback={<WorkSpaceListSkeleton />}>
            <WorkSpaceList />
          </Suspense>
        </ErrorBoundary>
      }
    />
  );
};
