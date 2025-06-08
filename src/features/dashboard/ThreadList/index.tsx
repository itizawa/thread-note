"use client";

import { UserIcon } from "@/entities/user/UserIcon";
import { SCROLL_CONTAINER_ID } from "@/shared/consts/domId";
import { urls } from "@/shared/consts/urls";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { VirtualizedWindowScroller } from "@/shared/ui/virtualizedWindowScroller";
import { trpc } from "@/trpc/client";
import { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";
import { formatDistanceToNowStrict } from "date-fns";
import { ja } from "date-fns/locale";
import { MessageCircle, Pen, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type Thread =
  inferRouterOutputs<AppRouter>["thread"]["listThreadsByCurrentUser"]["threads"][number];

export function ThreadList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  // 検索クエリのデバウンス処理
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // スレッド一覧取得（検索クエリがある場合は検索結果を表示）
  const { data, hasNextPage, fetchNextPage, isLoading, isFetching } =
    trpc.thread.listThreadsByCurrentUser.useInfiniteQuery(
      {
        searchQuery: debouncedSearchQuery,
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
    <div className="flex flex-col space-y-4 h-full">
      <div className="flex justify-between items-center gap-4">
        <div className="relative bg-white flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            type="search"
            placeholder="検索..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Link href={urls.dashboardThreadNew}>
          <Button>
            <Pen />
            新規作成
          </Button>
        </Link>
      </div>
      <div className="rounded-lg border bg-white">
        <div className="border-b px-4 py-3 flex items-center justify-between">
          <h2 className="font-medium">スレッド一覧</h2>
        </div>
        <VirtualizedWindowScroller
          data={threads}
          rowRenderer={(thread) => <PostListItem thread={thread} />}
          loadingRenderer={() => <PostListItemSkeleton />}
          noRowsRenderer={() => <NoRowsRenderer />}
          loadMore={fetchNextPage}
          hasNextPage={hasNextPage}
          isLoading={isLoading}
          isFetching={isFetching}
          rowHeight={72}
        />
      </div>
      {threads.length > 20 && (
        <div
          className="py-8 text-center text-gray-500 cursor-pointer hover:opacity-60"
          onClick={() =>
            document
              .getElementById(SCROLL_CONTAINER_ID)
              ?.scrollTo({ top: 0, behavior: "smooth" })
          }
        >
          <span>トップに戻る</span>
        </div>
      )}
    </div>
  );
}

function PostListItemSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4">
      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
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
    <Link href={urls.dashboardThreadDetails(thread.id)}>
      <div className="flex items-center gap-4 p-4 hover:bg-gray-100 cursor-pointer">
        <UserIcon userImage={thread.user.image} size={10} />
        <div className="flex flex-1 flex-col gap-1 overflow-x-hidden">
          <div className="flex items-center justify-between gap-2 overflow-x-hidden">
            <div className="overflow-x-hidden relative">
              <div className="flex items-center gap-2">
                {thread.emojiIcon && (
                  <span className="text-lg">{thread.emojiIcon}</span>
                )}
                <span className="block w-full font-bold truncate">
                  {thread.title || "タイトルなし"}
                </span>
              </div>
              <span className="flex flex-wrap items-center gap-0.5 text-xs text-muted-foreground">
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
      スレッドが存在しません
    </div>
  );
}
