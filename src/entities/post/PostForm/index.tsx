"use client";

import { Textarea } from "@/shared/ui/textarea";
import { UploadImageWrapper } from "@/shared/ui/UploadImageWrapper";
import * as React from "react";
import { useAutoResizeTextarea } from "./hooks/useAutoResizeTextarea";
import { useContinueListOnEnter } from "./hooks/useContinueListOnEnter";
import { useHandlePaste } from "./hooks/useHandlePaste";
import { useHandleTabIndent } from "./hooks/useHandleTabIndent";
import { useInsertAtCursor } from "./hooks/useInsertAtCursor";
import { useInsertMarkdownAtCursor } from "./hooks/useInsertMarkdownAtCursor";
import { useWrapSelectedTextWithMarkdown } from "./hooks/useWrapSelectedTextWithMarkdown";
import { PostController } from "./parts/postController";

type Props = {
  textarea: {
    minHeight?: number;
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
  const { value, onChange } = textarea;

  // テキストエリアの高さを自動調整するフックを使用
  const { handleResize } = useAutoResizeTextarea({
    value,
    textareaRef,
    minHeight: textarea.minHeight || 200,
  });

  const { insertMarkdownAtCursor } = useInsertMarkdownAtCursor({ value, onChange, textareaRef}); // prettier-ignore
  const { insertAtCursor } = useInsertAtCursor({ value, onChange, textareaRef }); // prettier-ignore
  const { handlePaste } = useHandlePaste({ value, onChange, textareaRef });
  const { wrapSelectedTextWithMarkdown } = useWrapSelectedTextWithMarkdown({ value, onChange, textareaRef }); // prettier-ignore
  const { handleEnterKey } = useContinueListOnEnter({ value, onChange, textareaRef }); // prettier-ignore
  const { handleTabKey } = useHandleTabIndent({ value, onChange, textareaRef }); // prettier-ignore

  // キーボードショートカットの処理
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // cmd + B (太字)
    if ((e.metaKey || e.ctrlKey) && e.key === "b") {
      e.preventDefault();
      wrapSelectedTextWithMarkdown("**");
      return;
    }

    // cmd + I (斜体)
    if ((e.metaKey || e.ctrlKey) && e.key === "i") {
      e.preventDefault();
      wrapSelectedTextWithMarkdown("*");
      return;
    }

    // Tab キー
    if (handleTabKey(e)) return;

    // Enter キー
    if (handleEnterKey(e)) return;

    // 元のonKeyPressを呼び出す
    if (textarea.onKeyPress) textarea.onKeyPress(e);
  };

  return (
    <UploadImageWrapper
      onSuccess={(data, file) => {
        const imageMarkdown = `![${file.name}](${data.url})`;
        insertMarkdownAtCursor(imageMarkdown);
      }}
    >
      {({ startSelect, handleDrop, isUploading }) => (
        <>
          <div className={`space-y-4`} onDrop={handleDrop}>
            <Textarea
              ref={textareaRef}
              placeholder={textarea.placeholder || "テキストを入力..."}
              className="resize-none w-full border-0 p-0 bg-transparent text-base outline-none focus:shadow-none shadow-none rounded-none md:text-base"
              onKeyPress={textarea.onKeyPress}
              value={textarea.value}
              onChange={(e) => {
                textarea.onChange(e.target.value);
                // カスタムフックの関数を使用して高さを調整
                handleResize();
              }}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              forceFocus={textarea.forceFocus}
            />
            <PostController
              bottomButtons={bottomButtons}
              formState={formState}
              onClickIcon={insertAtCursor}
              onClickImageUpload={startSelect}
            />
          </div>
          {isUploading && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white p-4 rounded-md">
                <p className="text-center">画像をアップロード中...</p>
              </div>
            </div>
          )}
        </>
      )}
    </UploadImageWrapper>
  );
}
