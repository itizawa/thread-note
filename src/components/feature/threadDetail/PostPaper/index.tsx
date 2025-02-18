"use client";

import { changeToArchive, updatePostBody } from "@/app/actions/postActions";
import { PostForm } from "@/components/model/post/PostForm";
import { UserIcon } from "@/components/model/user/UserIcon";
import { trpc } from "@/trpc/client";
import { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";
import { format } from "date-fns";
import { useState, useTransition } from "react";
import ReactMarkdown from "react-markdown";
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
  const [isPending, startTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(false);
  const { user, body } = post;

  const utils = trpc.useUtils();

  const handleSubmit = async (body: string) => {
    await updatePostBody({ id: post.id, body });
    setIsEditing(false);
    utils.thread.getThreadWithPosts.invalidate({ id: post.threadId });
  };

  const handleClickArchiveButton = async () => {
    startTransition(async () => {
      await changeToArchive({ id: post.id });
      utils.thread.getThreadWithPosts.invalidate({ id: post.threadId });
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
      <div className="pb-4">
        {isEditing ? (
          <PostForm
            initialValue={post.body}
            bottomButtons={{
              submitText: "更新",
              onCancel: () => setIsEditing(false),
              onSubmit: handleSubmit,
            }}
          />
        ) : (
          <div className="prose prose-gray max-w-none dark:prose-invert">
            <ReactMarkdown>{body}</ReactMarkdown>
          </div>
        )}
      </div>
      <div className="space-y-0">
        {isParentPost &&
          post.children.map((v) => {
            return (
              <div key={v.id} className="flex relative pb-4">
                <div className="pl-2 left-0 h-full absolute">
                  <div className="w-[2px] h-full bg-gray-200" />
                </div>
                <div className="flex-1 pl-6">
                  <PostPaper post={v} />
                </div>
              </div>
            );
          })}
        {isParentPost && (
          <ReplyForm threadId={post.threadId} parentPostId={post.id} />
        )}
      </div>
    </div>
  );
}
