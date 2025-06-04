"use client";

import { createThreadWithFirstPost } from "@/app/actions/threadActions";
import { PostForm } from "@/entities/post/PostForm";
import { urls } from "@/shared/consts/urls";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

import { isMacOs, isWindowsOs } from "@/shared/lib/getOs";
import { useServerAction } from "@/shared/lib/useServerAction";
import { trpc } from "@/trpc/client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

// Template definitions
const TEMPLATES = {
  DAILY_REPORT: {
    label: "日報",
    title: () => {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      return `${year}/${month}/${day}の日報`;
    },
    body: `## 今日やったこと
- 
- 

## 明日やること
- 
- `,
  },
  BLOG: {
    label: "ブログ",
    title: () => "ブログタイトル",
    body: `## テーマ
（今日書きたいこと）

## きっかけ
（このテーマを思い出した理由）

## エピソード
（具体的な出来事、描写を入れて）

## 感情の変化・気づき
（その時どう思った？そこから何を得た？）

## まとめ
（今の自分から見たらどう感じるか）

## タイトル案
（仮でもOK）`,
  },
} as const;

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
            <Button variant="outline" className="bg-white">
              テンプレート
              <ChevronDown className="ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => applyTemplate("DAILY_REPORT")}>
              {TEMPLATES.DAILY_REPORT.label}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => applyTemplate("BLOG")}>
              {TEMPLATES.BLOG.label}
            </DropdownMenuItem>
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
