import { Box } from "@/shared/components/Box";
import { Typography } from "@/shared/components/Typography";
import { Skeleton } from "@/shared/ui/skeleton";
import Link from "next/link";
import { Suspense } from "react";
import { NavigationUserIcon } from "./parts/NavigationUserIcon";

export const Navigation = () => {
  return (
    <Box
      component="header"
      position="sticky"
      top={0}
      zIndex={50}
      bgcolor="navbar.main"
      sx={{
        boxShadow: 1,
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        maxWidth="1200px"
        margin="0 auto"
        height="56px"
        px={2}
      >
        <Box display="flex" alignItems="center" gap={1.5}>
          <Link href={"/"}>
            <Typography
              variant="h4"
              component="h1"
              color="primary.contrastText"
            >
              Thread Note (β)
            </Typography>
          </Link>
        </Box>
        <Suspense fallback={<Skeleton className="w-8 h-8 rounded-full" />}>
          <NavigationUserIcon />
        </Suspense>
      </Box>
    </Box>
  );
};
