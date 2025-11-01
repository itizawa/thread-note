import { Skeleton } from "@/shared/components/Skeleton";

export const WorkSpaceUserAvatorSkeleton = () => {
  return (
    <Skeleton
      variant="rounded"
      sx={{ bgcolor: "grey.400" }}
      width={36}
      height={36}
    />
  );
};
