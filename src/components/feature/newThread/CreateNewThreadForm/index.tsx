"use client";

import { createThreadWithFirstPost } from "@/app/actions/threadActions";
import { PostForm } from "@/components/model/post/PostForm";
import { Input } from "@/components/ui/input";
import { urls } from "@/consts/urls";
import { isMacOs, isWindowsOs } from "@/lib/getOs";
import { trpc } from "@/trpc/client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export function CreateNewThreadForm({ userId }: { userId?: string }) {
  const utils = trpc.useUtils();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [body, setBody] = React.useState("");

  const [isPending, startTransition] = React.useTransition();
  const bothEmpty = title.length === 0 && body.length === 0;
  const isDisabled = isPending || bothEmpty;

  const handleSubmit = async () => {
    startTransition(async () => {
      const { thread } = await createThreadWithFirstPost({
        title,
        body,
      });
      if (userId)
        utils.thread.listThreadsByUserId.invalidate({ userId: userId });
      router.push(urls.dashboardThreadDetails(thread.id));
    });
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setBody(newContent);
  };

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    if (isDisabled) return;

    if (isMacOs()) {
      if (e.key === "Enter" && e.metaKey) {
        handleSubmit();
      }
    }
    if (isWindowsOs()) {
      if (e.key === "Enter" && e.ctrlKey) {
        handleSubmit();
      }
    }
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="タイトルを入力してください"
        className="bg-white"
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyPress}
      />
      <div className="rounded-lg border p-4 bg-white">
        <PostForm
          textarea={{
            value: body,
            onChange: handleContentChange,
            onKeyPress: handleKeyPress,
          }}
          formState={{
            isDisabled,
            isPending,
          }}
          bottomButtons={{
            submitText: "投稿",
            onSubmit: handleSubmit,
          }}
        />
      </div>
    </div>
  );
}
