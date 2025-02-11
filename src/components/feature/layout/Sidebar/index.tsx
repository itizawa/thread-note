import { UserIcon } from "@/components/model/user/UserIcon";
import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/server";
import { Home } from "lucide-react";
import Link from "next/link";

export const DashBoardSidebar = async () => {
  const { currentUser } = await trpc.currentUser();
  const routes = [
    {
      href: "/dashboard",
      label: "Home",
      icon: Home,
    },
    // {
    //   href: "/resources",
    //   label: "Resources",
    //   icon: Link2,
    // },
    // {
    //   href: "/explore",
    //   label: "Explore",
    //   icon: Compass,
    // },
    // {
    //   href: "/profile",
    //   label: "Profile",
    //   icon: User2,
    // },
    // {
    //   href: "/inbox",
    //   label: "Inbox",
    //   icon: Bell,
    // },
    // {
    //   href: "/archived",
    //   label: "Archived",
    //   icon: Archive,
    // },
    // {
    //   href: "/settings",
    //   label: "Settings",
    //   icon: Settings,
    // },
  ];

  return (
    <div className="flex h-full w-60 flex-col border-r bg-white">
      <div className="p-4">
        <div className="flex items-center space-x-2 rounded-lg p-2">
          <UserIcon user={currentUser} />
          <span>{currentUser?.name}</span>
        </div>
      </div>
      <nav className="space-y-1 p-2">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-gray-100"
              // pathname === route.href ? "bg-gray-100 font-medium" : ""
            )}
          >
            <route.icon className="h-5 w-5" />
            <span>{route.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};
