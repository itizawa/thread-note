import { getCurrentUser } from "@/app/actions/userActions";
import { UserIcon } from "@/components/model/user/UserIcon";
import { urls } from "@/consts/urls";
import { cn } from "@/lib/utils";
import { Home, Pen, Settings } from "lucide-react";
import Link from "next/link";
import { SidebarThreadList } from "../../dashboard/SidebarThreadList";

export const DashBoardSidebar = async () => {
  const currentUser = await getCurrentUser();
  const routes = [
    {
      href: urls.dashboard,
      label: "Home",
      icon: Home,
    },
    {
      href: urls.dashboardThreadNew,
      label: "New",
      icon: Pen,
    },
    {
      href: urls.dashboardSettings("profile"),
      label: "Settings",
      icon: Settings,
    },
  ];

  return (
    <div className="flex h-full flex-col bg-white overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <UserIcon userImage={currentUser?.image} size="md" />
          <span>{currentUser?.name}</span>
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
        {currentUser?.id && (
          <SidebarThreadList currentUserId={currentUser.id} />
        )}
      </nav>
    </div>
  );
};
