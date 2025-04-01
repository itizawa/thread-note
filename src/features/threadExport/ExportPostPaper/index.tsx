"use client";

import { MarkdownViewer } from "@/shared/ui/MarkdownViewer";
import { trpc } from "@/trpc/client";

export function ExportPostPaper({ threadId }: { threadId: string }) {
  const [{ threadWithPosts }] = trpc.thread.getThreadWithPosts.useSuspenseQuery(
    {
      id: threadId,
      includeIsArchived: false,
    }
  );

  if (!threadWithPosts) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <p>ポストが存在しません</p>
      </div>
    );
  }

  const body = threadWithPosts.posts.map((v) => v.body).join("\n");

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="prose space-y-4 break-words">
        <MarkdownViewer body={body} />
      </div>
    </div>
  );
}
