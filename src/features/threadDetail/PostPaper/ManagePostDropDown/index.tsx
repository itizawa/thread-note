import { IconButton } from "@/shared/components/IconButton";
import { Tooltip } from "@/shared/components/Tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { DropdownMenuItemWithIcon } from "@/shared/ui/dropdown-menu-item-with-icon";
import { MoreHorizOutlined } from "@mui/icons-material";

import { Archive, Link, Pencil } from "lucide-react";

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
          <IconButton size="small" disabled={isPending}>
            <MoreHorizOutlined />
          </IconButton>
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
          text="削除"
          variant="destructive"
          onClick={onClickArchiveButton}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
