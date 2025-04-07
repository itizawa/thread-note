"use client";

import { useCallback } from "react";

type UseWrapSelectedTextWithMarkdownProps = {
  value: string;
  onChange: (value: string) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
};

export const useWrapSelectedTextWithMarkdown = ({
  value,
  onChange,
  textareaRef,
}: UseWrapSelectedTextWithMarkdownProps) => {
  const wrapSelectedTextWithMarkdown = useCallback(
    (wrapper: string) => {
      if (!textareaRef.current) return;

      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;

      // 選択されたテキストがない場合は何もしない
      if (start === end) return;

      const selectedText = value.substring(start, end);
      const wrapperLength = wrapper.length;

      // 選択範囲の前後のテキストを取得
      const beforeText = value.substring(
        Math.max(0, start - wrapperLength),
        start
      );
      const afterText = value.substring(
        end,
        Math.min(value.length, end + wrapperLength)
      );

      // 選択範囲が太字マークダウンで囲まれているかチェック
      const isWrappedExactly = beforeText === wrapper && afterText === wrapper;

      let newText;
      let newSelectionStart;
      let newSelectionEnd;

      if (isWrappedExactly) {
        // 太字を解除する（ラッパーを削除）
        newText =
          value.substring(0, start - wrapperLength) +
          selectedText +
          value.substring(end + wrapperLength);

        newSelectionStart = start - wrapperLength;
        newSelectionEnd = end - wrapperLength;
      } else {
        // 太字にする（ラッパーを追加）
        newText =
          value.substring(0, start) +
          wrapper +
          selectedText +
          wrapper +
          value.substring(end);

        newSelectionStart = start + wrapperLength;
        newSelectionEnd = end + wrapperLength;
      }

      onChange(newText);

      requestAnimationFrame(() => {
        if (!textareaRef.current) return;
        // 選択範囲を維持
        textareaRef.current.setSelectionRange(
          newSelectionStart,
          newSelectionEnd
        );
        textareaRef.current.focus();
      });
    },
    [textareaRef, value, onChange]
  );

  return {
    wrapSelectedTextWithMarkdown,
  };
};
