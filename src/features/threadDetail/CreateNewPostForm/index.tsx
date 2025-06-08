"use client";

import { createPostInThread } from "@/app/actions/threadActions";
import { PostForm } from "@/entities/post/PostForm";
import { isMacOs, isWindowsOs } from "@/shared/lib/getOs";
import { useServerAction } from "@/shared/lib/useServerAction";
import { trpc } from "@/trpc/client";
import { Archive } from "lucide-react";
import React from "react";

type Props = {
  threadId: string;
};
export function CreateNewPostForm({ threadId }: Props) {
  const utils = trpc.useUtils();
  const { isPending, enqueueServerAction } = useServerAction();
  const [body, setBody] = React.useState("");
  const { data: threadInfo } = trpc.thread.getThreadInfo.useQuery({
    id: threadId,
  });

  const isThreadClosed = threadInfo?.status === "CLOSED";
  const isDisabled = isPending || body.trim().length === 0 || isThreadClosed;

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
      {isThreadClosed ? (
        <div className="flex items-center justify-center p-4 text-gray-500">
          <div className="flex items-center space-x-2">
            <Archive className="h-5 w-5" />
            <span>このスレッドは終了しています。新しい投稿はできません。</span>
          </div>
        </div>
      ) : (
        <PostForm
          textarea={{
            value: body,
            onChange: handleContentChange,
            onKeyPress: handleKeyPress,
            forceFocus: !isThreadClosed,
          }}
          formState={{
            isDisabled: Boolean(isDisabled),
            isPending,
          }}
          bottomButtons={{
            submitText: "投稿",
            onSubmit: handleSubmit,
          }}
        />
      )}
    </div>
  );
}
