"use client";

import { updateThreadInfo } from "@/app/actions/threadActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/trpc/client";
import { Pencil } from "lucide-react";
import { useState, useTransition } from "react";

export function ThreadInformation({ threadId }: { threadId: string }) {
  const utils = trpc.useUtils();
  const {
    data: threadInfo,
    refetch,
    isLoading,
  } = trpc.thread.getThreadInfo.useQuery({
    id: threadId,
  });
  const [title, setTitle] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();

  const disabled = !title || isPending;

  const handleUpdate = async () => {
    startTransition(async () => {
      await updateThreadInfo({
        id: threadId,
        title,
      });
      utils.thread.listThreadsByUserId.invalidate({
        userId: threadInfo?.userId,
      });
      setIsEditing(false);
      refetch();
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="w-full h-9" />
      </div>
    );
  }

  if (!threadInfo) {
    // TODO: ポストのデータを取得できなかった時のエラー処理画面を作成する https://github.com/itizawa/thread-note/issues/15
    return <p>No posts available.</p>;
  }

  return (
    <div className="space-y-4">
      {isEditing ? (
        <div className="flex space-x-2">
          <Input
            defaultValue={threadInfo.title || ""}
            placeholder="タイトルを入力してください"
            className="bg-white"
            onChange={(e) => setTitle(e.target.value)}
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
          <Button variant="ghost" onClick={() => setIsEditing(true)}>
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
      )}
      {/* <div className="space-y-2">
        <h3 className="font-medium">タグ</h3>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm">
            #features
          </Button>
          <Button variant="secondary" size="sm">
            #hello
          </Button>
          <Button variant="secondary" size="sm">
            #todo
          </Button>
        </div>
      </div> */}
    </div>
  );
}
