"use client";

import { Box } from "@/shared/components/Box";
import { urls } from "@/shared/consts/urls";
import { LinkToBack } from "@/shared/ui/LinkToBack";
import { Skeleton } from "@/shared/ui/skeleton";
import { trpc } from "@/trpc/client";
import { ArchiveOutlined } from "@mui/icons-material";
import { Typography } from "@mui/material";
import { Suspense, useState } from "react";
import { CreateNewPostForm } from "../CreateNewPostForm";
import { PostPaper } from "../PostPaper";
import { ThreadInformation } from "../ThreadInformation";

export function PostTimeLine({ threadId }: { threadId: string }) {
  const [includeIsArchived, setIncludeIsArchived] = useState(false);

  const toggleIncludeIsArchived = () => {
    setIncludeIsArchived((prev) => !prev);
  };

  return (
    <div className="space-y-4">
      <Suspense
        fallback={
          <div className="space-y-4">
            <LinkToBack href={urls.dashboard} text="Home" />
            <Skeleton className="w-full h-9" />
          </div>
        }
      >
        <ThreadInformation
          threadId={threadId}
          includeIsArchived={includeIsArchived}
          toggleIncludeIsArchived={toggleIncludeIsArchived}
        />
      </Suspense>
      <Suspense fallback={<Skeleton className="w-full h-20" />}>
        <PostTimeLineCore
          threadId={threadId}
          includeIsArchived={includeIsArchived}
        />
      </Suspense>
    </div>
  );
}

const PostTimeLineCore = ({
  threadId,
  includeIsArchived,
}: {
  threadId: string;
  includeIsArchived: boolean;
}) => {
  const [{ threadWithPosts }] = trpc.thread.getThreadWithPosts.useSuspenseQuery(
    {
      id: threadId,
      includeIsArchived,
    }
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
    <div
      className={`w-full flex-col space-y-4 overflow-y-auto ${
        threadInfo?.status === "CLOSED" ? "pb-0" : "pb-50"
      }`}
    >
      {threadWithPosts.posts.map((v) => {
        return (
          <PostPaper
            key={v.id}
            post={v}
            isPublicThread={threadWithPosts.isPublic}
            threadStatus={threadWithPosts.status}
          />
        );
      })}

      {isThreadClosed ? (
        <Box
          sx={{
            borderRadius: "8px",
            border: (theme) => `1px solid ${theme.palette.divider}`,
            p: { xs: "0px", md: "16px" },
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
          <Typography variant="body2" color="text.secondary">
            このスレッドは終了しています。新しい投稿はできません。
          </Typography>
        </Box>
      ) : (
        <CreateNewPostForm threadId={threadId} />
      )}
    </div>
  );
};
