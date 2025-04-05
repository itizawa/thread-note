"use client";

import { useCallback } from "react";

type UseHandlePasteProps = {
  value: string;
  onChange: (value: string) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
};

export const useHandlePaste = ({
  value,
  onChange,
  textareaRef,
}: UseHandlePasteProps) => {
  const insertMarkdownLinkAtCursor = useCallback(
    (url: string) => {
      if (!textareaRef.current) return;

      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const text = value;

      const selectedText = text.substring(start, end);
      const markdownLink = `[${selectedText}](${url})`;

      const newText =
        text.substring(0, start) + markdownLink + text.substring(end);
      onChange(newText);

      requestAnimationFrame(() => {
        if (!textareaRef.current) return;
        const newCursorPos = start + markdownLink.length;
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
        textareaRef.current.focus();
      });
    },
    [textareaRef, value, onChange]
  );

  const handlePaste = useCallback(
    (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
      const clipboardData = event.clipboardData;
      const pastedData = clipboardData.getData("Text");

      if (pastedData.startsWith("http")) {
        event.preventDefault();
        insertMarkdownLinkAtCursor(pastedData);
      }
    },
    [insertMarkdownLinkAtCursor]
  );

  return {
    textareaRef,
    handlePaste,
  };
};
