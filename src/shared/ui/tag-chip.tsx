import { cn } from "@/shared/lib/utils";

interface TagChipProps {
  name: string;
  onRemove?: () => void;
  className?: string;
}

export function TagChip({ name, onRemove, className }: TagChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-1 text-sm bg-gray-100 rounded-md",
        className
      )}
    >
      {name}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="hover:text-red-600"
        >
          ×
        </button>
      )}
    </span>
  );
}