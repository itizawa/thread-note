"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import * as React from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

type Props = {
  initialValue?: string;
  bottomButtons: {
    onCancel?: () => void;
    submitText: string;
    onSubmit: (body: string) => Promise<void>;
  };
};

export function PostForm({ bottomButtons, initialValue }: Props) {
  const [body, setBody] = React.useState(initialValue || "");
  const [isPending, startTransition] = React.useTransition();

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setBody(newContent);
  };

  const handleSubmit = () => {
    startTransition(async () => {
      bottomButtons.onSubmit(body);
      setBody("");
    });
  };

  return (
    <div>
      <Tabs defaultValue="edit" className="space-y-4">
        <TabsList>
          <TabsTrigger value="edit">編集</TabsTrigger>
          <TabsTrigger value="preview">プレビュー</TabsTrigger>
        </TabsList>
        <TabsContent value="edit" className="h-[300px] my-0">
          <textarea
            placeholder="テキストを入力..."
            value={body}
            onChange={handleContentChange}
            className="min-h-[300px] resize-none w-full border-0 bg-transparent text-base outline-none"
          />
        </TabsContent>
        <TabsContent value="preview" className="min-h-[300px] my-0">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
          >
            {body}
          </ReactMarkdown>
        </TabsContent>
      </Tabs>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {/* TODO: MDの各種機能を有効にする */}
          {/* <Button variant="ghost" size="icon">
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
          </Button> */}
        </div>
        <div className="flex items-center space-x-2">
          {bottomButtons.onCancel && (
            <Button variant="ghost" onClick={bottomButtons.onCancel}>
              キャンセル
            </Button>
          )}
          <Button onClick={handleSubmit} disabled={isPending}>
            {bottomButtons.submitText}
          </Button>
        </div>
      </div>
    </div>
  );
}
