import { getCurrentUser } from "@/app/actions/userActions";
import { UserIcon } from "@/entities/user/UserIcon";
import { IconButton } from "@/shared/components/IconButton";
import { Tooltip } from "@/shared/components/Tooltip";
import { urls } from "@/shared/consts/urls";
import { cn } from "@/shared/lib/utils";
import { LaunchOutlined } from "@mui/icons-material";
import { Home, Pen, Settings } from "lucide-react";
import Link from "next/link";
import { SidebarThreadList } from "../../dashboard/SidebarThreadList";

export const DashBoardSidebar = async () => {
  const currentUser = await getCurrentUser();
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
    <div className="flex h-full flex-col bg-white overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center space-x-2">
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
        </div>
      </div>
      <nav className="space-y-4 p-2 overflow-y-auto flex flex-col flex-1">
        <div className="space-y-1">
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
        </div>
        <hr />
        <SidebarThreadList />
      </nav>
    </div>
  );
};
