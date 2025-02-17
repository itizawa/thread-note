"use client";

import { UserIcon } from "@/components/model/user/UserIcon";
import { urls } from "@/consts/urls";
import { trpc } from "@/trpc/client";
import { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";
import { format } from "date-fns";
import { MessageCircle } from "lucide-react";
import Link from "next/link";

type Thread =
  inferRouterOutputs<AppRouter>["thread"]["listThreadsByUserId"][number];

export function ThreadList({ currentUserId }: { currentUserId: string }) {
  const { data: threads, isLoading: isLoadingThreads } =
    trpc.thread.listThreadsByUserId.useQuery({
      id: currentUserId,
    });

  return (
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
        <div className="flex flex-1 flex-col gap-1">
          <div className="flex items-center justify-between gap-2">
            <div>
              <span className="font-bold">
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
