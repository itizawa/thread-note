"use client";

import { Skeleton } from "@/shared/ui/skeleton";
import { trpc } from "@/trpc/client";

export function PublicThreadInformation({ threadId }: { threadId: string }) {
  const { data: threadInfo, isLoading } =
    trpc.thread.getPublicThreadInfo.useQuery({
      id: threadId,
    });

  if (isLoading) {
    return <Skeleton className="w-full h-9" />;
  }

  if (!threadInfo) {
    return <p>スレッドが見つかりませんでした。</p>;
  }

  return (
    <div className="flex items-center justify-between">
      <h3 className="font-bold">{threadInfo.title || "タイトルなし"}</h3>
    </div>
  );
}
