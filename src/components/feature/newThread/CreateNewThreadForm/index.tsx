"use client";

import { createThreadWithFirstPost } from "@/app/actions/threadActions";
import { PostForm } from "@/components/model/post/PostForm";
import { Input } from "@/components/ui/input";
import { urls } from "@/consts/urls";

import { isMacOs, isWindowsOs } from "@/lib/getOs";
import { useServerAction } from "@/lib/useServerAction";
import { trpc } from "@/trpc/client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export function CreateNewThreadForm() {
  const utils = trpc.useUtils();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [body, setBody] = React.useState("");

  const { isPending, enqueueServerAction } = useServerAction();
  const bothEmpty = title.trim().length === 0 && body.trim().length === 0;
  const isDisabled = isPending || bothEmpty;

  const handleSubmit = () => {
    enqueueServerAction({
      action: () =>
        createThreadWithFirstPost({
          title,
          body,
        }),
      error: {
        text: "スレッドの作成に失敗しました",
      },
      success: {
        text: "スレッドを作成しました",
        onSuccess: ({ thread }) => {
          utils.thread.listThreadsByUserId.refetch();
          router.push(urls.dashboardThreadDetails(thread.id));
        },
      },
    });
  };

  const handleContentChange = (value: string) => setBody(value);

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
        forceFocus
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
