import { IconButton } from "@/shared/components/IconButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { DropdownMenuItemWithIcon } from "@/shared/ui/dropdown-menu-item-with-icon";
import { MoreHorizOutlined } from "@mui/icons-material";

import { Link } from "lucide-react";

type Props = {
  onClickShareButton: () => void;
};

export function ManagePostDropDown({ onClickShareButton }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <IconButton size="small">
          <MoreHorizOutlined />
        </IconButton>
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
