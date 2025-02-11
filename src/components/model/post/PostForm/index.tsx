"use client";

import { createThreadWithFirstPost } from "@/app/actions/threadActions";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { urls } from "@/consts/urls";
import { Hash, Link2, ListTodo, Paperclip } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

export function PostForm() {
  const router = useRouter();
  const [content, setContent] = React.useState("");

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
  };

  const handleSubmit = async () => {
    const { thread } = await createThreadWithFirstPost(content);
    router.push(urls.dashboardThreadDetails(thread.id));
  };

  return (
    <div className="rounded-lg border p-4 bg-white">
      <Tabs defaultValue="edit" className="space-y-4">
        <TabsList>
          <TabsTrigger value="edit">編集</TabsTrigger>
          <TabsTrigger value="preview">プレビュー</TabsTrigger>
        </TabsList>
        <TabsContent value="edit" className="h-[300px] my-0">
          <textarea
            placeholder="テキストを入力..."
            value={content}
            onChange={handleContentChange}
            className="min-h-[300px] resize-none w-full border-0 bg-transparent text-base outline-none"
          />
        </TabsContent>
        <TabsContent value="preview" className="min-h-[300px] my-0">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
          >
            {content}
          </ReactMarkdown>
        </TabsContent>
      </Tabs>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon">
            <Hash className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <ListTodo className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Link2 className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Paperclip className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={handleSubmit}>投稿</Button>
        </div>
      </div>
    </div>
  );
}
