import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

import { Archive, MoreHorizontal } from "lucide-react";

type Props = {
  includeIsArchived: boolean;
  onClickToggleDisplayArchiveButton: () => void;
};

export function ManageThreadDropDown({
  includeIsArchived,
  onClickToggleDisplayArchiveButton,
}: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-gray-200">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">メニューを開く</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onClickToggleDisplayArchiveButton}>
          <Archive className="h-4 w-4" />
          {includeIsArchived ? "アーカイブの非表示" : "アーカイブの表示"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
