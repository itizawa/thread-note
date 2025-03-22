"use client";

import { UserIcon } from "@/entities/user/UserIcon";
import { urls } from "@/shared/consts/urls";
import { VirtualizedWindowScroller } from "@/shared/ui/virtualizedWindowScroller";
import { trpc } from "@/trpc/client";
import { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";
import { formatDistanceToNowStrict } from "date-fns";
import { ja } from "date-fns/locale";
import { MessageCircle } from "lucide-react";
import Link from "next/link";

type Thread =
  inferRouterOutputs<AppRouter>["thread"]["listThreadsByUserId"]["threads"][number];

export function ThreadList({ userId }: { userId: string }) {
  // スレッド一覧取得（検索クエリがある場合は検索結果を表示）
  const { data, hasNextPage, fetchNextPage, isLoading, isFetching } =
    trpc.thread.listThreadsByUserId.useInfiniteQuery(
      {
        userId,
        limit: 20,
        sort: {
          type: "lastPostedAt",
          direction: "desc",
        },
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  const threads = data?.pages.flatMap((v) => v.threads) || [];

  return (
    <div className="rounded-lg border bg-white">
      <div className="border-b px-4 py-3 flex items-center justify-between">
        <h2 className="font-medium">スレッド一覧</h2>
      </div>
      <VirtualizedWindowScroller
        data={threads}
        rowRenderer={(thread: Thread) => <PostListItem thread={thread} />}
        loadingRenderer={() => <PostListItemSkeleton />}
        noRowsRenderer={() => <NoRowsRenderer />}
        loadMore={fetchNextPage}
        hasNextPage={hasNextPage}
        isLoading={isLoading}
        isFetching={isFetching}
        rowHeight={72}
      />
    </div>
  );
}

function PostListItemSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4">
      <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col gap-2">
            <div className="w-40 h-5 bg-gray-200 rounded"></div>
            <div className="w-20 h-3 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PostListItem({ thread }: { thread: Thread }) {
  return (
    <Link href={urls.threadDetails(thread.id)}>
      <div className="flex items-center gap-4 p-4 hover:bg-gray-100 cursor-pointer">
        <UserIcon userImage={thread.user.image} size="md" />
        <div className="flex flex-1 flex-col gap-1 overflow-x-hidden">
          <div className="flex items-center justify-between gap-2 overflow-x-hidden">
            <div className="overflow-x-hidden relative">
              <span className="block w-full font-bold truncate">
                {thread.title || "タイトルなし"}
              </span>
              <span className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                {`${formatDistanceToNowStrict(new Date(thread.lastPostedAt), {
                  addSuffix: true,
                  locale: ja,
                })}に更新`}
              </span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <MessageCircle className="h-4 w-4" />
              <span className="text-sm">{thread._count.posts}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function NoRowsRenderer() {
  return (
    <div className="px-2 py-8 text-center text-gray-500">
      公開中のスレッドが存在しません
    </div>
  );
}
