"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface Props {
  onSelect?: (value: string) => void;
  onClick?: () => void;
}

const options = [
  { label: "調査AI", icon: Search, value: "survey" },
  // { label: "AIモデル2", value: "2" },
  // { label: "AIモデル3", value: "3" },
];

export function AiModelSelect({ onSelect }: Props) {
  return (
    <Select defaultValue={"survey"} onValueChange={onSelect}>
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
