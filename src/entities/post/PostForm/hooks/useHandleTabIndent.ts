"use client";

import { useCallback } from "react";

type UseHandleTabIndentProps = {
  value: string;
  onChange: (value: string) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
};

export const useHandleTabIndent = ({
  value,
  onChange,
  textareaRef,
}: UseHandleTabIndentProps) => {
  const handleTabKey = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Tabキーでない場合は処理しない
      if (e.key !== "Tab") {
        return false;
      }

      e.preventDefault(); // ブラウザのデフォルト動作を防止

      const cursorPos = textareaRef.current?.selectionStart;
      const selectionEnd = textareaRef.current?.selectionEnd;

      if (cursorPos === undefined || selectionEnd === undefined) return false;

      // 複数行選択されている場合
      if (cursorPos !== selectionEnd) {
        const selectedText = value.substring(cursorPos, selectionEnd);

        // 選択されたテキストに改行が含まれている場合、各行の先頭にインデントを追加
        if (selectedText.includes("\n")) {
          const textBeforeSelection = value.substring(0, cursorPos);
          const textAfterSelection = value.substring(selectionEnd);

          // 選択範囲の最初の行の開始位置を見つける
          const lastNewLineBeforeSelection =
            textBeforeSelection.lastIndexOf("\n");
          const selectionStartLineStart =
            lastNewLineBeforeSelection === -1
              ? 0
              : lastNewLineBeforeSelection + 1;

          // 選択範囲を行ごとに分割
          const selectedLines = (
            textBeforeSelection.substring(selectionStartLineStart) +
            selectedText
          ).split("\n");

          // 各行の先頭にインデントを追加（Shift+Tabの場合はインデントを削除）
          const indentedLines = selectedLines.map((line) => {
            if (e.shiftKey) {
              // インデントを削除（Shift+Tab）
              if (line.startsWith("  ")) {
                return line.substring(2);
              } else if (line.startsWith(" ")) {
                return line.substring(1);
              }
              return line;
            } else {
              // インデントを追加（Tab）
              return "  " + line;
            }
          });

          // 新しいテキストを作成
          const newText =
            value.substring(0, selectionStartLineStart) +
            indentedLines.join("\n") +
            textAfterSelection;

          onChange(newText);

          // 選択範囲を維持
          requestAnimationFrame(() => {
            if (!textareaRef.current) return;
            const newSelectionStart = cursorPos + (e.shiftKey ? -2 : 2); // インデント分調整
            const newSelectionEnd =
              selectionEnd + (indentedLines.length - 1) * (e.shiftKey ? -2 : 2); // 行数分調整
            textareaRef.current.setSelectionRange(
              newSelectionStart,
              newSelectionEnd
            );
          });

          return true;
        }
      }

      // 単一行または選択なしの場合
      // 現在の行の開始位置を見つける
      const textBeforeCursor = value.substring(0, cursorPos);
      const lastNewLineIndex = textBeforeCursor.lastIndexOf("\n");
      const currentLineStart =
        lastNewLineIndex === -1 ? 0 : lastNewLineIndex + 1;
      const currentLine = textBeforeCursor.substring(currentLineStart);

      if (e.shiftKey) {
        // インデントを削除（Shift+Tab）
        if (currentLine.startsWith("  ")) {
          // 2スペースのインデントを削除
          const newText =
            value.substring(0, currentLineStart) +
            currentLine.substring(2) +
            value.substring(cursorPos);

          onChange(newText);

          // カーソル位置を更新
          requestAnimationFrame(() => {
            if (!textareaRef.current) return;
            const newCursorPos = Math.max(currentLineStart, cursorPos - 2);
            textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
          });

          return true;
        } else if (currentLine.startsWith(" ")) {
          // 1スペースのインデントを削除
          const newText =
            value.substring(0, currentLineStart) +
            currentLine.substring(1) +
            value.substring(cursorPos);

          onChange(newText);

          // カーソル位置を更新
          requestAnimationFrame(() => {
            if (!textareaRef.current) return;
            const newCursorPos = Math.max(currentLineStart, cursorPos - 1);
            textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
          });

          return true;
        }
      } else {
        // インデントを追加（Tab）
        const newText =
          value.substring(0, currentLineStart) +
          "  " + // 2スペースのインデント
          value.substring(currentLineStart);

        onChange(newText);

        // カーソル位置を更新
        requestAnimationFrame(() => {
          if (!textareaRef.current) return;
          const newCursorPos = cursorPos + 2;
          textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
        });

        return true;
      }

      return false;
    },
    [textareaRef, value, onChange]
  );

  return {
    handleTabKey,
  };
};
