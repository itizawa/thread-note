"use client";

import { createThreadWithFirstPost } from "@/app/actions/threadActions";
import { PostForm } from "@/components/model/post/PostForm";
import { Input } from "@/components/ui/input";
import { urls } from "@/consts/urls";
import { trpc } from "@/trpc/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function CreateNewThreadForm({ userId }: { userId?: string }) {
  const utils = trpc.useUtils();
  const router = useRouter();

  const [title, setTitle] = useState("");

  const handleSubmit = async (body: string) => {
    const { thread } = await createThreadWithFirstPost({
      title,
      body,
    });
    if (userId) utils.thread.listThreadsByUserId.invalidate({ userId: userId });
    router.push(urls.dashboardThreadDetails(thread.id));
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="タイトルを入力してください"
        className="bg-white"
        onChange={(e) => setTitle(e.target.value)}
      />
      <div className="rounded-lg border p-4 bg-white">
        <PostForm
          bottomButtons={{
            submitText: "投稿",
            onSubmit: handleSubmit,
          }}
        />
      </div>
    </div>
  );
}
