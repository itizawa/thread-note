"use client";

import { Box } from "@/shared/components/Box";
import { Stack } from "@/shared/components/Stack";
import { Typography } from "@/shared/components/Typography";
import { Skeleton } from "@/shared/ui/skeleton";
import { trpc } from "@/trpc/client";
import { ArchiveOutlined } from "@mui/icons-material";
import { Suspense } from "react";
import { CreateNewPostForm } from "../CreateNewPostForm";
import { PostPaper } from "../PostPaper";
import { ThreadInformation } from "../ThreadInformation";

export function PostTimeLine({ threadId }: { threadId: string }) {
  return (
    <Stack height="100%" sx={{ overflowY: "auto" }}>
      <Suspense
        fallback={
          <Stack rowGap="16px" px="16px" pt="24px">
            <Skeleton className="w-full h-9" />
          </Stack>
        }
      >
        <Box
          px="16px"
          py="8px"
          sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
        >
          <ThreadInformation threadId={threadId} />
        </Box>
      </Suspense>
      <Suspense
        fallback={
          <Box px="16px">
            <Skeleton className="w-full h-20" />
          </Box>
        }
      >
        <Box flex={1} height="100%" minHeight={0}>
          <PostTimeLineCore threadId={threadId} />
        </Box>
      </Suspense>
    </Stack>
  );
}

const PostTimeLineCore = ({ threadId }: { threadId: string }) => {
  const [{ threadWithPosts }] = trpc.thread.getThreadWithPosts.useSuspenseQuery(
    { id: threadId }
  );
  const [threadInfo] = trpc.thread.getThreadInfo.useSuspenseQuery({
    id: threadId,
  });
  const isThreadClosed = threadInfo?.status === "CLOSED";

  if (!threadWithPosts) {
    // TODO: ポストのデータを取得できなかった時のエラー処理画面を作成する https://github.com/itizawa/thread-note/issues/15
    return <p>No posts available.</p>;
  }

  return (
    <Stack height="100%" minHeight={0}>
      <Stack className="overflow-y-auto" flex={1} py="8px">
        {threadWithPosts.posts.map((v) => {
          return (
            <PostPaper
              key={v.id}
              post={v}
              isPublicThread={threadWithPosts.isPublic}
            />
          );
        })}

        {isThreadClosed && (
          <Box
            sx={{
              px: { xs: "8px", md: "16px" },
              py: { xs: "8px", md: "16px" },
            }}
          >
            <Box
              sx={{
                borderRadius: "8px",
                border: (theme) => `1px solid ${theme.palette.divider}`,
                p: { xs: "8px", md: "16px" },
                bgcolor: "background.paper",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                justifyContent: "center",
              }}
            >
              <ArchiveOutlined
                fontSize="small"
                sx={{ color: (theme) => theme.palette.text.secondary }}
              />
              <Typography variant="body2" color="textSecondary">
                このスレッドは終了しています。
              </Typography>
            </Box>
          </Box>
        )}
      </Stack>

      {!isThreadClosed && (
        <Box
          sx={{ px: { xs: "8px", md: "16px" }, pb: { xs: "8px", md: "16px" } }}
        >
          <CreateNewPostForm threadId={threadId} />
        </Box>
      )}
    </Stack>
  );
};
