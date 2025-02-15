"use client";

import { trpc } from "@/trpc/client";
import { CreateNewPostForm } from "../CreateNewPostForm";

export function PostTimeLine({ threadId }: { threadId: string }) {
  const [{ threadWithPosts }] = trpc.thread.getThreadWithPosts.useSuspenseQuery(
    {
      id: threadId,
    }
  );

  if (!threadWithPosts) {
    // TODO: ポストのデータを取得できなかった時のエラー処理画面を作成する https://github.com/itizawa/thread-note/issues/15
    return <p>No posts available.</p>;
  }

  return (
    <div className="w-full flex-col space-y-4">
      {threadWithPosts.posts.map((v) => {
        return <p key={v.id}>{v.body}</p>;
      })}

      <CreateNewPostForm threadId={threadId} />
    </div>
  );
}
