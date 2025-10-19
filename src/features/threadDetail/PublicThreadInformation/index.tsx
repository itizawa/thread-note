"use client";

import { Box } from "@/shared/components/Box";
import { Button } from "@/shared/components/Button";
import { Typography } from "@/shared/components/Typography";
import { urls } from "@/shared/consts/urls";
import { Skeleton } from "@/shared/ui/skeleton";
import { trpc } from "@/trpc/client";
import { EditOutlined } from "@mui/icons-material";
import Link from "next/link";

export function PublicThreadInformation({ threadId }: { threadId: string }) {
  const { data: threadInfo, isLoading } =
    trpc.thread.getPublicThreadInfo.useQuery({
      id: threadId,
    });

  const { data: currentUser, isLoading: isUserLoading } =
    trpc.user.getCurrentUser.useQuery();

  if (isLoading || isUserLoading) {
    return (
      <div className="h-8 py-1">
        <Skeleton className="w-full h-6" />
      </div>
    );
  }

  if (!threadInfo) {
    return <p>スレッドが見つかりませんでした。</p>;
  }

  return (
    <Box display="flex" alignItems="center" justifyContent="space-between">
      <Typography variant="h3" bold>
        {threadInfo.title || "タイトルなし"}
      </Typography>
      {currentUser?.id === threadInfo.userId && (
        <Link href={urls.dashboardThreadDetails(threadId)}>
          <Button variant="outlined" startIcon={<EditOutlined />}>
            編集
          </Button>
        </Link>
      )}
    </Box>
  );
}
