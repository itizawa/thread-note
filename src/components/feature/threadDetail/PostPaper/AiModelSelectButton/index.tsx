"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Heart, MessageCircleWarningIcon, Search } from "lucide-react";

interface Props {
  type: "agreement" | "survey" | "feedback";
  onSelect: (value: "agreement" | "survey" | "feedback") => void;
  onClick?: () => void;
}

const options = [
  { label: "調査 AI", icon: Search, value: "survey" },
  { label: "賞賛 AI", icon: Heart, value: "agreement" },
  { label: "FB AI", icon: MessageCircleWarningIcon, value: "feedback" },
];

export function AiModelSelect({ type, onSelect }: Props) {
  return (
    <Select defaultValue={type} onValueChange={onSelect}>
      <SelectTrigger className="min-w-32 rounded-l-lg border-0 bg-transparent focus:ring-0 w-40">
        <SelectValue placeholder="Select AI Model" />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.icon && (
              <option.icon className="w-5 h-5 inline-block mr-2 text-gray-500" />
            )}
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
