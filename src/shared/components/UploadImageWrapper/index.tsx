"use client";

import { ReactNode, createContext, useContext } from "react";
import { useUploadImage } from "./hooks";

// コンテキストの型定義
type UploadImageContextType = {
  startSelect: () => void;
  handleDrop: (e: React.DragEvent) => void;
  isUploading: boolean;
};

// コンテキストの作成
const UploadImageContext = createContext<UploadImageContextType | undefined>(
  undefined
);

type ProviderProps = {
  children: ReactNode;
};

/**
 * 画像アップロードプロバイダー
 */
export const UploadImageProvider = ({ children }: ProviderProps) => {
  const {
    fileInputRef,
    isUploading,
    handleFileChange,
    handleDrop,
    startSelect,
  } = useUploadImage();

  const contextValue: UploadImageContextType = {
    startSelect,
    handleDrop,
    isUploading,
  };

  return (
    <UploadImageContext.Provider value={contextValue}>
      {children}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        aria-label="プロフィール画像をアップロード"
      />
    </UploadImageContext.Provider>
  );
};

/**
 * 画像アップロード機能を使用するためのカスタムフック
 */
export const useUploadImageContext = (): UploadImageContextType => {
  const context = useContext(UploadImageContext);

  if (context === undefined) {
    throw new Error(
      "useUploadImageContext must be used within an UploadImageProvider"
    );
  }

  return context;
};
