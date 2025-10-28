"use client";

import { UserIcon } from "@/entities/user/UserIcon";
import { urls } from "@/shared/consts/urls";
import { useClipBoardCopy } from "@/shared/hooks/useClipBoardCopy";
import { MarkdownViewer } from "@/shared/ui/MarkdownViewer";
import { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";
import { format } from "date-fns";
import Link from "next/link";
import urlJoin from "url-join";
import { ManagePostDropDown } from "./ManagePostDropDown";

type Post = NonNullable<
  inferRouterOutputs<AppRouter>["thread"]["getPublicThreadWithPosts"]["threadWithPosts"]
>["posts"][number];

interface Props {
  post: Post | Post["children"][number];
  onClickScrollTarget: (scrollId: string) => void;
}

export function PublicPostPaper({ post, onClickScrollTarget }: Props) {
  const isParentPost = "children" in post;
  const { user } = post;
  const { copy } = useClipBoardCopy();

  const handleClickPostCreatedAt = () => {
    copy(
      urlJoin(
        window.location.origin,
        urls.threadDetails({ threadId: post.threadId, postId: post.id })
      ),
      "URLをコピーしました"
    );
  };

  return (
    <div
      data-scroll-id={post.id}
      className={
        isParentPost
          ? "rounded-lg border p-4 bg-white space-y-4 target:border-orange-300"
          : "rounded-lg p-2 pr-0 space-y-4"
      }
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link
            href={urls.userDetails(user.id)}
            className="h-10 w-10 hover:opacity-60"
          >
            <UserIcon userImage={user?.image} size={10} />
          </Link>
          <div className="flex flex-col space-y-1">
            <Link href={urls.userDetails(user.id)} className="hover:opacity-60">
              <div className="text-sm">{user.name}</div>
            </Link>
            <a
              href={`#${post.id}`}
              onClick={() => onClickScrollTarget(post.id)}
              className="text-xs text-muted-foreground"
            >
              <time>
                {format(new Date(post.createdAt), "yyyy/MM/dd HH:mm")}
              </time>
            </a>
          </div>
        </div>
        <ManagePostDropDown onClickShareButton={handleClickPostCreatedAt} />
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
                  <PublicPostPaper
                    post={childPost}
                    onClickScrollTarget={onClickScrollTarget}
                  />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
