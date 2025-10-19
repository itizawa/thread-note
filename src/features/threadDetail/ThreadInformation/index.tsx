"use client";

import { updateThreadInfo } from "@/app/actions/threadActions";
import { PublicStatusSheet } from "@/features/threadDetail/PublicStatusSheet";
import { ThreadStatusBadge } from "@/features/threadDetail/ThreadStatusBadge";
import { Box } from "@/shared/components/Box";
import { Button } from "@/shared/components/Button";
import { IconButton } from "@/shared/components/IconButton";
import { Tooltip } from "@/shared/components/Tooltip";
import { urls } from "@/shared/consts/urls";
import { isMacOs, isWindowsOs } from "@/shared/lib/getOs";
import { useServerAction } from "@/shared/lib/useServerAction";
import { LinkToBack } from "@/shared/ui/LinkToBack";
import { Input } from "@/shared/ui/input";
import { trpc } from "@/trpc/client";
import { EditOutlined } from "@mui/icons-material";
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
        <Box display="flex" alignItems="center" gap={"8px"}>
          <Input
            defaultValue={threadInfo.title || ""}
            placeholder="タイトルを入力してください"
            className="bg-white shadow-none"
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyPress}
            forceFocus
          />
          <Button
            variant="outlined"
            onClick={() => setIsEditing(false)}
            disabled={isPending}
            sx={{ minWidth: "fit-content" }}
          >
            キャンセル
          </Button>
          <Button
            onClick={handleUpdate}
            disabled={disabled}
            loading={isPending}
          >
            更新
          </Button>
        </Box>
      ) : (
        <div className="flex items-center justify-between">
          <h3 className="font-bold">{threadInfo.title || "タイトルなし"}</h3>
          <Tooltip content="編集">
            <IconButton size="small" onClick={() => setIsEditing(true)}>
              <EditOutlined />
            </IconButton>
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
