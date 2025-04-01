"use client";

import { urls } from "@/shared/consts/urls";
import { Button } from "@/shared/ui/button";
import { LinkToBack } from "@/shared/ui/LinkToBack";
import { Tooltip } from "@/shared/ui/Tooltip";
import { trpc } from "@/trpc/client";
import { RefreshCw } from "lucide-react";

export function ThreadInformation({ threadId }: { threadId: string }) {
  const [threadInfo, { refetch }] = trpc.thread.getThreadInfo.useSuspenseQuery({
    id: threadId,
  });

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

  return (
    <div className="space-y-4">
      <LinkToBack
        href={urls.dashboardThreadDetails(threadId)}
        text="編集に戻る"
      />

      <div className="flex items-center justify-between">
        <h3 className="font-bold">{threadInfo.title || "タイトルなし"}</h3>
        <Tooltip content="更新">
          <Button
            variant="ghost"
            size="icon"
            className="transition-opacity hover:bg-gray-200"
            onClick={() => refetch()}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </Tooltip>
      </div>
    </div>
  );
}
