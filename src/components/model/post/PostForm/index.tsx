"use client";

import { Textarea } from "@/components/ui/textarea";
import * as React from "react";
import { PostController } from "./parts/postController";

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
  const [isFocused, setIsFocused] = React.useState(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const insertAtCursor = ({
    insertText,
    removeIfExist,
  }: {
    insertText: string;
    removeIfExist: boolean;
  }) => {
    if (!textareaRef.current) return;

    const start = textareaRef.current.selectionStart;
    const lines = textarea.value.split("\n");

    // カーソルのある行を特定
    let charCount = 0;
    let lineIndex = 0;
    for (let i = 0; i < lines.length; i++) {
      charCount += lines[i].length + 1; // `+1` は改行文字を考慮
      if (start < charCount) {
        lineIndex = i;
        break;
      }
    }
    const currentLine = lines[lineIndex];
    const isExist = currentLine.includes(insertText);
    const shouldRemove = removeIfExist && isExist;
    const convertedInsertText = isExist
      ? insertText.replace(" ", "") // すでに存在する場合はスペースを削除
      : insertText;

    if (shouldRemove) {
      lines[lineIndex] = currentLine.replaceAll(insertText, "");
    } else {
      lines[lineIndex] = `${convertedInsertText}${currentLine}`; // Use currentLine instead of lines[lineIndex]
    }

    // 文字列の更新
    const newText = lines.join("\n");
    textarea.onChange(newText);

    // カーソル位置を更新
    requestAnimationFrame(() => {
      if (!textareaRef.current) return;
      const newCursorPos =
        start +
        (shouldRemove
          ? -convertedInsertText.length
          : convertedInsertText.length);
      textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      textareaRef.current.focus();
    });
  };

  return (
    <>
      <div className="space-y-4">
        <Textarea
          ref={textareaRef}
          placeholder={textarea.placeholder || "テキストを入力..."}
          className="min-h-[200px] resize-none w-full border-0 p-0 bg-transparent text-base outline-none focus:shadow-none shadow-none rounded-none md:text-base"
          value={textarea.value}
          onChange={(e) => textarea.onChange(e.target.value)}
          onKeyDown={textarea.onKeyPress}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            if (
              e.relatedTarget?.id &&
              ["post_controller_list_button", "post_controller_header_button"].includes(e.relatedTarget.id) // prettier-ignore
            ) {
              return;
            }
            setIsFocused(false);
          }}
          forceFocus={textarea.forceFocus}
        />
        <PostController
          bottomButtons={bottomButtons}
          formState={formState}
          onClickIcon={insertAtCursor}
        />
      </div>
      {isFocused && (
        <div className="md:hidden block fixed bottom-0 left-0 right-0 z-10 p-2 bg-white shadow-md">
          <PostController
            bottomButtons={bottomButtons}
            formState={formState}
            onClickIcon={insertAtCursor}
          />
        </div>
      )}
    </>
  );
}
