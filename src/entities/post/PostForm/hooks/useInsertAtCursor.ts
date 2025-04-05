"use client";

import { useCallback } from "react";

type UseInsertAtCursorProps = {
  value: string;
  onChange: (value: string) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
};

export const useInsertAtCursor = ({
  value,
  onChange,
  textareaRef,
}: UseInsertAtCursorProps) => {
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

      let charCount = 0;
      let lineIndex = 0;
      for (let i = 0; i < lines.length; i++) {
        charCount += lines[i].length + 1;
        if (start < charCount) {
          lineIndex = i;
          break;
        }
      }
      const currentLine = lines[lineIndex];
      const isExist = currentLine.includes(insertText);
      const shouldRemove = removeIfExist && isExist;
      const convertedInsertText = isExist
        ? insertText.replace(" ", "")
        : insertText;

      if (shouldRemove) {
        lines[lineIndex] = currentLine.replaceAll(insertText, "");
      } else {
        lines[lineIndex] = `${convertedInsertText}${currentLine}`;
      }

      const newText = lines.join("\n");
      onChange(newText);

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
    [textareaRef, value, onChange]
  );

  return {
    textareaRef,
    insertAtCursor,
  };
};
