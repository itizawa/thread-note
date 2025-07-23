"use client";

import { createThreadWithFirstPost } from "@/app/actions/threadActions";
import { PostForm } from "@/entities/post/PostForm";
import { urls } from "@/shared/consts/urls";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Input } from "@/shared/ui/input";
import { TEMPLATES } from "./consts";

import { isMacOs, isWindowsOs } from "@/shared/lib/getOs";
import { useServerAction } from "@/shared/lib/useServerAction";
import { trpc } from "@/trpc/client";
import { NotebookText } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export function CreateNewThreadForm() {
  const utils = trpc.useUtils();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [emoji, setEmoji] = useState("");
  const [body, setBody] = React.useState("");

  const { isPending, enqueueServerAction } = useServerAction();
  const bothEmpty = title.trim().length === 0 && body.trim().length === 0;
  const isDisabled = isPending || bothEmpty;

  const applyTemplate = (templateKey: keyof typeof TEMPLATES) => {
    const template = TEMPLATES[templateKey];
    setTitle(template.title());
    setBody(template.body);
  };

  const handleSubmit = () => {
    enqueueServerAction({
      action: () =>
        createThreadWithFirstPost({
          title,
          emoji,
          body,
        }),
      error: {
        text: "スレッドの作成に失敗しました",
      },
      success: {
        text: "スレッドを作成しました",
        onSuccess: ({ thread }) => {
          utils.thread.listThreadsByCurrentUser.refetch();
          router.push(urls.dashboardThreadDetails(thread.id));
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
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="flex items-center gap-2 flex-1">
          <Input
            placeholder="😀"
            className="bg-white shadow-none"
            style={{ width: "70px" }}
            value={emoji}
            onChange={(e) => setEmoji(e.target.value)}
            onKeyDown={handleKeyPress}
            maxLength={4}
          />
          <Input
            placeholder="タイトルを入力してください"
            className="bg-white shadow-none flex-1"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyPress}
            forceFocus
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="bg-white">
              <NotebookText />
              テンプレート
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {(Object.keys(TEMPLATES) as Array<keyof typeof TEMPLATES>).map(
              (templateKey) => (
                <DropdownMenuItem
                  key={templateKey}
                  onClick={() => applyTemplate(templateKey)}
                >
                  {TEMPLATES[templateKey].label}
                </DropdownMenuItem>
              )
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-lg border p-4 bg-white">
        <PostForm
          textarea={{
            value: body,
            onChange: handleContentChange,
            onKeyPress: handleKeyPress,
          }}
          formState={{
            isDisabled,
            isPending,
          }}
          bottomButtons={{
            submitText: "投稿",
            onSubmit: handleSubmit,
          }}
        />
      </div>
    </div>
  );
}
