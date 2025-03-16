import { ReactNode } from "react";
import { UploadedImageData, useUploadImage } from "./hooks";

type Props = {
  children: (args: {
    startSelect: () => void;
    handleDrop: (e: React.DragEvent) => void;
    isUploading: boolean;
  }) => ReactNode;
  onSuccess: (data: UploadedImageData, file: File) => void;
};

/**
 * 画像アップロードコンポーネント
 */
export const UploadImageWrapper = ({ children, onSuccess }: Props) => {
  const {
    fileInputRef,
    isUploading,
    handleFileChange,
    handleDrop,
    startSelect,
  } = useUploadImage({ onSuccess });

  return (
    <>
      {children({
        startSelect,
        handleDrop,
        isUploading,
      })}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        aria-label="プロフィール画像をアップロード"
      />
    </>
  );
};
