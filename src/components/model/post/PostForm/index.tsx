"use client";

import { Textarea } from "@/components/ui/textarea";
import * as React from "react";
import { useImageUpload } from "./hooks/useImageUpload";
import { useTextareaOperations } from "./hooks/useTextareaOperations";
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
  // テキストエリア操作のカスタムフック
  const { textareaRef, insertMarkdownAtCursor, insertAtCursor } =
    useTextareaOperations({
      value: textarea.value,
      onChange: textarea.onChange,
    });

  // 画像アップロードのカスタムフック
  const {
    fileInputRef,
    isDragging,
    isUploading,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handleFileChange,
    handleImageButtonClick,
  } = useImageUpload({
    onImageUploaded: insertMarkdownAtCursor,
  });

  return (
    <>
      <div
        className={`space-y-4 ${isDragging ? "relative" : ""}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {isDragging && (
          <div className="absolute inset-0 bg-primary/10 border-2 border-dashed border-primary rounded-md flex items-center justify-center z-10">
            <p className="text-primary font-medium">
              画像をドロップしてアップロード
            </p>
          </div>
        )}
        <Textarea
          ref={textareaRef}
          placeholder={textarea.placeholder || "テキストを入力..."}
          className="min-h-[200px] resize-none w-full border-0 p-0 bg-transparent text-base outline-none focus:shadow-none shadow-none rounded-none md:text-base"
          value={textarea.value}
          onChange={(e) => textarea.onChange(e.target.value)}
          onKeyDown={textarea.onKeyPress}
          forceFocus={textarea.forceFocus}
        />
        <PostController
          bottomButtons={bottomButtons}
          formState={formState}
          onClickIcon={insertAtCursor}
          onClickImageUpload={handleImageButtonClick}
        />
        {/* 隠しファイル入力 */}
        <input
          id="image-upload"
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        {isUploading && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-md">
              <p className="text-center">画像をアップロード中...</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
