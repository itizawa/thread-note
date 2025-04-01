"use client";

import { urls } from "@/shared/consts/urls";
import { useClipBoardCopy } from "@/shared/hooks/useClipBoardCopy";
import { Button } from "@/shared/ui/button";
import { LinkToBack } from "@/shared/ui/LinkToBack";
import { Tooltip } from "@/shared/ui/Tooltip";
import { trpc } from "@/trpc/client";
import { Clipboard, RefreshCw } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import urlJoin from "url-join";

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
  const body = (threadWithPosts?.posts || []).map((v) => v.body).join("\n");

  return (
    <div className="space-y-4">
      <LinkToBack
        href={urls.dashboardThreadDetails(threadId)}
        text="編集に戻る"
      />

      <div className="flex items-center justify-between">
        <h3 className="font-bold">{threadInfo.title || "タイトルなし"}</h3>
        <div className="flex items-center">
          <Tooltip content="マークダウンをコピー">
            <Button
              variant="ghost"
              size="icon"
              className="transition-opacity hover:bg-gray-200"
              onClick={() => handleClickCopy(body)}
            >
              <Clipboard className="h-4 w-4" />
            </Button>
          </Tooltip>
          <Tooltip content="更新">
            <Button
              variant="ghost"
              size="icon"
              className="transition-opacity hover:bg-gray-200"
              onClick={handleClickRefetch}
              loading={isPending}
              disabled={isPending}
            >
              {isPending ? null : <RefreshCw className="h-4 w-4" />}
            </Button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
