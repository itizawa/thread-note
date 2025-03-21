"use client";

import { createPostInThread } from "@/app/actions/threadActions";
import { PostForm } from "@/entities/post/PostForm";
import { isMacOs, isWindowsOs } from "@/shared/lib/getOs";
import { useServerAction } from "@/shared/lib/useServerAction";
import { trpc } from "@/trpc/client";
import React from "react";

type Props = {
  threadId: string;
};
export function CreateNewPostForm({ threadId }: Props) {
  const utils = trpc.useUtils();
  const { isPending, enqueueServerAction } = useServerAction();
  const [body, setBody] = React.useState("");

  const isDisabled = isPending || body.trim().length === 0;

  const handleSubmit = () => {
    enqueueServerAction({
      action: async () => {
        await createPostInThread({ threadId, body });
        utils.thread.listThreadsByCurrentUser.invalidate();
      },
      error: {
        text: "更新に失敗しました",
      },
      success: {
        onSuccess: () => {
          utils.thread.getThreadWithPosts.invalidate({ id: threadId });
          setBody("");
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
  );
}
