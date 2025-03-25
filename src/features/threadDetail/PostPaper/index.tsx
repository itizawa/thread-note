"use client";

import {
  changeToArchive,
  changeToUnArchive,
  updatePostBody,
} from "@/app/actions/postActions";
import { PostForm } from "@/entities/post/PostForm";
import { UserIcon } from "@/entities/user/UserIcon";
import { urls } from "@/shared/consts/urls";
import { useClipBoardCopy } from "@/shared/hooks/useClipBoardCopy";
import { isMacOs, isWindowsOs } from "@/shared/lib/getOs";
import { useServerAction } from "@/shared/lib/useServerAction";
import { Button } from "@/shared/ui/button";
import { MarkdownViewer } from "@/shared/ui/MarkdownViewer/index";
import { Tooltip } from "@/shared/ui/Tooltip";
import { trpc } from "@/trpc/client";
import { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";
import { format } from "date-fns";
import { Archive } from "lucide-react";
import Link from "next/link";
import React, { startTransition, useState } from "react";
import { toast } from "sonner";
import urlJoin from "url-join";
import { ManagePostDropDown } from "./ManagePostDropDown";
import { ReplyForm } from "./ReplyForm";

type Post = NonNullable<
  inferRouterOutputs<AppRouter>["thread"]["getThreadWithPosts"]["threadWithPosts"]
>["posts"][number];

interface Props {
  post: Post | Post["children"][number];
  isPublicThread: boolean;
}

export function PostPaper({ post, isPublicThread }: Props) {
  const isParentPost = "children" in post;
  const { isPending, enqueueServerAction } = useServerAction();
  const [isEditing, setIsEditing] = useState(false);
  const { user } = post;
  const [body, setBody] = React.useState(post.body);
  const isDisabled = isPending || body.length === 0;
  const utils = trpc.useUtils();
  const { copy } = useClipBoardCopy();

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

    if (isMacOs() && e.key === "Enter" && e.metaKey) {
      handleSubmit();
    }
    if (isWindowsOs() && e.key === "Enter" && e.ctrlKey) {
      handleSubmit();
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

  const handleClickPostCreatedAt = () => {
    copy(
      urlJoin(
        window.location.origin,
        urls.threadDetails(post.threadId, post.id)
      ),
      "共有URLをコピーしました"
    );
  };

  return (
    <div
      className={`
        ${
          isParentPost
            ? "rounded-lg border p-4 space-y-4"
            : "rounded-lg p-2 pr-0 space-y-4"
        }
        ${post.isArchived ? "bg-red-50" : "bg-white"}
        relative
      `}
    >
      <div className="flex items-center justify-between">
        {post.isArchived && (
          <Tooltip content="クリックしてアーカイブを解除">
            <div className="absolute right-3 top-3 z-10">
              <button
                onClick={handleClickUnArchiveButton}
                className="bg-red-200 hover:opacity-80 text-gray-600 text-xs px-2 py-0.5 rounded-full flex items-center transition-colors cursor-pointer"
                title="クリックしてアーカイブを解除"
              >
                <Archive className="h-3 w-3 mr-1" />
                アーカイブ済み
              </button>
            </div>
          </Tooltip>
        )}
        <div className="flex items-center space-x-2">
          <Link
            href={urls.userDetails(user.id)}
            className="h-8 w-8 hover:opacity-60"
          >
            <UserIcon userImage={user?.image} />
          </Link>
          <div>
            <Link href={urls.userDetails(user.id)} className="hover:opacity-60">
              <div className="text-sm">{user.name}</div>
            </Link>
            <div
              className={`text-xs text-muted-foreground ${
                isPublicThread ? "hover:opacity-60 cursor-pointer" : ""
              }`}
              onClick={isPublicThread ? handleClickPostCreatedAt : undefined}
            >
              <time>
                {format(new Date(post.createdAt), "yyyy/MM/dd HH:mm")}
              </time>
            </div>
          </div>
        </div>
        {!isEditing && !post.isArchived && (
          <ManagePostDropDown
            isPending={isPending}
            isArchived={post.isArchived}
            onClickEditButton={() => setIsEditing(true)}
            onClickArchiveButton={handleClickArchiveButton}
            onClickUnArchiveButton={handleClickUnArchiveButton}
          />
        )}
      </div>
      <div className={isEditing ? "pb-4 border-1 p-4 rounded-lg" : "p-2"}>
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
          <div
            className={`prose space-y-4 break-words ${
              post.isArchived ? "opacity-75" : ""
            }`}
          >
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
                  <PostPaper post={v} isPublicThread={isPublicThread} />
                </div>
              </div>
            );
          })}
          {!post.isArchived && (
            <ReplyForm threadId={post.threadId} parentPostId={post.id} />
          )}
        </div>
      )}
    </div>
  );
}
