"use client";

import { urls } from "@/shared/consts/urls";
import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";
import { trpc } from "@/trpc/client";
import { FilePenLine } from "lucide-react";
import Link from "next/link";

export function PublicThreadInformation({ threadId }: { threadId: string }) {
  const { data: threadInfo, isLoading } =
    trpc.thread.getPublicThreadInfo.useQuery({
      id: threadId,
    });

  const { data: currentUser, isLoading: isUserLoading } =
    trpc.user.getCurrentUser.useQuery();

  if (isLoading || isUserLoading) {
    return (
      <div className="h-8 py-1">
        <Skeleton className="w-full h-6" />
      </div>
    );
  }

  if (!threadInfo) {
    return <p>スレッドが見つかりませんでした。</p>;
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {threadInfo.emojiIcon && (
          <span className="text-xl">{threadInfo.emojiIcon}</span>
        )}
        <h3 className="font-bold">{threadInfo.title || "タイトルなし"}</h3>
      </div>
      {currentUser?.id === threadInfo.userId && (
        <Link href={urls.dashboardThreadDetails(threadId)}>
          <Button variant="outline" size="sm">
            <FilePenLine className="h-4 w-4" />
            編集
          </Button>
        </Link>
      )}
    </div>
  );
}
