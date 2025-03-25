"use client";

import { useScrollToTarget } from "@/shared/hooks/useScrollToTarget";
import { trpc } from "@/trpc/client";
import { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";
import { PublicPostPaper } from "../PublicPostPaper";

type Post = NonNullable<
  inferRouterOutputs<AppRouter>["thread"]["getPublicThreadWithPosts"]["threadWithPosts"]
>["posts"][number];

export function PublicPostTimeLine({ threadId }: { threadId: string }) {
  const [{ threadWithPosts }] =
    trpc.thread.getPublicThreadWithPosts.useSuspenseQuery({ id: threadId });

  const { handleScroll } = useScrollToTarget();

  if (!threadWithPosts) {
    return <p>投稿が見つかりませんでした。</p>;
  }

  return (
    <div className="w-full flex-col space-y-4 overflow-y-auto pb-10">
      {threadWithPosts.posts.map((post: Post) => {
        return (
          <PublicPostPaper
            key={post.id}
            post={post}
            onClickScrollTarget={handleScroll}
          />
        );
      })}
    </div>
  );
}
