"use client";

import { useCallback } from "react";

type UseContinueListOnEnterProps = {
  value: string;
  onChange: (value: string) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
};

export const useContinueListOnEnter = ({
  value,
  onChange,
  textareaRef,
}: UseContinueListOnEnterProps) => {
  const handleEnterKey = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Enterキーでない場合、修飾キーが押されている場合、または変換中の場合は処理しない
      if (
        e.key !== "Enter" ||
        e.shiftKey ||
        e.ctrlKey ||
        e.metaKey ||
        e.nativeEvent.isComposing // 変換確定時のEnterキーを無視
      ) {
        return false;
      }

      const cursorPos = textareaRef.current?.selectionStart;
      if (cursorPos === undefined) return false;

      // 現在の行の開始位置を見つける
      const textBeforeCursor = value.substring(0, cursorPos);
      const lastNewLineIndex = textBeforeCursor.lastIndexOf("\n");
      const currentLineStart =
        lastNewLineIndex === -1 ? 0 : lastNewLineIndex + 1;
      const currentLine = textBeforeCursor.substring(currentLineStart);

      // 行の先頭に "- " または "1. " などの番号付きリストがあるかチェック
      const trimmedLine = currentLine.trimStart();
      const isBulletList = trimmedLine.startsWith("- ");
      const isNumberedList = /^\d+\.\s/.test(trimmedLine);

      if (!isBulletList && !isNumberedList) return false;

      // 現在の行が空のリスト項目の場合、リストを終了
      if (
        (isBulletList && trimmedLine === "- ") ||
        (isNumberedList && /^\d+\.\s$/.test(trimmedLine))
      ) {
        e.preventDefault();
        // リストプレフィックスを削除して改行を挿入
        const newText =
          value.substring(0, currentLineStart) + value.substring(cursorPos);
        onChange(newText);

        // カーソル位置を更新
        requestAnimationFrame(() => {
          if (!textareaRef.current) return;
          const newCursorPos = currentLineStart;
          textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
        });
        return true;
      }

      // 通常のリストの場合、次の行にもリストプレフィックスを追加
      e.preventDefault();

      // 行頭のスペースを保持して同じインデントレベルを維持
      const leadingSpaces = currentLine.length - trimmedLine.length;
      const indent = currentLine.substring(0, leadingSpaces);

      let listPrefix = "- ";

      if (isNumberedList) {
        // 現在の番号を抽出して次の番号を計算
        const match = trimmedLine.match(/^(\d+)\.\s/);
        if (match) {
          const currentNumber = parseInt(match[1], 10);
          listPrefix = `${currentNumber + 1}. `;
        }
      }

      const newText =
        value.substring(0, cursorPos) +
        "\n" +
        indent +
        listPrefix +
        value.substring(cursorPos);
      onChange(newText);

      // カーソル位置を更新
      requestAnimationFrame(() => {
        if (!textareaRef.current) return;
        const newCursorPos = cursorPos + 1 + indent.length + listPrefix.length; // 改行 + インデント + リストプレフィックス
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      });
      return true;
    },
    [textareaRef, value, onChange]
  );

  return {
    handleEnterKey,
  };
};
