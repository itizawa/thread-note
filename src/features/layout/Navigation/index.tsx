import { Box } from "@/shared/components/Box";
import { Typography } from "@/shared/components/Typography";
import { Skeleton } from "@/shared/ui/skeleton";
import Link from "next/link";
import { Suspense } from "react";
import { NavigationUserIcon } from "./parts/NavigationUserIcon";

export const Navigation = () => {
  return (
    <Box
      bgcolor="navbar.main"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      p="8px 16px"
      borderBottom="1px solid"
      borderColor="divider"
    >
      <Box display="flex" alignItems="center" gap={1.5}>
        <Link href={"/"}>
          <Typography
            variant="body1"
            component="h1"
            color="primary.contrastText"
            bold
          >
            Thread Note (β)
          </Typography>
        </Link>
      </Box>
      <Suspense fallback={<Skeleton className="w-8 h-8 rounded-full" />}>
        <NavigationUserIcon />
      </Suspense>
    </Box>
  );
};
