"use client";

import { urls } from "@/shared/consts/urls";
import { Button } from "@/shared/ui/button";
import { Tooltip } from "@/shared/ui/Tooltip";
import { trpc } from "@/trpc/client";
import { ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";

export function ThreadInformation({ threadId }: { threadId: string }) {
  const [threadInfo, { refetch }] = trpc.thread.getThreadInfo.useSuspenseQuery({
    id: threadId,
  });

  if (!threadInfo) {
    // TODO: ポストのデータを取得できなかった時のエラー処理画面を作成する https://github.com/itizawa/thread-note/issues/15
    return <p>ポストが存在しません</p>;
  }

  return (
    <div className="space-y-4">
      <Link
        href={urls.dashboardThreadDetails(threadId)}
        className="flex space-x-1 items-center text-gray-700 hover:opacity-60 w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-xs">記事編集に戻る</span>
      </Link>

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
