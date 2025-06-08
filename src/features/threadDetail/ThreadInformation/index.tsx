"use client";

import { updateThreadInfo } from "@/app/actions/threadActions";
import { PublicStatusSheet } from "@/features/threadDetail/PublicStatusSheet";
import { ThreadStatusBadge } from "@/features/threadDetail/ThreadStatusBadge";
import { urls } from "@/shared/consts/urls";
import { isMacOs, isWindowsOs } from "@/shared/lib/getOs";
import { useServerAction } from "@/shared/lib/useServerAction";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { LinkToBack } from "@/shared/ui/LinkToBack";
import { Tooltip } from "@/shared/ui/Tooltip";
import { trpc } from "@/trpc/client";
import { Pencil } from "lucide-react";
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
  const [emoji, setEmoji] = useState(threadInfo?.emoji || "");
  const [isEditing, setIsEditing] = useState(false);

  const disabled = !title.trim() || isPending;

  const handleUpdate = async () => {
    enqueueServerAction({
      action: async () => {
        await updateThreadInfo({
          id: threadId,
          title,
          emoji,
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
    return (
      <div className="space-y-4">
        <LinkToBack href={urls.dashboard} text="一覧に戻る" />
        <p>ポストが存在しません</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <LinkToBack href={urls.dashboard} text="一覧に戻る" />

      {isEditing ? (
        <div className="flex space-x-2">
          <Input
            value={emoji}
            onChange={(e) => setEmoji(e.target.value)}
            placeholder="😀"
            className="bg-white shadow-none"
            style={{ width: "70px" }}
            onKeyDown={handleKeyPress}
            maxLength={4}
          />
          <Input
            value={title}
            placeholder="タイトルを入力してください"
            className="bg-white shadow-none flex-1"
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyPress}
            forceFocus
          />
          <Button
            size="sm"
            className="h-9"
            variant="outline"
            onClick={() => {
              setIsEditing(false);
              setTitle(threadInfo.title || "");
              setEmoji(threadInfo.emoji || "");
            }}
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
        <div className="flex items-center justify-between">
          <h3 className="font-bold">
            {threadInfo.emoji ? `${threadInfo.emoji} ` : ""}
            {threadInfo.title || "タイトルなし"}
          </h3>
          <Tooltip content="編集">
            <Button
              variant="ghost"
              size="icon"
              className="transition-opacity hover:bg-gray-200"
              onClick={() => {
                setTitle(threadInfo.title || "");
                setEmoji(threadInfo.emoji || "");
                setIsEditing(true);
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </Tooltip>
        </div>
      )}

      <div className="flex items-center justify-between space-x-2">
        <div className="flex items-center space-x-2">
          <PublicStatusSheet
            threadTitle={threadInfo.title}
            threadId={threadId}
            isPublic={threadInfo.isPublic}
            ogpTitle={threadInfo.ogpTitle}
            ogpDescription={threadInfo.ogpDescription}
            ogpImagePath={threadInfo.ogpImagePath}
          />
          <ThreadStatusBadge status={threadInfo.status || "WIP"} />
        </div>
        <ManageThreadDropDown
          threadId={threadId}
          threadTitle={threadInfo.title}
          includeIsArchived={includeIsArchived}
          onClickToggleDisplayArchiveButton={toggleIncludeIsArchived}
          status={threadInfo.status || "WIP"}
        />
      </div>
    </div>
  );
}
