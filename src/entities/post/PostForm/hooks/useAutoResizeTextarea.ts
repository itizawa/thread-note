import * as React from "react";

type Props = {
  value: string;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  minHeight?: number;
};

export function useAutoResizeTextarea({
  value,
  textareaRef,
  minHeight = 200,
}: Props) {
  // テキストエリアの高さを自動調整する関数
  const adjustTextareaHeight = React.useCallback(() => {
    const textareaElement = textareaRef.current;
    if (!textareaElement) return;

    // 一度高さをリセットして正確なスクロール高さを取得
    textareaElement.style.height = "auto";
    // スクロール高さに基づいて高さを設定（最小高さはminHeightで指定）
    textareaElement.style.height = `${Math.max(
      minHeight,
      textareaElement.scrollHeight
    )}px`;
  }, [textareaRef, minHeight]);

  // テキストが変更されたときに高さを調整
  React.useEffect(() => {
    adjustTextareaHeight();
  }, [value, adjustTextareaHeight]);

  // onChange イベントハンドラ内で使用するための関数
  const handleResize = React.useCallback(() => {
    // 値が変更されたら高さを調整（useEffectと併用して確実に調整）
    setTimeout(adjustTextareaHeight, 0);
  }, [adjustTextareaHeight]);

  return {
    adjustTextareaHeight,
    handleResize,
  };
}
