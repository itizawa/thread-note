"use client";

import { generateReplyPost } from "@/app/actions/postActions";
import { createPostInThread } from "@/app/actions/threadActions";
import { PostForm } from "@/entities/post/PostForm";
import { isMacOs, isWindowsOs } from "@/lib/getOs";
import { useServerAction } from "@/lib/useServerAction";
import { Button } from "@/shared/ui/button";
import { trpc } from "@/trpc/client";
import { MessageCircle } from "lucide-react";
import React, { useState } from "react";
import { AiModelSelect } from "../AiModelSelectButton";

type Props = {
  threadId: string;
  parentPostId: string;
};

export function ReplyForm({ threadId, parentPostId }: Props) {
  const { data: currentUser } = trpc.user.getCurrentUser.useQuery();
  const [isEditing, setIsEditing] = useState(false);
  const [body, setBody] = React.useState("");
  const [type, setType] = React.useState<"agreement" | "survey" | "feedback">(
    "survey"
  );

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

  const handleClickGenerateReply = () => {
    enqueueServerAction({
      action: () => {
        return generateReplyPost({ postId: parentPostId, type });
      },
      error: {
        text: "生成に失敗しました",
      },
      success: {
        text: "生成しました",
        onSuccess: () => {
          setIsEditing(false);
          utils.thread.getThreadWithPosts.invalidate({ id: threadId });
          setBody("");
        },
      },
    });
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
    <div className="flex justify-between items-center">
      <Button variant="outline" onClick={() => setIsEditing(true)} size="sm">
        <MessageCircle className="h-4 w-4" />
        返信
      </Button>
      {currentUser?.planSubscription?.plan.name === "admin" && (
        <div className="flex items-center gap-x-2">
          <AiModelSelect type={type} onSelect={(type) => setType(type)} />
          <Button
            loading={isPending}
            disabled={isPending}
            className="rounded bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-2 px-4 rounded"
            onClick={handleClickGenerateReply}
          >
            生成
          </Button>
        </div>
      )}
    </div>
  );
}
