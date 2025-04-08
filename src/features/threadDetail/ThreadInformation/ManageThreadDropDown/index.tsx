import { urls } from "@/shared/consts/urls";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Tooltip } from "@/shared/ui/Tooltip";
import { trpc } from "@/trpc/client";
import { Archive, MoreHorizontal, PlaneTakeoff, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
  threadId: string;
  includeIsArchived: boolean;
  onClickToggleDisplayArchiveButton: () => void;
};

export function ManageThreadDropDown({
  threadId,
  includeIsArchived,
  onClickToggleDisplayArchiveButton,
}: Props) {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const utils = trpc.useUtils();

  const deleteThreadMutation = trpc.thread.deleteThread.useMutation({
    onSuccess: () => {
      toast.success("スレッドを削除しました");
      utils.thread.listThreadsByCurrentUser.invalidate();
      router.push(urls.dashboard);
    },
    onError: (error) => {
      toast.error(`削除に失敗しました: ${error.message}`);
    },
  });

  const handleDeleteThread = async () => {
    deleteThreadMutation.mutate({ id: threadId });
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Tooltip content="スレッドを操作">
            <Button variant="ghost" size="icon" className="hover:bg-gray-200">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">メニューを開く</span>
            </Button>
          </Tooltip>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <Link href={urls.dashboardThreadDetailsExports(threadId)} passHref>
            <DropdownMenuItem>
              <PlaneTakeoff className="h-4 w-4" />
              スレッドのエクスポート
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem onClick={onClickToggleDisplayArchiveButton}>
            <Archive className="h-4 w-4" />
            {includeIsArchived ? "アーカイブの非表示" : "アーカイブの表示"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)}>
            <Trash2 className="h-4 w-4 text-red-500" />
            <span className="text-red-500">スレッドの削除</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>スレッドの削除</DialogTitle>
            <DialogDescription className="font-bold text-red-500 min-h-[100px] flex flex-col items-center justify-center">
              スレッドを削除すると、スレッド内のすべての投稿が削除されます。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              キャンセル
            </Button>
            <Button
              variant="destructive"
              className="font-bold"
              onClick={handleDeleteThread}
              loading={deleteThreadMutation.isPending}
            >
              削除する
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
