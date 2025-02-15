"use client";

import { updateThreadInfo } from "@/app/actions/threadActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/trpc/client";
import { useState, useTransition } from "react";

export function ThreadInformation({ threadId }: { threadId: string }) {
  const utils = trpc.useUtils();
  const { data: threadInfo, refetch } = trpc.thread.getThreadInfo.useQuery({
    id: threadId,
  });
  const [title, setTitle] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleUpdate = async () => {
    startTransition(async () => {
      await updateThreadInfo({
        id: threadId,
        title,
      });
      utils.thread.listThreadsByUserId.invalidate({ id: threadInfo?.userId });
      refetch();
    });
  };

  if (!threadInfo) {
    // TODO: ポストのデータを取得できなかった時のエラー処理画面を作成する https://github.com/itizawa/thread-note/issues/15
    return <p>No posts available.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="font-medium">タイトル</h3>
        <div className="flex space-x-2">
          <Input
            defaultValue={threadInfo.title || ""}
            placeholder="タイトルを入力してください"
            onChange={(e) => setTitle(e.target.value)}
          />
          <Button
            size="sm"
            className="h-9"
            onClick={handleUpdate}
            disabled={isPending}
          >
            更新
          </Button>
        </div>
      </div>
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
