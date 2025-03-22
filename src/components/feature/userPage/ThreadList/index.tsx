"use client";

import { UserIcon } from "@/components/model/user/UserIcon";
import { urls } from "@/consts/urls";
import { trpc } from "@/trpc/client";
import { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";
import { format } from "date-fns";
import { MessageCircle } from "lucide-react";
import Link from "next/link";
import {
  AutoSizer,
  InfiniteLoader,
  List,
  ListRowProps,
  WindowScroller,
} from "react-virtualized";

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

  const loadMoreRows = async () => {
    if (isLoading || isFetching) return;
    if (!hasNextPage) return;

    await fetchNextPage();
  };

  const isRowLoaded = ({ index }: { index: number }) => {
    return !!threads[index];
  };

  const rowRenderer = ({ index, key, style }: ListRowProps) => {
    const thread = threads[index];
    return (
      <div key={key} style={style}>
        {thread ? <PostListItem thread={thread} /> : <PostListItemSkeleton />}
      </div>
    );
  };

  const noRowsRenderer = () => (
    <div className="px-2 py-8 text-center text-gray-500">
      スレッドが存在しません
    </div>
  );

  return (
    <div className="flex flex-col space-y-4 h-full">
      <div className="flex flex-col rounded-lg border bg-white flex-1">
        <div className="border-b px-4 py-3 flex items-center justify-between">
          <h2 className="font-medium">スレッド一覧</h2>
        </div>
        <div className="flex-1">
          <WindowScroller>
            {({ height, isScrolling, onChildScroll, scrollTop }) => (
              <AutoSizer disableHeight>
                {({ width }) => (
                  <InfiniteLoader
                    isRowLoaded={isRowLoaded}
                    loadMoreRows={loadMoreRows}
                    rowCount={hasNextPage ? threads.length + 1 : threads.length}
                    threshold={10}
                  >
                    {({ onRowsRendered, registerChild }) => (
                      <List
                        ref={registerChild}
                        autoHeight
                        height={height || 500}
                        width={width}
                        isScrolling={isScrolling}
                        onScroll={onChildScroll}
                        scrollTop={scrollTop}
                        rowCount={
                          isLoading || isFetching
                            ? threads.length + 20
                            : threads.length
                        }
                        rowHeight={72}
                        rowRenderer={rowRenderer}
                        onRowsRendered={onRowsRendered}
                        noRowsRenderer={
                          isLoading || isFetching ? undefined : noRowsRenderer
                        }
                      />
                    )}
                  </InfiniteLoader>
                )}
              </AutoSizer>
            )}
          </WindowScroller>
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
