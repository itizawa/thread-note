"use client";

import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

type UseImageUploadProps = {
  onImageUploaded: (markdownText: string) => void;
};

export const useImageUpload = ({ onImageUploaded }: UseImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  // 画像アップロード処理
  const uploadImage = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        toast.error("画像ファイルのみアップロードできます");
        return;
      }

      try {
        setIsUploading(true);

        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "アップロードに失敗しました");
        }

        const data = await response.json();

        // マークダウン形式で画像を挿入
        const imageMarkdown = `![${file.name}](${data.url})`;
        onImageUploaded(imageMarkdown);

        toast.success("画像をアップロードしました");
      } catch (error) {
        console.error("画像アップロードエラー:", error);
        toast.error("画像のアップロードに失敗しました");
      } finally {
        setIsUploading(false);
      }
    },
    [onImageUploaded]
  );

  // ドロップ処理
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        uploadImage(file);
      }
    },
    [uploadImage]
  );

  // ファイル選択処理
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        uploadImage(file);
        // ファイル選択をリセット
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    },
    [uploadImage]
  );

  // 画像アップロードボタンクリック処理
  const handleImageButtonClick = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  return {
    fileInputRef,
    isUploading,
    handleDrop,
    handleFileChange,
    handleImageButtonClick,
  };
};
