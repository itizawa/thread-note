"use client";

import { createThreadWithFirstPost } from "@/app/actions/threadActions";
import { PostForm } from "@/components/model/post/PostForm";

export function CreateNewThreadForm() {
  const handleSubmit = async (body: string) => {
    await createThreadWithFirstPost(body);
  };

  return <PostForm onSubmit={handleSubmit} />;
}
