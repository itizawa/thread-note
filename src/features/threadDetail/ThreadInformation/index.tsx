"use client";

import { updateThreadInfo } from "@/app/actions/threadActions";
import { PublicStatusDialog } from "@/features/threadDetail/PublicStatusDialog";
import { urls } from "@/shared/consts/urls";
import { isMacOs, isWindowsOs } from "@/shared/lib/getOs";
import { useServerAction } from "@/shared/lib/useServerAction";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Tooltip } from "@/shared/ui/Tooltip";
import { trpc } from "@/trpc/client";
import { ArrowLeft, Pencil } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ManageThreadDropDown } from "./ManageThreadDropDown";

export function ThreadInformation({
  threadId,
  includeIsArchived,
  toggleIncludeIsArchived,
}: {
  threadId: string;
  includeIsArchived: boolean;
  toggleIncludeIsArchived: () => void;
}) {
  const utils = trpc.useUtils();
  const { isPending, enqueueServerAction } = useServerAction();
  const [threadInfo, { refetch }] = trpc.thread.getThreadInfo.useSuspenseQuery({
    id: threadId,
  });
  const [title, setTitle] = useState(threadInfo?.title || "");
  const [isEditing, setIsEditing] = useState(false);

  const disabled = !title || isPending;

  const handleUpdate = async () => {
    enqueueServerAction({
      action: async () => {
        await updateThreadInfo({
          id: threadId,
          title,
        });
      },
      error: {
        text: "名前の更新に失敗しました",
      },
      success: {
        onSuccess: () => {
          utils.thread.getThreadInfo.invalidate({ id: threadId });
          utils.thread.listThreadsByCurrentUser.invalidate();
          setIsEditing(false);
          refetch();
        },
      },
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

  if (!threadInfo) {
    // TODO: ポストのデータを取得できなかった時のエラー処理画面を作成する https://github.com/itizawa/thread-note/issues/15
    return <p>ポストが存在しません</p>;
  }

  return (
    <div className="space-y-4">
      <Link
        href={urls.dashboard}
        className="flex space-x-1 items-center text-gray-700"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-xs">一覧に戻る</span>
      </Link>

      {isEditing ? (
        <div className="flex space-x-2">
          <Input
            defaultValue={threadInfo.title || ""}
            placeholder="タイトルを入力してください"
            className="bg-white shadow-none"
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyPress}
            forceFocus
          />
          <Button
            size="sm"
            className="h-9"
            variant="outline"
            onClick={() => setIsEditing(false)}
            disabled={isPending}
          >
            キャンセル
          </Button>
          <Button
            size="sm"
            className="h-9"
            onClick={handleUpdate}
            disabled={disabled}
            loading={isPending}
          >
            更新
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-between group">
          <h3 className="font-bold">{threadInfo.title || "タイトルなし"}</h3>
          <Tooltip content="編集">
            <Button
              variant="ghost"
              className="md:opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </Tooltip>
        </div>
      )}

      <div className="flex items-center justify-between space-x-2">
        <PublicStatusDialog
          threadTitle={threadInfo.title}
          threadId={threadId}
          isPublic={threadInfo.isPublic}
        />
        <ManageThreadDropDown
          includeIsArchived={includeIsArchived}
          onClickToggleDisplayArchiveButton={toggleIncludeIsArchived}
        />
      </div>
    </div>
  );
}
