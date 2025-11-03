import { Box } from "@/shared/components/Box";
import { Skeleton } from "@mui/material";

export function ThreadInformationSkeleton() {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      gap="8px"
      p="8px 16px"
      sx={{ borderBottom: "1px solid", borderColor: "divider" }}
    >
      <Box p="4px">
        <Skeleton variant="rounded" width="300px" height="24px" />
      </Box>
      <Box display="flex" alignItems="center" gap="8px">
        <Skeleton variant="rounded" width="80px" height="28px" />
        <Skeleton variant="rounded" width="56px" height="28px" />
        <Skeleton variant="rounded" width="28px" height="28px" />
      </Box>
    </Box>
  );
}
