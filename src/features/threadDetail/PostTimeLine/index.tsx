"use client";

import { Box } from "@/shared/components/Box";
import { IconButton } from "@/shared/components/IconButton";
import { Stack } from "@/shared/components/Stack";
import { Typography } from "@/shared/components/Typography";
import { urls } from "@/shared/consts/urls";
import { Skeleton } from "@/shared/ui/skeleton";
import { trpc } from "@/trpc/client";
import {
  ArchiveOutlined,
  ArrowBackOutlined,
  CloseOutlined,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { CreateNewPostForm } from "../CreateNewPostForm";
import { PostPaper } from "../PostPaper";
import { ReplyForm } from "../PostPaper/ReplyForm";
import { ThreadInformation } from "../ThreadInformation";

export function PostTimeLine({
  threadId,
  postId,
}: {
  threadId: string;
  postId?: string;
}) {
  return (
    <Box display="flex" height="100%">
      <Stack
        flex={2}
        minWidth={0}
        height="100%"
        sx={{
          overflowY: "auto",
          display: { xs: postId ? "none" : "flex", md: "flex" },
        }}
      >
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
            sx={{
              borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
            }}
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
      {postId && (
        <Box sx={{ flex: 1 }} key={postId} minWidth={0}>
          <PostDetailPaper threadId={threadId} postId={postId} />
        </Box>
      )}
    </Box>
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

const PostDetailPaper = ({
  threadId,
  postId,
}: {
  threadId: string;
  postId: string;
}) => {
  const [result] = trpc.post.getPostWithChildren.useSuspenseQuery({
    id: postId,
  });
  const router = useRouter();

  const handleClose = () => {
    router.push(urls.dashboardThreadDetails(threadId));
  };

  if (!result) {
    return <p>No posts available.</p>;
  }

  return (
    <Stack
      borderRight={(theme) => `1px solid ${theme.palette.divider}`}
      bgcolor="background.paper"
      height="100%"
      boxShadow="0 0 10px 0 rgba(0, 0, 0, 0.1)"
    >
      <Box
        p="8px 16px"
        display="flex"
        justifyContent={{ xs: "flex-start", md: "space-between" }}
        alignItems="center"
        sx={{
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <IconButton
          onClick={handleClose}
          size="small"
          sx={{ display: { xs: "block", md: "none" } }}
        >
          <ArrowBackOutlined />
        </IconButton>
        <Typography variant="body2" bold>
          スレッド
        </Typography>
        <IconButton
          size="small"
          onClick={handleClose}
          sx={{ display: { xs: "none", md: "block" } }}
        >
          <CloseOutlined />
        </IconButton>
      </Box>
      <Stack pb="8px" flex={1} minHeight={0} sx={{ overflowY: "auto" }}>
        <PostPaper key={result?.post.id} post={result?.post} isPublicThread />
        {result?.children.length > 0 && (
          <Box sx={{ px: { xs: "8px", md: "16px" } }}>
            <Typography variant="body2" bold color="textSecondary">
              {result?.children.length}件の返信
            </Typography>
          </Box>
        )}

        {result?.children.map((v) => {
          return <PostPaper key={v.id} post={v} isPublicThread />;
        })}
      </Stack>
      <Box
        sx={{ px: { xs: "8px", md: "16px" }, pb: { xs: "8px", md: "16px" } }}
      >
        <ReplyForm threadId={threadId} parentPostId={postId} />
      </Box>
    </Stack>
  );
};
