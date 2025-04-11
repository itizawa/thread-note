"use client";

import { DeleteThreadDialog } from "@/entities/thread/DeleteThreadDialog";
import { urls } from "@/shared/consts/urls";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { VirtualizedList } from "@/shared/ui/virtualizedList";
import { trpc } from "@/trpc/client";
import { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";
import { MoreHorizontal, PlaneTakeoff, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type Thread =
  inferRouterOutputs<AppRouter>["thread"]["listThreadsByCurrentUser"]["threads"][number];

export function SidebarThreadList() {
  const { data, hasNextPage, fetchNextPage, isLoading, isFetching } =
    trpc.thread.listThreadsByCurrentUser.useInfiniteQuery(
      {
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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDeleteDialogOpen(true);
  };

  return (
    <>
      <div className="flex items-center justify-between rounded-lg p-2 hover:bg-gray-100 group">
        <Link
          href={urls.dashboardThreadDetails(thread.id)}
          className="flex-1 min-w-0"
        >
          <div className="flex items-center cursor-pointer">
            <span className="text-sm truncate max-w-xs">
              {thread.title || "タイトルなし"}
            </span>
          </div>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreHorizontal className="h-5 w-5 cursor-pointer hidden group-hover:block transition-opacity" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" alignOffset={-8} sideOffset={24}>
            <Link href={urls.dashboardThreadDetailsExports(thread.id)} passHref>
              <DropdownMenuItem>
                <PlaneTakeoff className="h-4 w-4" />
                スレッドの出力
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleDeleteClick}>
              <Trash2 className="h-4 w-4 text-red-500" />
              <span className="text-red-500">スレッドの削除</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <DeleteThreadDialog
        threadId={thread.id}
        threadTitle={thread.title}
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      />
    </>
  );
}
