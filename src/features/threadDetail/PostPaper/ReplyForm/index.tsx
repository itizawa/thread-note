"use client";

import { createPostInThread } from "@/app/actions/threadActions";
import { PostForm } from "@/entities/post/PostForm";
import { isMacOs, isWindowsOs } from "@/shared/lib/getOs";
import { useServerAction } from "@/shared/lib/useServerAction";
import { trpc } from "@/trpc/client";
import React from "react";

type Props = {
  threadId: string;
  parentPostId: string;
};

export function ReplyForm({ threadId, parentPostId }: Props) {
  const [body, setBody] = React.useState("");

  const { isPending, enqueueServerAction } = useServerAction();
  const isDisabled = isPending || body.length === 0;
  const utils = trpc.useUtils();

  const handleSubmit = () => {
    enqueueServerAction({
      action: async () => {
        await createPostInThread({
          threadId,
          body,
          parentId: parentPostId,
        });
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
    <div className="border-1 p-4 rounded-lg">
      <PostForm
        textarea={{
          minHeight: 24,
          value: body,
          onChange: handleContentChange,
          onKeyPress: handleKeyPress,
          placeholder: "返信を入力...",
          forceFocus: true,
        }}
        formState={{
          isDisabled,
          isPending,
        }}
        bottomButtons={{
          submitText: "返信",
          onSubmit: handleSubmit,
        }}
      />
    </div>
  );
}
