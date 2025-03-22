"use client";

import { trpc } from "@/trpc/client";
import { CreateNewPostForm } from "../CreateNewPostForm";
import { PostPaper } from "../PostPaper";

export function PostTimeLine({ threadId }: { threadId: string }) {
  const [{ threadWithPosts }] = trpc.thread.getThreadWithPosts.useSuspenseQuery(
    {
      id: threadId,
      includeIsArchived: false,
    }
  );

  if (!threadWithPosts) {
    // TODO: ポストのデータを取得できなかった時のエラー処理画面を作成する https://github.com/itizawa/thread-note/issues/15
    return <p>No posts available.</p>;
  }

  return (
    <div className="w-full flex-col space-y-4 overflow-y-auto pb-10">
      {threadWithPosts.posts.map((v) => {
        return <PostPaper key={v.id} post={v} />;
      })}

      <CreateNewPostForm threadId={threadId} />
    </div>
  );
}
