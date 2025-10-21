"use client";

import { Modal } from "@/shared/components/Modal/Modal";
import { isMacOs, isWindowsOs } from "@/shared/lib/getOs";
import { Input } from "@/shared/ui/input";
import { trpc } from "@/trpc/client";
import { useState } from "react";
import { toast } from "sonner";

export function ThreadTitleEditModal({
  open,
  onClose,
  threadId,
  currentTitle,
}: {
  open: boolean;
  onClose: () => void;
  threadId: string;
  currentTitle: string;
}) {
  const utils = trpc.useUtils();
  const updateThreadInfoMutation = trpc.thread.updateThreadInfo.useMutation({
    onSuccess: () => {
      toast.success("タイトルを更新しました");
      utils.thread.getThreadInfo.invalidate({ id: threadId });
      utils.thread.listThreadsByCurrentUser.invalidate();
      onClose();
    },
    onError: () => {
      toast.error("名前の更新に失敗しました");
    },
  });
  const [title, setTitle] = useState(currentTitle);

  const disabled = !title || updateThreadInfoMutation.isPending;

  const handleUpdate = async () => {
    await updateThreadInfoMutation.mutateAsync({
      id: threadId,
      title,
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

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="タイトルを編集"
      actions={{
        type: "default",
        cancel: {
          text: "キャンセル",
          color: "gray",
          onClick: onClose,
          disabled: updateThreadInfoMutation.isPending,
        },
        submit: {
          text: "更新",
          color: "primary",
          onClick: handleUpdate,
          disabled,
          loading: updateThreadInfoMutation.isPending,
        },
      }}
    >
      <Input
        value={title}
        placeholder="タイトルを入力してください"
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyPress}
        autoFocus
      />
    </Modal>
  );
}
