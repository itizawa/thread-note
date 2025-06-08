"use client";

import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { trpc } from "@/trpc/client";
import { ThreadStatus } from "@prisma/client";
import { LockKeyhole, MoreHorizontal, Pencil } from "lucide-react";
import { toast } from "sonner";

interface ThreadStatusBadgeProps {
  threadId: string;
  status: ThreadStatus;
}

export function ThreadStatusBadge({ threadId, status }: ThreadStatusBadgeProps) {
  const utils = trpc.useUtils();

  const { mutate, isPending } = trpc.thread.updateThreadStatus.useMutation({
    onSuccess: () => {
      toast.success("ステータスを更新しました");
      utils.thread.getThreadInfo.invalidate({ id: threadId });
      utils.thread.listThreadsByCurrentUser.invalidate();
    },
    onError: (error) => {
      toast.error(`ステータスの更新に失敗しました: ${error.message}`);
    },
  });

  const handleStatusChange = (newStatus: ThreadStatus) => {
    if (newStatus !== status) {
      mutate({ id: threadId, status: newStatus });
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "WIP":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "CLOSED":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100";
      default:
        return "";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "WIP":
        return "進行中";
      case "CLOSED":
        return "終了";
      default:
        return "";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`h-7 px-2 font-medium ${getStatusColor()}`}
          disabled={isPending}
        >
          {getStatusText()}
          <MoreHorizontal className="h-3 w-3 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {status !== "WIP" && (
          <DropdownMenuItem onClick={() => handleStatusChange("WIP")}>
            <Pencil className="h-4 w-4 mr-2" />
            WIPに変更する
          </DropdownMenuItem>
        )}
        {status !== "CLOSED" && (
          <DropdownMenuItem onClick={() => handleStatusChange("CLOSED")}>
            <LockKeyhole className="h-4 w-4 mr-2" />
            Closedに変更する
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}