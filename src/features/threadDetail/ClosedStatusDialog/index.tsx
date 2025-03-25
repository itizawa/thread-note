"use client";

import { updateThreadClosedStatus } from "@/app/actions/threadActions";
import { useServerAction } from "@/shared/lib/useServerAction";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { Tooltip } from "@/shared/ui/Tooltip";
import { trpc } from "@/trpc/client";
import { Archive, ArchiveRestore, LockKeyhole, Unlock } from "lucide-react";
import { useState } from "react";

interface ClosedStatusDialogProps {
  threadId: string;
  isClosed: boolean;
}

export function ClosedStatusDialog({
  threadId,
  isClosed,
}: ClosedStatusDialogProps) {
  const [open, setOpen] = useState(false);
  const { isPending, enqueueServerAction } = useServerAction();
  const utils = trpc.useUtils();

  const handleToggleClosedStatus = async () => {
    enqueueServerAction({
      action: () =>
        updateThreadClosedStatus({
          id: threadId,
          isClosed: !isClosed,
        }),
      error: {
        text: "スレッドステータスの更新に失敗しました",
      },
      success: {
        onSuccess: () =>
          utils.thread.getThreadInfo.invalidate({ id: threadId }),
        text: isClosed ? "スレッドを再開しました" : "スレッドを終了しました",
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger onClick={() => setOpen(true)}>
        <Tooltip
          content={
            isClosed
              ? "このスレッドは終了しています"
              : "このスレッドは進行中です"
          }
        >
          <Button variant="outline" size="sm">
            <div className="flex items-center space-x-2">
              {isClosed ? (
                <>
                  <Archive className="h-5 w-5 text-red-500" />
                  <span className="font-bold">終了</span>
                </>
              ) : (
                <>
                  <Unlock className="h-5 w-5 text-blue-500" />
                  <span className="font-bold">進行中</span>
                </>
              )}
            </div>
          </Button>
        </Tooltip>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>スレッドステータス設定</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              {isClosed ? (
                <div className="flex items-center space-x-2">
                  <Archive className="h-5 w-5 text-red-500" />
                  <span className="font-bold">終了</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Unlock className="h-5 w-5 text-blue-500" />
                  <span className="font-bold">進行中</span>
                </div>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleClosedStatus}
              disabled={isPending}
              loading={isPending}
            >
              {isClosed ? (
                <>
                  <ArchiveRestore className="h-4 w-4 mr-2" />
                  スレッドを再開する
                </>
              ) : (
                <>
                  <LockKeyhole className="h-4 w-4 mr-2" />
                  スレッドを終了する
                </>
              )}
            </Button>
          </div>

          <div className="text-sm text-gray-600">
            {isClosed ? (
              <p>
                このスレッドは現在終了しています。再開すると、再び投稿を受け付けるようになります。
              </p>
            ) : (
              <p>
                スレッドを終了すると、新しい投稿ができなくなります。いつでも再開することができます。
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
