"use client";

import { VirtualizedList } from "@/components/ui/virtualizedList";
import { urls } from "@/consts/urls";
import { trpc } from "@/trpc/client";
import { AppRouter } from "@/trpc/routers/_app";
import { User } from "@prisma/client";
import { inferRouterOutputs } from "@trpc/server";
import Link from "next/link";

type Thread =
  inferRouterOutputs<AppRouter>["thread"]["listThreadsByUserId"]["threads"][number];

export function SidebarThreadList({
  currentUserId,
}: {
  currentUserId: User["id"];
}) {
  const { data, hasNextPage, fetchNextPage, isLoading, isFetching } =
    trpc.thread.listThreadsByUserId.useInfiniteQuery(
      {
        userId: currentUserId,
        limit: 20,
        sort: { type: "lastPostedAt", direction: "desc" },
      },
      { getNextPageParam: (lastPage) => lastPage.nextCursor }
    );
  const threads = data?.pages.flatMap((v) => v.threads) || [];

  return (
    <div className="overflow-y-auto flex flex-col flex-1">
      <div className="p-2 ">
        <h2 className="text-sm font-bold">スレッド一覧</h2>
      </div>
      <div className="flex-1">
        <VirtualizedList
          data={threads}
          rowRenderer={(item) => <PostListItem key={item.id} thread={item} />}
          loadingRenderer={() => <PostListItemSkeleton />}
          loadMore={fetchNextPage}
          hasNextPage={hasNextPage}
          isLoading={isLoading || isFetching}
          rowHeight={36}
          noRowsRenderer={() => (
            <div className="p-2 text-center text-gray-500">
              スレッドが存在しません
            </div>
          )}
        />
      </div>
    </div>
  );
}

function PostListItemSkeleton() {
  return (
    <div className="flex items-center p-2">
      <div className="w-full h-5 bg-gray-200 rounded"></div>
    </div>
  );
}

function PostListItem({ thread }: { thread: Thread }) {
  return (
    <Link href={urls.dashboardThreadDetails(thread.id)}>
      <div className="flex items-center justify-between rounded-lg gap-4 p-2 hover:bg-gray-100 cursor-pointer">
        <span className="text-sm truncate max-w-xs">
          {thread.emoji} {thread.title || "タイトルなし"}
        </span>
      </div>
    </Link>
  );
}
