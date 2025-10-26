import { DeleteThreadDialog } from "@/entities/thread/DeleteThreadDialog";
import { IconButton } from "@/shared/components/IconButton";
import { Tooltip } from "@/shared/components/Tooltip";
import { urls } from "@/shared/consts/urls";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { DropdownMenuItemWithIcon } from "@/shared/ui/dropdown-menu-item-with-icon";
import { trpc } from "@/trpc/client";
import { MoreHorizOutlined } from "@mui/icons-material";
import { ThreadStatus } from "@prisma/client";
import { ListCheck, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
  threadId: string;
  threadTitle: string | null;
  status: ThreadStatus;
};

export function ManageThreadDropDown({ threadId, threadTitle, status }: Props) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const router = useRouter();
  const utils = trpc.useUtils();

  const { mutate: updateStatus, isPending } =
    trpc.thread.updateThreadStatus.useMutation({
      onSuccess: () => {
        toast.success("ステータスを更新しました");
        utils.thread.getThreadInfo.invalidate({ id: threadId });
        utils.thread.listThreadsByCurrentUser.invalidate();
      },
      onError: (error) => {
        toast.error(`ステータスの更新に失敗しました: ${error.message}`);
      },
    });

  const handleDeleteSuccess = () => {
    router.push(urls.dashboard);
  };

  const handleStatusChange = (newStatus: ThreadStatus) => {
    if (newStatus !== status) {
      updateStatus({ id: threadId, status: newStatus });
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Tooltip content="スレッドを操作">
            <IconButton size="small">
              <MoreHorizOutlined />
            </IconButton>
          </Tooltip>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {status !== "WIP" && (
            <DropdownMenuItemWithIcon
              icon={Pencil}
              text="WIPに変更する"
              onClick={() => handleStatusChange("WIP")}
              disabled={isPending}
            />
          )}
          {status !== "CLOSED" && (
            <DropdownMenuItemWithIcon
              icon={ListCheck}
              text="Closedに変更する"
              onClick={() => handleStatusChange("CLOSED")}
              disabled={isPending}
            />
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItemWithIcon
            icon={Trash2}
            text="スレッドの削除"
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
          />
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteThreadDialog
        threadId={threadId}
        threadTitle={threadTitle}
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onSuccess={handleDeleteSuccess}
      />
    </>
  );
}
