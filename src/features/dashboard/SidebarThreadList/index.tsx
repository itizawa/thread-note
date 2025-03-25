"use client";

import { updateThreadInfo } from "@/app/actions/threadActions";
import { urls } from "@/shared/consts/urls";
import { useServerAction } from "@/shared/lib/useServerAction";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Input } from "@/shared/ui/input";
import { VirtualizedList } from "@/shared/ui/virtualizedList";
import { trpc } from "@/trpc/client";
import { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";
import { Edit, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { PublicStatusDialog } from "../../threadDetail/PublicStatusDialog";

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
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(thread.title || "");
  const { isPending, enqueueServerAction } = useServerAction();
  const utils = trpc.useUtils();

  const handleStartEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setEditTitle(thread.title || "");
    setIsEditing(true);
  };

  const handleSaveTitle = () => {
    if (editTitle.trim() === "") return;

    enqueueServerAction({
      action: () => updateThreadInfo({ id: thread.id, title: editTitle }),
      error: {
        text: "タイトルの更新に失敗しました",
      },
      success: {
        onSuccess: () => {
          utils.thread.listThreadsByCurrentUser.invalidate();
          setIsEditing(false);
        },
        text: "タイトルを更新しました",
      },
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSaveTitle();
    } else if (e.key === "Escape") {
      setIsEditing(false);
    }
  };

  return (
    <div className="flex items-center justify-between rounded-lg gap-4 p-2 hover:bg-gray-100 cursor-pointer">
      {isEditing ? (
        <div className="flex-1" onClick={(e) => e.stopPropagation()}>
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSaveTitle}
            autoFocus
            disabled={isPending}
            className="h-6 text-sm"
          />
        </div>
      ) : (
        <Link href={urls.dashboardThreadDetails(thread.id)} className="flex-1">
          <span className="text-sm truncate max-w-xs">
            {thread.title || "タイトルなし"}
          </span>
        </Link>
      )}
      <div onClick={(e) => e.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 p-0"
              onClick={(e) => e.stopPropagation()}
              disabled={isEditing || isPending}
            >
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">メニューを開く</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleStartEdit}>
              <Edit className="mr-2 h-4 w-4" />
              タイトルを編集
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
              asChild
            >
              <div className="w-full">
                <PublicStatusDialog
                  threadTitle={thread.title}
                  threadId={thread.id}
                  isPublic={thread.isPublic}
                />
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
