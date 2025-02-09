import { cn } from "@/lib/utils";
import {
  Archive,
  Bell,
  Compass,
  Home,
  Link2,
  Settings,
  User2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const DashBoardSidebar = () => {
  const routes = [
    {
      href: "/dashboard",
      label: "Home",
      icon: Home,
    },
    {
      href: "/resources",
      label: "Resources",
      icon: Link2,
    },
    {
      href: "/explore",
      label: "Explore",
      icon: Compass,
    },
    {
      href: "/profile",
      label: "Profile",
      icon: User2,
    },
    {
      href: "/inbox",
      label: "Inbox",
      icon: Bell,
    },
    {
      href: "/archived",
      label: "Archived",
      icon: Archive,
    },
    {
      href: "/settings",
      label: "Settings",
      icon: Settings,
    },
  ];

  return (
    <div className="flex h-full w-60 flex-col border-r bg-white">
      <div className="p-4">
        <div className="flex items-center space-x-2 rounded-lg p-2">
          <div className="relative h-8 w-8 overflow-hidden rounded-full">
            <Image
              src="/placeholder.svg"
              alt="Avatar"
              className="aspect-square"
              fill
            />
          </div>
          <span className="text-sm font-medium">yourselfhos...</span>
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
