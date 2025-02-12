"use client";

import { createPostInThread } from "@/app/actions/threadActions";
import { PostForm } from "@/components/model/post/PostForm";

type Props = {
  threadId: string;
};
export function CreateNewPostForm({ threadId }: Props) {
  const handleSubmit = async (body: string) => {
    await createPostInThread({
      body,
      threadId,
    });
    // TODO 再取得する
  };

  return <PostForm onSubmit={handleSubmit} />;
}
