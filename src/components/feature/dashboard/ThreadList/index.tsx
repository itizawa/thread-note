"use client";

import { UserIcon } from "@/components/model/user/UserIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { urls } from "@/consts/urls";
import { trpc } from "@/trpc/client";
import { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";
import { format } from "date-fns";
import { MessageCircle, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type Thread =
  inferRouterOutputs<AppRouter>["thread"]["listThreadsByUserId"][number];

export function ThreadList({ currentUserId }: { currentUserId: string }) {
  const [keyWord, setKeyWord] = useState<string>();
  const { data: threads, isLoading: isLoadingThreads } =
    trpc.thread.listThreadsByUserId.useQuery({
      userId: currentUserId,
    });

  console.log(keyWord);

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between">
        <div className="relative bg-white">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            type="search"
            placeholder="スレッドを検索"
            className="pl-10"
            onChange={(e) => setKeyWord(e.target.value)}
          />
        </div>
        <Link href={urls.dashboardThreadNew}>
          <Button>新規Threadを作成する</Button>
        </Link>
      </div>
      <div className="rounded-lg border bg-white">
        <div className="border-b px-4 py-3">
          <h2 className="font-medium">{`スレッド一覧 ${
            threads ? `（${threads.length}）` : ""
          }`}</h2>
        </div>
        {isLoadingThreads ? (
          <>
            {new Array(5).fill(null).map((_, index) => (
              <PostListItemSkeleton key={index} />
            ))}
          </>
        ) : (
          <div>
            {threads?.map((thread) => (
              <PostListItem key={thread.id} thread={thread} />
            ))}
          </div>
        )}
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
