import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { DropdownMenuItemWithIcon } from "@/shared/ui/dropdown-menu-item-with-icon";
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
        <DropdownMenuItemWithIcon
          icon={Pencil}
          text="編集"
          onClick={onClickEditButton}
        />
        {onClickShareButton && (
          <DropdownMenuItemWithIcon
            icon={Link}
            text="共有リンクをコピー"
            onClick={onClickShareButton}
          />
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItemWithIcon
          icon={Archive}
          text="アーカイブ"
          variant="destructive"
          onClick={onClickArchiveButton}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
