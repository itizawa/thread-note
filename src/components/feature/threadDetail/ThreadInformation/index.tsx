"use client";

import {
  updateThreadInfo,
  updateThreadPublicStatus,
} from "@/app/actions/threadActions";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { urls } from "@/consts/urls";
import { isMacOs, isWindowsOs } from "@/lib/getOs";
import { useServerAction } from "@/lib/useServerAction";
import { trpc } from "@/trpc/client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { Eye, EyeOff, Globe, Lock, Pencil, Share } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import urlJoin from "url-join";

export function ThreadInformation({ threadId }: { threadId: string }) {
  const utils = trpc.useUtils();
  const { isPending, enqueueServerAction } = useServerAction();
  const {
    data: threadInfo,
    refetch,
    isLoading,
  } = trpc.thread.getThreadInfo.useQuery({
    id: threadId,
  });
  const [title, setTitle] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const threadDetailUrl = urlJoin(
    window.location.origin,
    urls.threadDetails(threadId)
  );

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(threadDetailUrl);
    toast.success("URLをコピーしました");
  };

  const handleClickShare = () => {
    navigator
      ?.share({
        title: `${threadInfo?.title}`,
        url: threadDetailUrl,
      })
      .catch(() => void 0); // NOTE: シェアをキャンセルとするとエラーが投げられるため握りつぶす
  };

  const disabled = !title || isPending;

  const handleUpdate = async () => {
    enqueueServerAction({
      action: async () => {
        await updateThreadInfo({
          id: threadId,
          title,
        });
      },
      error: {
        text: "名前の更新に失敗しました",
      },
      success: {
        onSuccess: () => {
          utils.thread.getThreadInfo.invalidate({ id: threadId });
          utils.thread.listThreadsByUserId.invalidate();
          setIsEditing(false);
          refetch();
        },
      },
    });
  };

  const handleTogglePublicStatus = async () => {
    if (!threadInfo) return;

    enqueueServerAction({
      action: () =>
        updateThreadPublicStatus({
          id: threadId,
          isPublic: !threadInfo.isPublic,
        }),
      error: {
        text: "公開状態の更新に失敗しました",
      },
      success: {
        onSuccess: () => refetch(),
        text: threadInfo.isPublic
          ? "非公開に設定しました"
          : "公開に設定しました",
      },
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (isMacOs()) {
      if (e.key === "Enter" && e.metaKey) {
        handleUpdate();
      }
    }
    if (isWindowsOs()) {
      if (e.key === "Enter" && e.ctrlKey) {
        handleUpdate();
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={urls.dashboard}>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                <Skeleton className="w-20 h-4" />
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Skeleton className="w-full h-9" />
      </div>
    );
  }

  if (!threadInfo) {
    // TODO: ポストのデータを取得できなかった時のエラー処理画面を作成する https://github.com/itizawa/thread-note/issues/15
    return <p>No posts available.</p>;
  }

  return (
    <div className="space-y-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={urls.dashboard}>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              {threadInfo.title || "タイトルなし"}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {isEditing ? (
        <div className="flex space-x-2">
          <Input
            defaultValue={threadInfo.title || ""}
            placeholder="タイトルを入力してください"
            className="bg-white"
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyPress}
            forceFocus
          />
          <Button
            size="sm"
            className="h-9"
            variant="outline"
            onClick={() => setIsEditing(false)}
            disabled={isPending}
          >
            キャンセル
          </Button>
          <Button
            size="sm"
            className="h-9"
            onClick={handleUpdate}
            disabled={disabled}
            loading={isPending}
          >
            更新
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <h3 className="font-bold">{threadInfo.title || "タイトルなし"}</h3>
          <Button variant="ghost" onClick={() => setIsEditing(true)}>
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="space-y-3 border p-3 rounded-md bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {threadInfo.isPublic ? (
              <TooltipProvider delayDuration={400}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center space-x-2">
                      <Globe className="h-5 w-5 text-green-500" />
                      <span className="font-bold">公開中</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent
                    className="text-white bg-black p-2 rounded-md"
                    sideOffset={8}
                  >
                    リンクを知っていれば誰でも閲覧可能
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <TooltipProvider delayDuration={400}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center space-x-2">
                      <Lock className="h-5 w-5 text-yellow-500" />
                      <span className="font-bold">非公開</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent
                    className="text-white bg-black p-2 rounded-md"
                    sideOffset={8}
                  >
                    あなただけが閲覧可能
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleTogglePublicStatus}
            disabled={isPending}
            loading={isPending}
          >
            {threadInfo.isPublic ? (
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

        {threadInfo.isPublic && (
          <div className="flex items-end justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-500 mb-1">公開URL</p>
              <div className="flex items-center">
                <Input
                  type="text"
                  value={threadDetailUrl}
                  readOnly
                  className="cursor-pointer"
                  onClick={handleCopyUrl}
                />
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="ml-2"
              onClick={handleClickShare}
            >
              <Share className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
