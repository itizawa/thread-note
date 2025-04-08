import { urls } from "@/shared/consts/urls";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Tooltip } from "@/shared/ui/Tooltip";

import { Archive, MoreHorizontal, PlaneTakeoff } from "lucide-react";
import Link from "next/link";

type Props = {
  threadId: string;
  includeIsArchived: boolean;
  onClickToggleDisplayArchiveButton: () => void;
};

export function ManageThreadDropDown({
  threadId,
  includeIsArchived,
  onClickToggleDisplayArchiveButton,
}: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Tooltip content="スレッドを操作">
          <Button variant="ghost" size="icon" className="hover:bg-gray-200">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">メニューを開く</span>
          </Button>
        </Tooltip>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <Link href={urls.dashboardThreadDetailsExports(threadId)} passHref>
          <DropdownMenuItem>
            <PlaneTakeoff className="h-4 w-4" />
            スレッドのエクスポート
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem onClick={onClickToggleDisplayArchiveButton}>
          <Archive className="h-4 w-4" />
          {includeIsArchived ? "アーカイブの非表示" : "アーカイブの表示"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
