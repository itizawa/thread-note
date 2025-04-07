"use client";

import { useCallback } from "react";

type UseInsertMarkdownAtCursorProps = {
  value: string;
  onChange: (value: string) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
};

export const useInsertMarkdownAtCursor = ({
  value,
  onChange,
  textareaRef,
}: UseInsertMarkdownAtCursorProps) => {
  const insertMarkdownAtCursor = useCallback(
    (markdown: string) => {
      if (!textareaRef.current) return;

      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const text = value;

      const newText = text.substring(0, start) + markdown + text.substring(end);
      onChange(newText);

      requestAnimationFrame(() => {
        if (!textareaRef.current) return;
        const newCursorPos = start + markdown.length;
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
        textareaRef.current.focus();
      });
    },
    [textareaRef, value, onChange]
  );

  return {
    textareaRef,
    insertMarkdownAtCursor,
  };
};
