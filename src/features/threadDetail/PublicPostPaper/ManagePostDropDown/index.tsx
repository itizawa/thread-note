import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { DropdownMenuItemWithIcon } from "@/shared/ui/dropdown-menu-item-with-icon";

import { Link, MoreHorizontal } from "lucide-react";

type Props = {
  onClickShareButton: () => void;
};

export function ManagePostDropDown({ onClickShareButton }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">メニューを開く</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItemWithIcon
          icon={Link}
          text="リンクをコピー"
          onClick={onClickShareButton}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
