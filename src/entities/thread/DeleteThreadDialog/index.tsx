import { Button } from "@/shared/components/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { trpc } from "@/trpc/client";
import { toast } from "sonner";

type Props = {
  threadId: string;
  threadTitle: string | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
};

export function DeleteThreadDialog({
  threadId,
  threadTitle,
  isOpen,
  onOpenChange,
  onSuccess,
}: Props) {
  const utils = trpc.useUtils();

  const deleteThreadMutation = trpc.thread.deleteThread.useMutation({
    onSuccess: () => {
      toast.success("スレッドを削除しました");
      utils.thread.listThreadsByCurrentUser.invalidate();

      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error) => {
      toast.error(`削除に失敗しました: ${error.message}`);
    },
  });

  const handleDeleteThread = async () => {
    deleteThreadMutation.mutate({ id: threadId });
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>スレッドの削除</DialogTitle>
          <DialogDescription className="min-h-[100px] flex flex-col gap-y-4 items-center justify-center">
            <span className="font-bold text-lg">
              スレッド「{threadTitle || "タイトルなし"}」を削除しますか？
            </span>
            <span className="text-sm text-red-500">
              スレッドを削除すると、スレッド内のすべての投稿が削除されます。
            </span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outlined"
            color="inherit"
            size="large"
            onClick={() => onOpenChange(false)}
          >
            キャンセル
          </Button>
          <Button
            variant="contained"
            color="error"
            size="large"
            onClick={handleDeleteThread}
            loading={deleteThreadMutation.isPending}
          >
            削除する
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
