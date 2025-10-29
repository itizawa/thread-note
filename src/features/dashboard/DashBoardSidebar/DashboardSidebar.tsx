import { UserIcon } from "@/entities/user/UserIcon";
import { IconButton } from "@/shared/components/IconButton";
import { Tooltip } from "@/shared/components/Tooltip";
import { urls } from "@/shared/consts/urls";
import { AppRouter } from "@/trpc/routers/_app";
import { LaunchOutlined } from "@mui/icons-material";
import { inferRouterOutputs } from "@trpc/server";
import Link from "next/link";
import { use } from "react";
import { SidebarThreadList } from "../../dashboard/SidebarThreadList";
import { DashboardSidebarLayout } from "./DashboardSidebar.layout";

type DashBoardSidebarProps = {
  currentUserPromise: Promise<inferRouterOutputs<AppRouter>["user"]["getCurrentUser"]>;
  threadsPromise: Promise<inferRouterOutputs<AppRouter>["thread"]["listThreadsByCurrentUser"]>;
};

export const DashBoardSidebar = ({
  currentUserPromise,
  threadsPromise,
}: DashBoardSidebarProps) => {
  const currentUser = use(currentUserPromise);
  const threadsData = use(threadsPromise);

  return (
    <DashboardSidebarLayout
      userSection={
        <>
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
        </>
      }
      threadListSection={<SidebarThreadList initialData={threadsData} />}
    />
  );
};
