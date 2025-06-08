"use client";

import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Smile } from "lucide-react";

const EMOJI_OPTIONS = [
  "📝", "💡", "🚀", "⭐", "🎯", "📚", "💻", "🔥", "🌟", "📋",
  "🏆", "💼", "🎨", "🔧", "📊", "🎪", "🎭", "🎪", "🎯", "🎲",
  "🎸", "🎺", "🎷", "🎻", "🥁", "🎹", "🎤", "🎧", "📻", "📺",
  "📹", "📷", "📱", "💾", "💿", "📀", "💽", "💻", "⌨️", "🖥️",
  "🖨️", "🖱️", "🖲️", "💽", "💾", "💿", "📀", "🎮", "🕹️", "📺"
];

interface EmojiPickerProps {
  selectedEmoji?: string | null;
  onEmojiSelect: (emoji: string | null) => void;
  placeholder?: string;
}

export function EmojiPicker({ selectedEmoji, onEmojiSelect, placeholder = "絵文字を選択" }: EmojiPickerProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="bg-white">
          {selectedEmoji ? (
            <span className="text-lg">{selectedEmoji}</span>
          ) : (
            <Smile className="h-4 w-4" />
          )}
          {placeholder}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-80 max-h-64 overflow-y-auto">
        <DropdownMenuItem onClick={() => onEmojiSelect(null)}>
          <span className="text-gray-500">絵文字なし</span>
        </DropdownMenuItem>
        <div className="grid grid-cols-8 gap-1 p-2">
          {EMOJI_OPTIONS.map((emoji) => (
            <DropdownMenuItem
              key={emoji}
              onClick={() => onEmojiSelect(emoji)}
              className="h-8 w-8 p-0 flex items-center justify-center cursor-pointer hover:bg-gray-100"
            >
              <span className="text-lg">{emoji}</span>
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}