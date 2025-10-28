import { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";
import { SidebarThreadListClient } from "./SidebarThreadList.client";

type SidebarThreadListProps = {
  initialData: inferRouterOutputs<AppRouter>["thread"]["listThreadsByCurrentUser"];
};

export const SidebarThreadList = ({
  initialData,
}: SidebarThreadListProps) => {
  return <SidebarThreadListClient initialData={initialData} />;
};
