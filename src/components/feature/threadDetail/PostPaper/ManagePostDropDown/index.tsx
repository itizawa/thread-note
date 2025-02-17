import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Archive, MoreHorizontal, Pencil } from "lucide-react";

type Props = {
  isPending: boolean;
  onClickEditButton: () => void;
  onClickArchiveButton: () => void;
};

export function ManagePostDropDown({
  isPending,
  onClickEditButton,
  onClickArchiveButton,
}: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" disabled={isPending}>
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">メニューを開く</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onClickEditButton}>
          <Pencil className="mr-2 h-4 w-4" />
          編集
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onClickArchiveButton}
          className="text-destructive focus:text-destructive"
        >
          <Archive className="mr-2 h-4 w-4" />
          アーカイブ
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
