import { CreateNewPostForm } from "@/features/threadDetail/CreateNewPostForm";
import { PostPaper } from "@/features/threadDetail/PostPaper";
import { Box } from "@/shared/components/Box";
import { Stack } from "@/shared/components/Stack";
import { Typography } from "@/shared/components/Typography";
import { trpc } from "@/trpc/server";
import { ArchiveOutlined } from "@mui/icons-material";
import { use } from "react";

export const PostTimeLine = ({ threadId }: { threadId: string }) => {
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
