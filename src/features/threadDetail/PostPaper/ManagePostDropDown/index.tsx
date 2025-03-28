import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Tooltip } from "@/shared/ui/Tooltip";

import { Archive, MoreHorizontal, Pencil } from "lucide-react";

type Props = {
  isPending: boolean;
  isArchived: boolean;
  onClickEditButton: () => void;
  onClickArchiveButton: () => void;
  onClickUnArchiveButton: () => void;
};

export function ManagePostDropDown({
  isPending,
  isArchived,
  onClickEditButton,
  onClickArchiveButton,
  onClickUnArchiveButton,
}: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Tooltip content="ポストを操作">
          <Button variant="ghost" size="icon" disabled={isPending}>
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">メニューを開く</span>
          </Button>
        </Tooltip>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {!isArchived && (
          <DropdownMenuItem onClick={onClickEditButton}>
            <Pencil className="h-4 w-4" />
            編集
          </DropdownMenuItem>
        )}
        {!isArchived && (
          <DropdownMenuItem
            onClick={onClickArchiveButton}
            className="text-destructive focus:text-destructive"
          >
            <Archive className="h-4 w-4" />
            アーカイブ
          </DropdownMenuItem>
        )}
        {isArchived && (
          <DropdownMenuItem
            onClick={onClickUnArchiveButton}
            className="text-destructive focus:text-destructive"
          >
            <Archive className="h-4 w-4" />
            アーカイブを取り消す
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
