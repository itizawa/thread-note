import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Tooltip } from "@/shared/ui/Tooltip";

import { Archive, Link, MoreHorizontal, Pencil } from "lucide-react";

type Props = {
  isPending: boolean;
  onClickEditButton: () => void;
  onClickShareButton?: () => void;
  onClickArchiveButton: () => void;
};

export function ManagePostDropDown({
  isPending,
  onClickEditButton,
  onClickShareButton,
  onClickArchiveButton,
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
        <DropdownMenuItem onClick={onClickEditButton}>
          <Pencil className="h-4 w-4" />
          編集
        </DropdownMenuItem>
        {onClickShareButton && (
          <DropdownMenuItem onClick={onClickShareButton}>
            <Link className="h-4 w-4" />
            共有リンクをコピー
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onClickArchiveButton}
          className="text-destructive focus:text-destructive"
        >
          <Archive className="h-4 w-4" />
          アーカイブ
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
