"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import * as React from "react";

type Props = {
  textarea: {
    placeholder?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onKeyPress: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
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
  return (
    <div className="space-y-4">
      <Textarea
        placeholder={textarea.placeholder || "テキストを入力..."}
        className="min-h-[200px] resize-none w-full border-0 p-0 bg-transparent text-base outline-none focus:shadow-none shadow-none rounded-none md:text-base"
        value={textarea.value}
        onChange={textarea.onChange}
        onKeyDown={textarea.onKeyPress}
        forceFocus
      />

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
