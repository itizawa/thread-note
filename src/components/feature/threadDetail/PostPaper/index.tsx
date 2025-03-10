"use client";

import {
  changeToArchive,
  changeToUnArchive,
  updatePostBody,
} from "@/app/actions/postActions";
import { PostForm } from "@/components/model/post/PostForm";
import { UserIcon } from "@/components/model/user/UserIcon";
import { Button } from "@/components/ui/button";
import { MarkdownViewer } from "@/components/ui/MarkdownViewer/index";
import { isMacOs, isWindowsOs } from "@/lib/getOs";
import { useServerAction } from "@/lib/useServerAction";
import { trpc } from "@/trpc/client";
import { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";
import { format } from "date-fns";
import React, { startTransition, useState } from "react";
import { toast } from "sonner";
import { ManagePostDropDown } from "./ManagePostDropDown";
import { ReplyForm } from "./ReplyForm";

type Post = NonNullable<
  inferRouterOutputs<AppRouter>["thread"]["getThreadWithPosts"]["threadWithPosts"]
>["posts"][number];

interface Props {
  post: Post | Post["children"][number];
}

export function PostPaper({ post }: Props) {
  const isParentPost = "children" in post;
  const { isPending, enqueueServerAction } = useServerAction();
  const [isEditing, setIsEditing] = useState(false);
  const { user } = post;

  const [body, setBody] = React.useState(post.body);

  const isDisabled = isPending || body.length === 0;
  const utils = trpc.useUtils();

  const handleSubmit = () => {
    enqueueServerAction({
      action: () => updatePostBody({ id: post.id, body }),
      error: {
        text: "更新に失敗しました",
      },
      success: {
        onSuccess: () => {
          setIsEditing(false);
          utils.thread.getThreadWithPosts.invalidate({ id: post.threadId });
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

  const handleClickUnArchiveButton = async () => {
    startTransition(async () => {
      await changeToUnArchive({ id: post.id });
      utils.thread.getThreadWithPosts.invalidate({ id: post.threadId });
      toast.success("アーカイブを取り消しました");
    });
  };

  const handleClickArchiveButton = async () => {
    startTransition(async () => {
      await changeToArchive({ id: post.id });
      utils.thread.getThreadWithPosts.invalidate({ id: post.threadId });
      toast.success("アーカイブしました", {
        action: (
          <Button
            size="sm"
            className="ml-auto shadow-none "
            variant="ghost"
            onClick={handleClickUnArchiveButton}
          >
            取り消す
          </Button>
        ),
      });
    });
  };

  return (
    <div
      className={
        isParentPost
          ? "rounded-lg border p-4 bg-white space-y-4"
          : "rounded-lg p-2 pr-0 space-y-4"
      }
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <UserIcon userImage={user?.image} size="md" />
          <div>
            <div className="text-sm">{user.name}</div>
            <div className="text-xs text-muted-foreground">
              {format(new Date(post.createdAt), "yyyy/MM/dd HH:mm")}
            </div>
          </div>
        </div>
        {!isEditing && (
          <ManagePostDropDown
            isPending={isPending}
            onClickEditButton={() => setIsEditing(true)}
            onClickArchiveButton={handleClickArchiveButton}
          />
        )}
      </div>
      <div className={isEditing ? "pb-4 border-1 p-4 rounded-lg" : ""}>
        {isEditing ? (
          <PostForm
            textarea={{
              value: body,
              onChange: handleContentChange,
              onKeyPress: handleKeyPress,
              forceFocus: true,
            }}
            formState={{
              isDisabled,
              isPending,
            }}
            bottomButtons={{
              submitText: "更新",
              onCancel: () => {
                setBody(post.body); // 初期化
                setIsEditing(false);
              },
              onSubmit: handleSubmit,
            }}
          />
        ) : (
          <div className="prose space-y-4 break-words">
            <MarkdownViewer body={post.body} />
          </div>
        )}
      </div>
      {isParentPost && (
        <div className="space-y-0">
          {post.children.map((v) => {
            return (
              <div key={v.id} className="flex relative pb-4">
                <div className="pl-2 left-0 h-full absolute">
                  <div className="w-[2px] h-full bg-gray-200" />
                </div>
                <div className="w-full pl-6">
                  <PostPaper post={v} />
                </div>
              </div>
            );
          })}
          <ReplyForm threadId={post.threadId} parentPostId={post.id} />
        </div>
      )}
    </div>
  );
}
