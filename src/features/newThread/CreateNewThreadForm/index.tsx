"use client";

import { createThreadWithFirstPost } from "@/app/actions/threadActions";
import { PostForm } from "@/entities/post/PostForm";
import { Button } from "@/shared/components/Button/Button";
import { urls } from "@/shared/consts/urls";
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
import { DescriptionOutlined } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export function CreateNewThreadForm() {
  const utils = trpc.useUtils();
  const router = useRouter();

  const [title, setTitle] = useState("");
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
        <Input
          placeholder="タイトルを入力してください"
          className="bg-white shadow-none flex-1"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyPress}
          forceFocus
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outlined"
              color="inherit"
              sx={{ minWidth: "fit-content" }}
              startIcon={<DescriptionOutlined />}
            >
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
