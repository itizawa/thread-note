"use client";

import { UserIcon } from "@/entities/user/UserIcon";
import { urls } from "@/shared/consts/urls";
import { MarkdownViewer } from "@/shared/ui/MarkdownViewer";
import { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";
import { format } from "date-fns";
import Link from "next/link";

type Post = NonNullable<
  inferRouterOutputs<AppRouter>["thread"]["getPublicThreadWithPosts"]["threadWithPosts"]
>["posts"][number];

interface Props {
  post: Post | Post["children"][number];
}

export function PublicPostPaper({ post }: Props) {
  const isParentPost = "children" in post;
  const { user } = post;

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
            <div className="text-xs text-muted-foreground">
              {format(new Date(post.createdAt), "yyyy/MM/dd HH:mm")}
            </div>
          </div>
        </div>
      </div>
      <div className="pb-4">
        <div className="prose space-y-4 break-words">
          <MarkdownViewer body={post.body} />
        </div>
      </div>
      <div className="space-y-0">
        {isParentPost &&
          post.children.map((childPost: Post["children"][number]) => {
            return (
              <div key={childPost.id} className="flex relative pb-4">
                <div className="pl-2 left-0 h-full absolute">
                  <div className="w-[2px] h-full bg-gray-200" />
                </div>
                <div className="w-full pl-6">
                  <PublicPostPaper post={childPost} />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
