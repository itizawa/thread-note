import { UserIcon } from "@/entities/user/UserIcon";
import { Box } from "@/shared/components/Box";
import { IconButton } from "@/shared/components/IconButton";
import { Tooltip } from "@/shared/components/Tooltip";
import { urls } from "@/shared/consts/urls";
import { trpc } from "@/trpc/server";
import { LaunchOutlined } from "@mui/icons-material";
import Link from "next/link";
import { use } from "react";

export const SidebarUserInformation = () => {
  const currentUser = use(trpc.user.getCurrentUser());

  return (
    <Box display="flex" alignItems="center">
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
  );
};
