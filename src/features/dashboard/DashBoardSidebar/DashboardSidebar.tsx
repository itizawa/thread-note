import { UserIcon } from "@/entities/user/UserIcon";
import { Box } from "@/shared/components/Box";
import { IconButton } from "@/shared/components/IconButton";
import { Stack } from "@/shared/components/Stack";
import { Tooltip } from "@/shared/components/Tooltip";
import { urls } from "@/shared/consts/urls";
import { cn } from "@/shared/lib/utils";
import { trpc } from "@/trpc/server";
import { LaunchOutlined } from "@mui/icons-material";
import { Home, Pen, Settings } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import { SidebarThreadList } from "../../dashboard/SidebarThreadList";

export const DashBoardSidebar = () => {
  const currentUser = use(trpc.user.getCurrentUser());
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
        <UserIcon userImage={currentUser?.image} />
        <span>{currentUser?.name}</span>
        {currentUser && (
          <Link
            href={urls.userDetails(currentUser.id)}
            target="_blank"
            className="ml-auto"
          >
            <Tooltip content="ユーザーページを開く">
              <IconButton size="small">
                <LaunchOutlined />
              </IconButton>
            </Tooltip>
          </Link>
        )}
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
        <SidebarThreadList />
      </Stack>
    </Stack>
  );
};
