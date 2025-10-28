import { Box } from "@/shared/components/Box";
import { Skeleton } from "@/shared/components/Skeleton";
import { Stack } from "@/shared/components/Stack";
import { urls } from "@/shared/consts/urls";
import { cn } from "@/shared/lib/utils";
import { Home, Pen, Settings } from "lucide-react";
import Link from "next/link";

export const DashboardSidebarSkeleton = () => {
  const routes = [
    {
      href: urls.dashboard,
      label: "ホーム",
      icon: Home,
    },
    {
      href: urls.dashboardThreadNew,
      label: "新規作成",
      icon: Pen,
    },
    {
      href: urls.dashboardSettings("profile"),
      label: "設定",
      icon: Settings,
    },
  ];

  return (
    <Stack
      display="flex"
      height="100%"
      flex={1}
      sx={{
        overflowY: "auto",
        background: "sidebar.main",
      }}
    >
      <Box display="flex" alignItems="center" gap="8px" p="16px">
        <Skeleton sx={{ width: 32, height: 32 }} />
        <Skeleton sx={{ flex: 1, minWidth: 0 }} height={24} />
        <Skeleton width={28} height={28} />
      </Box>
      <Stack
        display="flex"
        p="8px"
        rowGap="16px"
        flex={1}
        sx={{ overflowY: "auto" }}
      >
        <Stack rowGap="8px">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-gray-100"
              )}
            >
              <route.icon className="h-5 w-5" />
              <span>{route.label}</span>
            </Link>
          ))}
        </Stack>
        <hr />
        <Skeleton width="100%" height={160} />
      </Stack>
    </Stack>
  );
};
