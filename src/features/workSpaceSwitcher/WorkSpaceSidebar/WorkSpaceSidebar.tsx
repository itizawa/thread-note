import { Suspense } from "react";
import {
  WorkSpaceUserAvator,
  WorkSpaceUserAvatorSkeleton,
} from "../WorkSpaceUserAvator";
import { WorkSpaceList, WorkSpaceListSkeleton } from "../WorkSpaceList";
import { WorkSpaceSidebarLayout } from "./WorkSpaceSidebar.layout";

export const WorkSpaceSidebar = () => {
  return (
    <WorkSpaceSidebarLayout
      userSection={
        <Suspense fallback={<WorkSpaceUserAvatorSkeleton />}>
          <WorkSpaceUserAvator />
        </Suspense>
      }
      workSpaceListSection={
        <Suspense fallback={<WorkSpaceListSkeleton />}>
          <WorkSpaceList />
        </Suspense>
      }
    />
  );
};
