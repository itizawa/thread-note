"use client";

import { createPostInThread } from "@/app/actions/threadActions";
import { PostForm } from "@/components/model/post/PostForm";
import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";
import { MessageCircle } from "lucide-react";
import { useState } from "react";

type Props = {
  threadId: string;
  parentPostId: string;
};

export function ReplyForm({ threadId, parentPostId }: Props) {
  const [isEditing, setIsEditing] = useState(false);

  const utils = trpc.useUtils();

  const handleSubmit = async (body: string) => {
    await createPostInThread({ threadId, body, parentId: parentPostId });
    setIsEditing(false);
    utils.thread.getThreadWithPosts.invalidate({ id: threadId });
  };

  return isEditing ? (
    <div className="border-1 p-4 rounded-lg">
      <PostForm
        placeholder="返信を入力..."
        bottomButtons={{
          submitText: "更新",
          onCancel: () => setIsEditing(false),
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
