"use client";

import { trpc } from "@/trpc/client";
import { useState, useRef, KeyboardEvent } from "react";
import { X } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface Tag {
  id: string;
  name: string;
}

interface TagInputProps {
  value: Tag[];
  onChange: (tags: Tag[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function TagInput({
  value,
  onChange,
  placeholder = "タグを入力",
  className,
  disabled = false,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: suggestions = [] } = trpc.tag.searchTags.useQuery(
    { query: inputValue },
    {
      enabled: inputValue.length > 0,
    }
  );

  const createTagMutation = trpc.tag.createTag.useMutation();

  const handleKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      
      // 既に追加されているタグはスキップ
      if (value.some((tag) => tag.name === inputValue.trim())) {
        setInputValue("");
        return;
      }

      // サジェストに存在する場合はそれを使用
      const existingTag = suggestions.find(
        (tag: { id: string; name: string }) => tag.name.toLowerCase() === inputValue.trim().toLowerCase()
      );

      if (existingTag) {
        onChange([...value, existingTag]);
      } else {
        // 新しいタグを作成
        try {
          const newTag = await createTagMutation.mutateAsync({
            name: inputValue.trim(),
          });
          onChange([...value, newTag]);
        } catch (error) {
          console.error("Failed to create tag:", error);
        }
      }

      setInputValue("");
      setShowSuggestions(false);
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      // 入力欄が空の時にBackspaceで最後のタグを削除
      onChange(value.slice(0, -1));
    }
  };

  const handleSuggestionClick = (tag: Tag) => {
    if (disabled) return;
    
    if (!value.some((t) => t.id === tag.id)) {
      onChange([...value, tag]);
    }
    setInputValue("");
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const removeTag = (tagId: string) => {
    if (disabled) return;
    onChange(value.filter((tag) => tag.id !== tagId));
  };

  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "flex flex-wrap items-center gap-2 p-2 border rounded-md bg-white",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onClick={() => !disabled && inputRef.current?.focus()}
      >
        {value.map((tag) => (
          <span
            key={tag.id}
            className="inline-flex items-center gap-1 px-2 py-1 text-sm bg-gray-100 rounded-md"
          >
            {tag.name}
            {!disabled && (
              <button
                type="button"
                onClick={() => removeTag(tag.id)}
                className="hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setShowSuggestions(true);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder={value.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[120px] outline-none bg-transparent"
          disabled={disabled}
        />
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
          {suggestions.map((tag: { id: string; name: string }) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => handleSuggestionClick(tag)}
              className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
            >
              {tag.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}