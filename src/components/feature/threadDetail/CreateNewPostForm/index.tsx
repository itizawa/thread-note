"use client";

import { createPostInThread } from "@/app/actions/threadActions";
import { PostForm } from "@/components/model/post/PostForm";
import { trpc } from "@/trpc/client";

type Props = {
  threadId: string;
};
export function CreateNewPostForm({ threadId }: Props) {
  const utils = trpc.useUtils();
  const handleSubmit = async (body: string) => {
    await createPostInThread({
      body,
      threadId,
    });
    utils.thread.getThreadWithPosts.invalidate({ id: threadId });
  };

  return (
    <div className="rounded-lg border p-4 bg-white">
      <PostForm
        bottomButtons={{
          submitText: "投稿",
          onSubmit: handleSubmit,
        }}
      />
    </div>
  );
}
