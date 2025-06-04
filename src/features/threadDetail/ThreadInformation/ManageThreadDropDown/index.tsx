import { DeleteThreadDialog } from "@/entities/thread/DeleteThreadDialog";
import { urls } from "@/shared/consts/urls";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { DropdownMenuItemWithIcon } from "@/shared/ui/dropdown-menu-item-with-icon";
import { Tooltip } from "@/shared/ui/Tooltip";
import { Archive, MoreHorizontal, PlaneTakeoff, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  threadId: string;
  threadTitle: string | null;
  includeIsArchived: boolean;
  onClickToggleDisplayArchiveButton: () => void;
};

export function ManageThreadDropDown({
  threadId,
  threadTitle,
  includeIsArchived,
  onClickToggleDisplayArchiveButton,
}: Props) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const router = useRouter();

  const handleDeleteSuccess = () => {
    router.push(urls.dashboard);
  };

  return (
    <>
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
          <DropdownMenuItem asChild>
            <Link href={urls.dashboardThreadDetailsExports(threadId)}>
              <PlaneTakeoff className="h-4 w-4" />
              スレッドの出力
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItemWithIcon
            icon={Archive}
            text={includeIsArchived ? "アーカイブの非表示" : "アーカイブの表示"}
            onClick={onClickToggleDisplayArchiveButton}
          />
          <DropdownMenuSeparator />
          <DropdownMenuItemWithIcon
            icon={Trash2}
            text="スレッドの削除"
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
          />
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteThreadDialog
        threadId={threadId}
        threadTitle={threadTitle}
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onSuccess={handleDeleteSuccess}
      />
    </>
  );
}
