import { Skeleton } from "@/shared/components/Skeleton";
import { Stack } from "@/shared/components/Stack";

export const WorkSpaceListSkeleton = () => {
  return (
    <Stack rowGap="16px">
      <Skeleton
        variant="rounded"
        width={36}
        height={36}
        sx={{ bgcolor: "grey.400" }}
      />
    </Stack>
  );
};
