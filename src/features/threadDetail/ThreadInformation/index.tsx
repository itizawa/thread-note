"use client";

import { updateThreadInfo } from "@/app/actions/threadActions";
import { PublicStatusSheet } from "@/features/threadDetail/PublicStatusSheet";
import { urls } from "@/shared/consts/urls";
import { isMacOs, isWindowsOs } from "@/shared/lib/getOs";
import { useServerAction } from "@/shared/lib/useServerAction";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { LinkToBack } from "@/shared/ui/LinkToBack";
import { TagChip } from "@/shared/ui/tag-chip";
import { TagInput } from "@/shared/ui/tag-input";
import { Tooltip } from "@/shared/ui/Tooltip";
import { trpc } from "@/trpc/client";
import { Pencil, Plus } from "lucide-react";
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
  const [isEditingTags, setIsEditingTags] = useState(false);
  const [tags, setTags] = useState<{ id: string; name: string }[]>([]);

  const { data: threadTags = [] } = trpc.tag.getTagsByThreadId.useQuery({
    threadId,
  });

  const addTagMutation = trpc.tag.addTagToThread.useMutation();
  const removeTagMutation = trpc.tag.removeTagFromThread.useMutation();

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
        <div className="flex items-center justify-between">
          <h3 className="font-bold">{threadInfo.title || "タイトルなし"}</h3>
          <Tooltip content="編集">
            <Button
              variant="ghost"
              size="icon"
              className="transition-opacity hover:bg-gray-200"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </Tooltip>
        </div>
      )}

      <div className="space-y-2">
        {isEditingTags ? (
          <div className="space-y-2">
            <TagInput
              value={tags}
              onChange={setTags}
              placeholder="タグを追加"
              className="bg-white"
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setIsEditingTags(false);
                  setTags([]);
                }}
              >
                キャンセル
              </Button>
              <Button
                size="sm"
                onClick={async () => {
                  for (const tag of tags) {
                    if (!threadTags.some((t: { id: string; name: string }) => t.id === tag.id)) {
                      await addTagMutation.mutateAsync({
                        threadId,
                        tagId: tag.id,
                      });
                    }
                  }
                  utils.tag.getTagsByThreadId.invalidate({ threadId });
                  setIsEditingTags(false);
                  setTags([]);
                }}
                disabled={tags.length === 0}
              >
                追加
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            {threadTags.map((tag: { id: string; name: string }) => (
              <TagChip
                key={tag.id}
                name={tag.name}
                onRemove={async () => {
                  await removeTagMutation.mutateAsync({
                    threadId,
                    tagId: tag.id,
                  });
                  utils.tag.getTagsByThreadId.invalidate({ threadId });
                }}
              />
            ))}
            <Tooltip content="タグを追加">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditingTags(true)}
                className="h-7 px-2"
              >
                <Plus className="h-3 w-3" />
                タグを追加
              </Button>
            </Tooltip>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between space-x-2">
        <PublicStatusSheet
          threadTitle={threadInfo.title}
          threadId={threadId}
          isPublic={threadInfo.isPublic}
          ogpTitle={threadInfo.ogpTitle}
          ogpDescription={threadInfo.ogpDescription}
          ogpImagePath={threadInfo.ogpImagePath}
        />
        <ManageThreadDropDown
          threadId={threadId}
          threadTitle={threadInfo.title}
          includeIsArchived={includeIsArchived}
          onClickToggleDisplayArchiveButton={toggleIncludeIsArchived}
        />
      </div>
    </div>
  );
}
