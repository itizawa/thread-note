import { Modal } from "@/shared/components/Modal";
import { Stack } from "@/shared/components/Stack";
import { Typography } from "@/shared/components/Typography";
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
    <Modal
      open={isOpen}
      onClose={() => onOpenChange(false)}
      title="スレッドの削除"
      titleHelpText="スレッドを削除すると、スレッド内のすべての投稿が削除されます。"
      actions={{
        type: "default",
        cancel: {
          text: "キャンセル",
          color: "gray",
          onClick: () => onOpenChange(false),
          disabled: deleteThreadMutation.isPending,
        },
        submit: {
          text: "削除する",
          color: "error",
          onClick: handleDeleteThread,
          disabled: deleteThreadMutation.isPending,
          loading: deleteThreadMutation.isPending,
        },
        align: "right",
      }}
    >
      <Stack gap="8px">
        <Typography variant="body1" bold>
          「{threadTitle || "タイトルなし"}」を削除しますか？
        </Typography>
        <Typography variant="body2" color="textSecondary">
          ※スレッドを削除すると、スレッド内のすべての投稿が削除されます。
        </Typography>
      </Stack>
    </Modal>
  );
}
