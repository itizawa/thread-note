"use client";

import { UserIcon } from "@/components/model/user/UserIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VirtualizedList } from "@/components/ui/virtualizedList";
import { urls } from "@/consts/urls";
import { trpc } from "@/trpc/client";
import { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";
import { format } from "date-fns";
import { MessageCircle, Pen, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type Thread =
  inferRouterOutputs<AppRouter>["thread"]["listThreadsByUserId"]["threads"][number];

export function ThreadList({ currentUserId }: { currentUserId: string }) {
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
    trpc.thread.listThreadsByUserId.useInfiniteQuery(
      {
        userId: currentUserId,
        searchQuery: debouncedSearchQuery,
        limit: 20,
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
            placeholder="Search"
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Link href={urls.dashboardThreadNew}>
          <Button>
            <Pen />
            New
          </Button>
        </Link>
      </div>
      <div className="overflow-y-auto flex flex-col rounded-lg border bg-white flex-1">
        <div className="border-b px-4 py-3">
          <h2 className="font-medium">スレッド一覧</h2>
        </div>
        <div className="flex-1">
          <VirtualizedList
            data={threads}
            rowRenderer={(item) => <PostListItem key={item.id} thread={item} />}
            loadingRenderer={() => <PostListItemSkeleton />}
            loadMore={fetchNextPage}
            hasNextPage={hasNextPage}
            isLoading={isLoading}
            isFetching={isFetching}
            rowHeight={72}
            noRowsRenderer={() => (
              <div className="px-2 py-8 text-center text-gray-500">
                スレッドが存在しません
              </div>
            )}
          />
        </div>
      </div>
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
    <Link href={urls.dashboardThreadDetails(thread.id)}>
      <div className="flex items-center gap-4 p-4 hover:bg-gray-100 cursor-pointer">
        <UserIcon userImage={thread.user.image} size="md" />
        <div className="flex flex-1 flex-col gap-1 overflow-x-hidden">
          <div className="flex items-center justify-between gap-2 overflow-x-hidden">
            <div className="overflow-x-hidden relative">
              <span className="block w-full font-bold truncate">
                {thread.title || "タイトルなし"}
              </span>
              <span className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                {format(new Date(thread.createdAt), "yyyy/MM/dd HH:mm")}
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
