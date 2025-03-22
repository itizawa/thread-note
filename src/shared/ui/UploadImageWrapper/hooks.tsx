"use client";

import { urls } from "@/consts/urls";
import { Button } from "@/shared/ui/button";
import Link from "next/link";
import { useCallback, useRef, useTransition } from "react";
import { toast } from "sonner";

export type UploadedImageData = {
  url: string;
  fileName: string;
};

export type UseUploadImageProps = {
  /**
   * 画像アップロード成功時に呼び出されるコールバック関数
   * @param data アップロードされた画像のデータ
   * @param file アップロードされたファイル
   */
  onSuccess: (data: UploadedImageData, file: File) => void;
};

export const useUploadImage = ({ onSuccess }: UseUploadImageProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, startTransition] = useTransition();

  // 画像アップロード処理
  const uploadImage = useCallback(
    async (file: File) =>
      startTransition(async () => {
        if (!file.type.startsWith("image/")) {
          toast.error("画像ファイルのみアップロードできます");
          return;
        }

        try {
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
          const imageData: UploadedImageData = {
            url: data.url,
            fileName: data.fileName,
          };

          // 成功時のコールバックを実行
          onSuccess(imageData, file);
        } catch (error) {
          if (error instanceof Error) {
            toast.error((error as Error).message, {
              action: (
                <Link href={urls.dashboardSettings("files")} passHref>
                  <Button
                    size="sm"
                    className="ml-auto shadow-none font-bold"
                    variant="destructive"
                  >
                    ファイル管理へ
                  </Button>
                </Link>
              ),
            });
          }
        }
      }),
    [onSuccess]
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

  // 画像の選択開始処理の開始
  const startSelect = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  return {
    fileInputRef,
    isUploading,
    uploadImage,
    handleFileChange,
    startSelect,
    handleDrop,
  };
};
