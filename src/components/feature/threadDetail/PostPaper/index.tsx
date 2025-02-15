"use client";

import { UserIcon } from "@/components/model/user/UserIcon";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";
import { format } from "date-fns";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import ReactMarkdown from "react-markdown";

type Post = NonNullable<
  inferRouterOutputs<AppRouter>["thread"]["getThreadWithPosts"]["threadWithPosts"]
>["posts"][number];

interface Props {
  post: Post;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function PostPaper({ post, onEdit, onDelete }: Props) {
  const { user, body } = post;

  return (
    <div className="rounded-lg border p-4 bg-white space-y-4">
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">メニューを開く</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>
              <Pencil className="mr-2 h-4 w-4" />
              編集
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onDelete}
              className="text-destructive focus:text-destructive"
            >
              <Trash className="mr-2 h-4 w-4" />
              削除
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="prose prose-gray max-w-none dark:prose-invert">
        <ReactMarkdown>{body}</ReactMarkdown>
      </div>
    </div>
  );
}
