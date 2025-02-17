"use client";

import { urls } from "@/consts/urls";
import { trpc } from "@/trpc/client";
import { AppRouter } from "@/trpc/routers/_app";
import { User } from "@prisma/client";
import { inferRouterOutputs } from "@trpc/server";
import Link from "next/link";

type Thread =
  inferRouterOutputs<AppRouter>["thread"]["listThreadsByUserId"][number];

export function SidebarThreadList({
  currentUserId,
}: {
  currentUserId: User["id"];
}) {
  const { data: threads, isLoading: isLoadingThreads } =
    trpc.thread.listThreadsByUserId.useQuery({
      id: currentUserId,
    });

  return (
    <div className="overflow-y-auto flex flex-col">
      <div className="p-2">
        <h2 className="text-sm font-bold">スレッド一覧</h2>
      </div>
      {isLoadingThreads ? (
        <>
          {new Array(5).fill(null).map((_, index) => (
            <PostListItemSkeleton key={index} />
          ))}
        </>
      ) : (
        <div className="overflow-y-auto">
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
          {thread.title || "タイトルなし"}
        </span>
      </div>
    </Link>
  );
}
