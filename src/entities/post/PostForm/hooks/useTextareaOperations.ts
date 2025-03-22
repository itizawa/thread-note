"use client";

import { useCallback, useRef } from "react";

type UseTextareaOperationsProps = {
  value: string;
  onChange: (value: string) => void;
};

export const useTextareaOperations = ({
  value,
  onChange,
}: UseTextareaOperationsProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // マークダウンをカーソル位置に挿入
  const insertMarkdownAtCursor = useCallback(
    (markdown: string) => {
      if (!textareaRef.current) return;

      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const text = value;

      // 選択範囲の前後のテキストと挿入するマークダウンを結合
      const newText = text.substring(0, start) + markdown + text.substring(end);
      onChange(newText);

      // カーソル位置を更新
      requestAnimationFrame(() => {
        if (!textareaRef.current) return;
        const newCursorPos = start + markdown.length;
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
        textareaRef.current.focus();
      });
    },
    [value, onChange]
  );

  // マークダウン記法を行の先頭に挿入
  const insertAtCursor = useCallback(
    ({
      insertText,
      removeIfExist,
    }: {
      insertText: string;
      removeIfExist: boolean;
    }) => {
      if (!textareaRef.current) return;

      const start = textareaRef.current.selectionStart;
      const lines = value.split("\n");

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
        lines[lineIndex] = `${convertedInsertText}${currentLine}`;
      }

      // 文字列の更新
      const newText = lines.join("\n");
      onChange(newText);

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
    },
    [value, onChange]
  );

  return {
    textareaRef,
    insertMarkdownAtCursor,
    insertAtCursor,
  };
};
