"use client";

import { Box } from "@/shared/components/Box";
import { IconButton } from "@/shared/components/IconButton";
import { urls } from "@/shared/consts/urls";
import { useClipBoardCopy } from "@/shared/hooks/useClipBoardCopy";
import { LinkToBack } from "@/shared/ui/LinkToBack";
import { Tooltip } from "@/shared/ui/Tooltip";
import { trpc } from "@/trpc/client";
import { CachedOutlined, ContentPasteOutlined } from "@mui/icons-material";
import { useTransition } from "react";
import { toast } from "sonner";
import urlJoin from "url-join";
import { generateBodyForExportPage } from "../hooks/generateBodyForExportPage";

export function ThreadInformation({ threadId }: { threadId: string }) {
  const { copy } = useClipBoardCopy();
  const [isPending, startTransition] = useTransition();
  const [threadInfo, { refetch: refetchThreadInfo }] =
    trpc.thread.getThreadInfo.useSuspenseQuery({
      id: threadId,
    });
  const [{ threadWithPosts }, { refetch: refetchPosts }] =
    trpc.thread.getThreadWithPosts.useSuspenseQuery({
      id: threadId,
      includeIsArchived: false,
    });

  const handleClickRefetch = () => {
    startTransition(async () => {
      await refetchThreadInfo();
      await refetchPosts();
      await new Promise((resolve) => setTimeout(resolve, 3000));
      toast.success("更新しました");
    });
  };

  const handleClickCopy = (body: string) => {
    copy(urlJoin(body), "コピーしました");
  };

  if (!threadInfo) {
    return (
      <div className="space-y-4">
        <LinkToBack
          href={urls.dashboardThreadDetails(threadId)}
          text="編集に戻る"
        />
        <p>ポストが存在しません</p>
      </div>
    );
  }
  const body = generateBodyForExportPage(threadWithPosts?.posts || []);

  return (
    <div className="space-y-4">
      <LinkToBack
        href={urls.dashboardThreadDetails(threadId)}
        text="編集に戻る"
      />

      <div className="flex items-center justify-between">
        <h3 className="font-bold">{threadInfo.title || "タイトルなし"}</h3>
        <Box display="flex" alignItems="center">
          <Tooltip content="マークダウンをコピー">
            <IconButton size="small" onClick={() => handleClickCopy(body)}>
              <ContentPasteOutlined />
            </IconButton>
          </Tooltip>
          <Tooltip content="更新">
            <IconButton
              size="small"
              onClick={handleClickRefetch}
              loading={isPending}
              disabled={isPending}
            >
              <CachedOutlined />
            </IconButton>
          </Tooltip>
        </Box>
      </div>
    </div>
  );
}
