"use client";

import { updateThreadPublicStatus } from "@/app/actions/threadActions";
import { useAutoResizeTextarea } from "@/entities/post/PostForm/hooks/useAutoResizeTextarea";
import { useServerAction } from "@/shared/lib/useServerAction";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/ui/sheet";
import { Textarea } from "@/shared/ui/textarea";
import { Tooltip } from "@/shared/ui/Tooltip";
import { trpc } from "@/trpc/client";
import { useForm, useStore } from "@tanstack/react-form";
import { Eye, EyeOff, Globe, Lock, Save } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { z } from "zod";
import { ShareInformation } from "./parts/ShareInformation";

interface PublicStatusSheetProps {
  threadTitle: string | null;
  threadId: string;
  isPublic: boolean;
  ogpTitle: string | null;
  ogpDescription: string | null;
}

export function PublicStatusSheet({
  threadTitle,
  threadId,
  isPublic,
  ogpTitle,
  ogpDescription,
}: PublicStatusSheetProps) {
  const [open, setOpen] = useState(false);
  const { isPending, enqueueServerAction } = useServerAction();
  const utils = trpc.useUtils();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { mutate: updateOgpInfo, isPending: isOgpUpdatePending } =
    trpc.thread.updateThreadOgpInfo.useMutation({
      onSuccess: () => {
        utils.thread.getThreadInfo.invalidate({ id: threadId });
        utils.thread.getThreadWithPosts.invalidate({ id: threadId });
      },
    });

  const { Field, store, Subscribe, handleSubmit } = useForm({
    defaultValues: {
      ogpTitle: ogpTitle || "",
      ogpDescription: ogpDescription || "",
    },
    onSubmit: async ({ value }) => {
      updateOgpInfo({
        id: threadId,
        ogpTitle: value.ogpTitle || null,
        ogpDescription: value.ogpDescription || null,
      });
    },
    validators: {
      onChange: z.object({
        ogpTitle: z.string().max(48, "48文字以内で入力してください"),
        ogpDescription: z.string().max(270, "270文字以内で入力してください"),
      }),
    },
  });

  const value = useStore(store, (state) => state.values.ogpDescription);
  // テキストエリアの高さを自動調整するフックを使用
  const { handleResize } = useAutoResizeTextarea({
    value,
    textareaRef,
    minHeight: 78,
  });

  const handleTogglePublicStatus = async () => {
    enqueueServerAction({
      action: () =>
        updateThreadPublicStatus({
          id: threadId,
          isPublic: !isPublic,
        }),
      error: {
        text: "公開状態の更新に失敗しました",
      },
      success: {
        onSuccess: () => {
          utils.thread.getThreadInfo.invalidate({ id: threadId });
          utils.thread.getThreadWithPosts.invalidate({ id: threadId });
        },
        text: isPublic ? "非公開に設定しました" : "公開に設定しました",
      },
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger onClick={() => setOpen(true)}>
        <Tooltip
          content={
            isPublic
              ? "リンクを知っていれば誰でも閲覧可能"
              : "あなただけが閲覧可能"
          }
        >
          <Button variant="outline" size="sm">
            <div className="flex items-center space-x-2">
              {isPublic ? (
                <Globe className="h-5 w-5 text-green-500" />
              ) : (
                <Lock className="h-5 w-5 text-yellow-500" />
              )}
              <span className="font-bold">
                {isPublic ? "公開中" : "非公開"}
              </span>
            </div>
          </Button>
        </Tooltip>
      </SheetTrigger>
      <SheetContent className="flex flex-col gap-0 h-full">
        <SheetHeader className="border-b">
          <SheetTitle>公開設定</SheetTitle>
        </SheetHeader>
        <div className="space-y-6 p-4 overflow-y-auto">
          <div className="flex items-center justify-between">
            <div>
              {isPublic ? (
                <div className="flex items-center space-x-2">
                  <Globe className="h-5 w-5 text-green-500" />
                  <span className="font-bold">公開中</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Lock className="h-5 w-5 text-yellow-500" />
                  <span className="font-bold">非公開</span>
                </div>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleTogglePublicStatus}
              disabled={isPending}
              loading={isPending}
            >
              {isPublic ? (
                <>
                  <EyeOff className="h-4 w-4 mr-2" />
                  非公開にする
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  公開する
                </>
              )}
            </Button>
          </div>

          {isPublic && (
            <ShareInformation threadTitle={threadTitle} threadId={threadId} />
          )}

          {isPublic && (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col space-y-4 mt-6 pt-6 border-t"
            >
              <h4 className="font-medium">OGP設定</h4>
              <div className="flex flex-col space-y-2">
                <label htmlFor="ogpTitle" className="text-sm font-medium">
                  OGPタイトル
                </label>
                <Field name="ogpTitle">
                  {({ state, handleBlur, handleChange }) => (
                    <div className="flex flex-col space-y-2">
                      <Input
                        id="ogpTitle"
                        placeholder="未入力の場合はスレッドタイトルが使用されます"
                        value={state.value}
                        onBlur={handleBlur}
                        onChange={(e) => handleChange(e.target.value)}
                      />
                      {state.meta.errors[0]?.message && (
                        <p className="text-red-500 text-xs">
                          {state.meta.errors[0]?.message}
                        </p>
                      )}
                    </div>
                  )}
                </Field>
              </div>
              <div className="flex flex-col space-y-2">
                <label htmlFor="ogpDescription" className="text-sm font-medium">
                  OGP説明文
                </label>
                <Field name="ogpDescription">
                  {({ state, handleBlur, handleChange }) => (
                    <div className="flex flex-col space-y-2">
                      <Textarea
                        id="ogpDescription"
                        placeholder="OGP説明文を入力（検索結果に表示される説明文）"
                        value={state.value}
                        onBlur={handleBlur}
                        rows={3}
                        onChange={(e) => {
                          handleChange(e.target.value);
                          handleResize();
                        }}
                        ref={textareaRef}
                      />
                      {state.meta.errors[0]?.message && (
                        <p className="text-red-500 text-xs">
                          {state.meta.errors[0]?.message}
                        </p>
                      )}
                    </div>
                  )}
                </Field>
              </div>
              <div className="flex flex-col space-y-2">
                <label htmlFor="ogpImage" className="text-sm font-medium">
                  OGPイメージ(保存すると反映されます)
                </label>
                <Image
                  src={`/api/og?title=${encodeURIComponent(
                    ogpTitle || threadTitle || ""
                  )}`}
                  alt="OGPイメージ"
                  width={1200}
                  height={630}
                  className="rounded-md"
                />
              </div>
            </form>
          )}
        </div>
        <SheetFooter className="sticky bottom-0 bg-white pt-4 border-t">
          <Subscribe>
            {({ isDirty, isValid }) => (
              <Button
                type="submit"
                className="w-full"
                disabled={isOgpUpdatePending || !isDirty || !isValid}
                loading={isOgpUpdatePending}
                onClick={handleSubmit}
              >
                <Save className="h-4 w-4" />
                OGP設定を保存
              </Button>
            )}
          </Subscribe>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
