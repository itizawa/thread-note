"use client";

import { createPostInThread } from "@/app/actions/threadActions";
import { PostForm } from "@/components/model/post/PostForm";
import { Button } from "@/components/ui/button";
import { isMacOs, isWindowsOs } from "@/lib/getOs";
import { useServerAction } from "@/lib/useServerAction";
import { trpc } from "@/trpc/client";
import { MessageCircle } from "lucide-react";
import React, { useState } from "react";

type Props = {
  threadId: string;
  parentPostId: string;
};

export function ReplyForm({ threadId, parentPostId }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [body, setBody] = React.useState("");

  const { isPending, enqueueServerAction } = useServerAction();
  const isDisabled = isPending || body.length === 0;
  const utils = trpc.useUtils();

  const handleSubmit = () => {
    enqueueServerAction({
      action: () => {
        return createPostInThread({ threadId, body, parentId: parentPostId });
      },
      error: {
        text: "更新に失敗しました",
      },
      success: {
        onSuccess: () => {
          setIsEditing(false);
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

  return isEditing ? (
    <div className="border-1 p-4 rounded-lg">
      <PostForm
        textarea={{
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
          submitText: "更新",
          onCancel: () => {
            setBody(""); // 初期化
            setIsEditing(false);
          },
          onSubmit: handleSubmit,
        }}
      />
    </div>
  ) : (
    <Button variant="outline" onClick={() => setIsEditing(true)} size="sm">
      <MessageCircle className="h-4 w-4" />
      返信
    </Button>
  );
}
