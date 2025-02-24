"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Hash } from "lucide-react";
import * as React from "react";

type Props = {
  textarea: {
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    onKeyPress: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
    forceFocus?: boolean;
  };
  formState: {
    isDisabled: boolean;
    isPending: boolean;
  };
  bottomButtons: {
    onCancel?: () => void;
    submitText: string;
    onSubmit: () => void;
  };
};

export function PostForm({ bottomButtons, textarea, formState }: Props) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const insertAtCursor = (insertText: string) => {
    if (!textareaRef.current) return;

    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;

    // 文字列の更新
    const newText = `${textarea.value.substring(
      0,
      start
    )}${insertText}${textarea.value.substring(end)}`;
    textarea.onChange(newText);

    // カーソル位置を更新
    requestAnimationFrame(() => {
      if (!textareaRef.current) return;
      textareaRef.current.setSelectionRange(
        start + insertText.length,
        start + insertText.length
      );
      textareaRef.current.focus();
    });
  };

  return (
    <div className="space-y-4">
      <Textarea
        ref={textareaRef}
        placeholder={textarea.placeholder || "テキストを入力..."}
        className="min-h-[200px] resize-none w-full border-0 p-0 bg-transparent text-base outline-none focus:shadow-none shadow-none rounded-none md:text-base"
        value={textarea.value}
        onChange={(e) => textarea.onChange(e.target.value)}
        onKeyDown={textarea.onKeyPress}
        forceFocus={textarea.forceFocus}
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="shadow-none"
            size="icon"
            onClick={() => insertAtCursor("#")}
          >
            <Hash className="h-5 w-5" />
          </Button>
          {/*<Button variant="ghost" size="icon">
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
          <Button
            onClick={bottomButtons.onSubmit}
            disabled={formState.isDisabled}
            loading={formState.isPending}
          >
            {bottomButtons.submitText}
          </Button>
        </div>
      </div>
    </div>
  );
}
