import { trpc } from "@/trpc/server";
import { use } from "react";
import { SidebarThreadListClient } from "./SidebarThreadList.client";
import { SidebarThreadListLayout } from "./SidebarThreadList.layout";

export const SidebarThreadList = () => {
  const initialData = use(
    trpc.thread.listThreadsByCurrentUser({
      limit: 20,
      sort: { type: "lastPostedAt", direction: "desc" },
      excludeClosed: true,
    })
  );

  return (
    <SidebarThreadListLayout>
      <SidebarThreadListClient initialData={initialData} />
    </SidebarThreadListLayout>
  );
};
