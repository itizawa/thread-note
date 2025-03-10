"use client";

import { updateThreadPublicStatus } from "@/app/actions/threadActions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { urls } from "@/consts/urls";
import { useServerAction } from "@/lib/useServerAction";
import { trpc } from "@/trpc/client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { Eye, EyeOff, Globe, Lock, Share } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import urlJoin from "url-join";

interface PublicStatusDialogProps {
  threadId: string;
  isPublic: boolean;
}

export function PublicStatusDialog({
  threadId,
  isPublic,
}: PublicStatusDialogProps) {
  const [open, setOpen] = useState(false);
  const { isPending, enqueueServerAction } = useServerAction();
  const utils = trpc.useUtils();
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
        title: "スレッドを共有",
        url: threadDetailUrl,
      })
      .catch(() => void 0); // NOTE: シェアをキャンセルとするとエラーが投げられるため握りつぶす
  };

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
        onSuccess: () =>
          utils.thread.getThreadInfo.invalidate({ id: threadId }),
        text: isPublic ? "非公開に設定しました" : "公開に設定しました",
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          {isPublic ? (
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
                  sideOffset={16}
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
                  sideOffset={16}
                >
                  あなただけが閲覧可能
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>公開設定</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <h4 className="font-medium">公開ステータス</h4>
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
          </div>

          {isPublic && (
            <div className="space-y-2">
              <h4 className="font-medium">公開URL</h4>
              <div className="flex items-end justify-between">
                <div className="flex-1">
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
              <p className="text-xs text-muted-foreground">
                URLをクリックするとコピーできます
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
