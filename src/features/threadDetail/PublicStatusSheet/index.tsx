"use client";

import { updateThreadPublicStatus } from "@/app/actions/threadActions";
import { useServerAction } from "@/shared/lib/useServerAction";
import { Button } from "@/shared/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/ui/sheet";
import { Tooltip } from "@/shared/ui/Tooltip";
import { trpc } from "@/trpc/client";
import { Eye, EyeOff, Globe, Lock } from "lucide-react";
import { useState } from "react";
import { ShareInformation } from "./parts/ShareInformation";

interface PublicStatusSheetProps {
  threadTitle: string | null;
  threadId: string;
  isPublic: boolean;
}

export function PublicStatusSheet({
  threadTitle,
  threadId,
  isPublic,
}: PublicStatusSheetProps) {
  const [open, setOpen] = useState(false);
  const { isPending, enqueueServerAction } = useServerAction();
  const utils = trpc.useUtils();

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
      <SheetContent>
        <SheetHeader>
          <SheetTitle>公開設定</SheetTitle>
        </SheetHeader>
        <div className="space-y-6 px-4">
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
        </div>
      </SheetContent>
    </Sheet>
  );
}
