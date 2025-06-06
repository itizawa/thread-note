"use client";

import { updateThreadPublicStatus } from "@/app/actions/threadActions";
import { useServerAction } from "@/shared/lib/useServerAction";
import { cn } from "@/shared/lib/utils";
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
import { Skeleton } from "@/shared/ui/skeleton";
import { Textarea } from "@/shared/ui/textarea";
import { Tooltip } from "@/shared/ui/Tooltip";
import { WithLabel } from "@/shared/ui/WithLabel";
import { trpc } from "@/trpc/client";
import { useForm } from "@tanstack/react-form";
import { Eye, EyeOff, Globe, Lock, Save } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { ShareInformation } from "./parts/ShareInformation";

interface PublicStatusSheetProps {
  threadTitle: string | null;
  threadId: string;
  isPublic: boolean;
  ogpTitle: string | null;
  ogpDescription: string | null;
  ogpImagePath: string | null;
}

export function PublicStatusSheet({
  threadTitle,
  threadId,
  isPublic,
  ogpTitle,
  ogpDescription,
  ogpImagePath,
}: PublicStatusSheetProps) {
  const [open, setOpen] = useState(false);
  const { isPending, enqueueServerAction } = useServerAction();
  const utils = trpc.useUtils();

  const { data, hasNextPage, fetchNextPage, isLoading, isFetching } =
    trpc.file.listFiles.useInfiniteQuery(
      {
        limit: 10,
        sort: { type: "createdAt", direction: "desc" },
      },
      { getNextPageParam: (lastPage) => lastPage.nextCursor }
    );
  const filePaths =
    data?.pages.flatMap((v) => v.files.map((v) => v.path)) || [];

  const { mutate: updateOgpInfo, isPending: isOgpUpdatePending } =
    trpc.thread.updateThreadOgpInfo.useMutation({
      onSuccess: () => {
        utils.thread.getThreadInfo.invalidate({ id: threadId });
        utils.thread.getThreadWithPosts.invalidate({ id: threadId });
      },
    });

  const { Field, Subscribe, handleSubmit } = useForm({
    defaultValues: {
      ogpTitle: ogpTitle || "",
      ogpDescription: ogpDescription || "",
      ogpImagePath: ogpImagePath,
    },
    onSubmit: async ({ value }) => {
      updateOgpInfo({
        id: threadId,
        ogpTitle: value.ogpTitle || null,
        ogpDescription: value.ogpDescription || null,
        ogpImagePath: value.ogpImagePath || null,
      });
    },
    validators: {
      onChange: z.object({
        ogpTitle: z.string().max(48, "48文字以内で入力してください"),
        ogpDescription: z.string().max(270, "270文字以内で入力してください"),
        ogpImagePath: z.string().nullable(),
      }),
    },
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
                  <EyeOff className="h-4 w-4" />
                  非公開にする
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" />
                  公開する
                </>
              )}
            </Button>
          </div>

          {isPublic && (
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  ogpImagePath ||
                  `/api/og?title=${encodeURIComponent(
                    ogpTitle || threadTitle || ""
                  )}`
                }
                height="100%"
                width="100%"
                alt="OGPイメージ"
                className="rounded-md object-cover aspect-video h-full w-full border-1"
              />
            </div>
          )}

          {isPublic && (
            <ShareInformation threadTitle={threadTitle} threadId={threadId} />
          )}

          {isPublic && (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col space-y-4 mt-6 pt-6 border-t"
            >
              <h4 className="font-medium">OGP設定</h4>
              <Field name="ogpTitle">
                {({ state, handleBlur, handleChange }) => (
                  <WithLabel label="OGPタイトル">
                    <Input
                      id="ogpTitle"
                      placeholder={threadTitle || "タイトルなし"}
                      value={state.value}
                      onBlur={handleBlur}
                      error={!!state.meta.errors[0]?.message}
                      errorMessage={state.meta.errors[0]?.message}
                      onChange={(e) => handleChange(e.target.value)}
                    />
                  </WithLabel>
                )}
              </Field>
              <Field name="ogpDescription">
                {({ state, handleBlur, handleChange }) => (
                  <WithLabel label="OGP説明文">
                    <Textarea
                      id="ogpDescription"
                      placeholder="OGP説明文を入力（検索結果に表示される説明文）"
                      value={state.value}
                      onBlur={handleBlur}
                      rows={5}
                      onChange={(e) => handleChange(e.target.value)}
                    />
                    {state.meta.errors[0]?.message && (
                      <p className="text-red-500 text-xs">
                        {state.meta.errors[0]?.message}
                      </p>
                    )}
                  </WithLabel>
                )}
              </Field>
              <Field name="ogpImagePath">
                {({ state, handleChange }) => (
                  <WithLabel label="OGPイメージ">
                    <div className="flex flex-wrap">
                      {[null, ...filePaths].map((value, index) => (
                        <div className="relative w-1/2 p-1" key={index}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={value || "/custom-ogp/1.png"}
                            alt="OGPイメージ"
                            width="100%"
                            height="auto"
                            onClick={() => handleChange(value)}
                            className={cn(
                              "rounded-md object-cover aspect-video",
                              {
                                "outline-4 outline-orange-400":
                                  state.value === value,
                              }
                            )}
                          />
                        </div>
                      ))}
                      {(isLoading || isFetching) && (
                        <>
                          {[...new Array(5)].map((_, index) => (
                            <div key={index} className="relative w-1/2 p-1">
                              <Skeleton className="w-full h-full rounded-md aspect-video" />
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  </WithLabel>
                )}
              </Field>
              {hasNextPage && !isLoading && !isFetching && (
                <Button
                  variant="outline"
                  onClick={(e) => {
                    e.preventDefault();
                    if (isLoading || isFetching) return;
                    fetchNextPage();
                  }}
                >
                  もっと見る
                </Button>
              )}
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
