"use client";

import { createThreadWithFirstPost } from "@/app/actions/threadActions";
import { PostForm } from "@/components/model/post/PostForm";
import { urls } from "@/consts/urls";
import { trpc } from "@/trpc/client";
import { useRouter } from "next/navigation";

export function CreateNewThreadForm({ userId }: { userId?: string }) {
  const utils = trpc.useUtils();
  const router = useRouter();
  const handleSubmit = async (body: string) => {
    const { thread } = await createThreadWithFirstPost(body);
    if (userId) utils.thread.listThreadsByUserId.invalidate({ userId: userId });
    router.push(urls.dashboardThreadDetails(thread.id));
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
