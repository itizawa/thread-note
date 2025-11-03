"use client";

import { PostPaper } from "@/features/threadDetail/PostPaper";
import { ReplyForm } from "@/features/threadDetail/PostPaper/ReplyForm";
import { Box } from "@/shared/components/Box";
import { Typography } from "@/shared/components/Typography";
import { urls } from "@/shared/consts/urls";
import { trpc } from "@/trpc/client";
import { useRouter } from "next-nprogress-bar";
import {
  PostDetailPaperHeader,
  PostDetailPaperLayout,
} from "./PostDetailPaper.layout";

export const PostDetailPaper = ({
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
    <PostDetailPaperLayout
      headerSection={<PostDetailPaperHeader onClose={handleClose} />}
      contentSection={
        <>
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
        </>
      }
      footerSection={
        <Box
          sx={{ px: { xs: "8px", md: "16px" }, pb: { xs: "8px", md: "16px" } }}
        >
          <ReplyForm threadId={threadId} parentPostId={postId} />
        </Box>
      }
    />
  );
};
