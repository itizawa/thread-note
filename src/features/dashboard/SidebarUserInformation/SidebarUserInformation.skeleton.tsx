import { Box } from "@/shared/components/Box";
import { Skeleton } from "@/shared/components/Skeleton";

export const SidebarUserInformationSkeleton = () => {
  return (
    <Box display="flex" alignItems="center" width="100%" columnGap="8px">
      <Skeleton variant="circular" sx={{ width: 32, height: 32 }} />
      <Skeleton sx={{ flex: 1, minWidth: 0 }} height={24} />
      <Skeleton variant="rounded" width={28} height={28} />
    </Box>
  );
};
