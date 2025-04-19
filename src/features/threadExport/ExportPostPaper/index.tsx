"use client";

import { MarkdownViewer } from "@/shared/ui/MarkdownViewer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Textarea } from "@/shared/ui/textarea";
import { trpc } from "@/trpc/client";
import { generateBodyForExportPage } from "../hooks/generateBodyForExportPage";

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

  const bodyForExportPage = generateBodyForExportPage(
    threadWithPosts.posts || []
  );

  return (
    <Tabs defaultValue="edit" className="w-full">
      <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col space-y-2">
        <TabsList className="w-full">
          <TabsTrigger value="edit" className="flex-1">
            編集
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex-1">
            プレビュー
          </TabsTrigger>
        </TabsList>
        <TabsContent value="edit">
          <Textarea
            className="min-h-[300px]"
            defaultValue={bodyForExportPage}
          />
        </TabsContent>
        <TabsContent value="preview">
          <div className="prose space-y-4 break-words">
            <MarkdownViewer body={bodyForExportPage} />
          </div>
        </TabsContent>
      </div>
    </Tabs>
  );
}
