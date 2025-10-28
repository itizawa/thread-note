import { Box } from "@/shared/components/Box";
import { Skeleton } from "@/shared/components/Skeleton";
import { SidebarThreadListLayout } from "./SidebarThreadList.layout";

export const SidebarThreadListSkeleton = () => {
  return (
    <SidebarThreadListLayout>
      {Array.from({ length: 5 }).map((_, index: number) => (
        <Box p="8px" key={index}>
          <Skeleton variant="rounded" width="100%" height={20} />
        </Box>
      ))}
    </SidebarThreadListLayout>
  );
};
