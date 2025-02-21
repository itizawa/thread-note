"use client";

import { createPostInThread } from "@/app/actions/threadActions";
import { PostForm } from "@/components/model/post/PostForm";
import { Button } from "@/components/ui/button";
import { isMacOs, isWindowsOs } from "@/lib/getOs";
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

  const [isPending, startTransition] = React.useTransition();
  const isDisabled = isPending || body.length === 0;
  const utils = trpc.useUtils();

  const handleSubmit = async () => {
    startTransition(async () => {
      await createPostInThread({ threadId, body, parentId: parentPostId });
      setIsEditing(false);
      utils.thread.getThreadWithPosts.invalidate({ id: threadId });
      setBody("");
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
