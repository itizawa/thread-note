import { CreateNewPostForm } from "@/features/threadDetail/CreateNewPostForm";
import { PostPaper } from "@/features/threadDetail/PostPaper";
import { Box } from "@/shared/components/Box";
import { Stack } from "@/shared/components/Stack";
import { Typography } from "@/shared/components/Typography";
import { Skeleton } from "@/shared/ui/skeleton";
import { trpc } from "@/trpc/server";
import { ArchiveOutlined } from "@mui/icons-material";
import { Suspense, use } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { PostDetailPaper } from "../PostDetailPaper";
import { PostDetailPaperError } from "../PostDetailPaper/PostDetailPaper.error";
import { PostDetailPaperSkeleton } from "../PostDetailPaper/PostDetailPaper.skeleton";
import {
  ThreadInformation,
  ThreadInformationSkeleton,
} from "../ThreadInformation";

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
        <Suspense fallback={<ThreadInformationSkeleton />}>
          <ThreadInformation threadId={threadId} />
        </Suspense>
        <Suspense
          fallback={
            <Box px="16px" py="8px">
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
          <ErrorBoundary
            fallback={<PostDetailPaperError threadId={threadId} />}
          >
            <Suspense
              fallback={<PostDetailPaperSkeleton threadId={threadId} />}
            >
              <PostDetailPaper threadId={threadId} postId={postId} />
            </Suspense>
          </ErrorBoundary>
        </Box>
      )}
    </Box>
  );
}

const PostTimeLineCore = ({ threadId }: { threadId: string }) => {
  const { threadWithPosts } = use(
    trpc.thread.getThreadWithPosts({
      id: threadId,
    })
  );
  const threadInfo = use(
    trpc.thread.getThreadInfo({
      id: threadId,
    })
  );
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
                border: "1px solid divider",
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
                sx={{ color: "text.secondary" }}
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
