import { Skeleton } from "@mui/material";

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
