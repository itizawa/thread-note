import { Box } from "@/shared/components/Box";
import { Stack } from "@/shared/components/Stack";
import { Skeleton } from "@/shared/ui/skeleton";

export const PostTimeLineSkeleton = () => {
  return (
    <Stack height="100%" sx={{ overflowY: "scroll" }}>
      <Box
        px="16px"
        py="8px"
        sx={{
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <Skeleton className="w-full h-9" />
      </Box>
      <Stack rowGap="16px" px="16px" pt="24px">
        <Skeleton className="w-full h-20" />
        <Skeleton className="w-full h-20" />
        <Skeleton className="w-full h-20" />
      </Stack>
    </Stack>
  );
};
