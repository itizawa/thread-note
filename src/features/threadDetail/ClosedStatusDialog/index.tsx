"use client";

import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { trpc } from "@/trpc/client";
import { Archive, ArchiveRestore, LockKeyhole, Unlock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ClosedStatusDialogProps {
  threadId: string;
  isClosed: boolean;
}

export function ClosedStatusDialog({
  threadId,
  isClosed,
}: ClosedStatusDialogProps) {
  const [open, setOpen] = useState(false);
  const utils = trpc.useUtils();

  const { mutate, isPending } =
    trpc.thread.updateThreadClosedStatus.useMutation({
      onSuccess: () => {
        toast.success("スレッドを削除しました");
        utils.thread.getThreadInfo.invalidate({ id: threadId });
        setOpen(false);
      },
      onError: (error) => {
        toast.error(`スレッドステータスの更新に失敗しました: ${error.message}`);
      },
    });

  const handleToggleStatus = async () => {
    mutate({ id: threadId, isClosed: !isClosed });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
              onClick={handleToggleStatus}
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
                このスレッドは現在終了しています。再開すると、再び投稿できるようになります。
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
