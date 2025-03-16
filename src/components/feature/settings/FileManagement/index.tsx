"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ExpandedImage } from "@/components/ui/ExpandedImage";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VirtualizedList } from "@/components/ui/virtualizedList";
import { trpc } from "@/trpc/client";
import { format } from "date-fns";
import { ClockArrowDown, File } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const FileManagement = () => {
  const [sortOrder, setSortOrder] = useState<"createdAt" | "size">("createdAt");
  const { data, hasNextPage, fetchNextPage, isLoading, refetch } =
    trpc.file.listFiles.useInfiniteQuery(
      {
        limit: 20,
        sort: { type: sortOrder, direction: "desc" },
      },
      { getNextPageParam: (lastPage) => lastPage.nextCursor }
    );
  const files = data?.pages.flatMap((v) => v.files) || [];

  return (
    <div className="flex-1 flex flex-col space-y-4 h-full">
      <div className="overflow-y-auto flex flex-col rounded-lg border bg-white flex-1">
        <div className="border-b px-4 py-3 flex items-center justify-between">
          <h2 className="font-bold font-sm">ファイル一覧</h2>
          <Select
            onValueChange={(value) =>
              setSortOrder(value as "createdAt" | "size")
            }
            defaultValue="size"
          >
            <SelectTrigger className="w-fit shadow-none cursor-pointer">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt" className="cursor-pointer">
                <span className="flex items-center">
                  <ClockArrowDown className="h-4 w-4" />
                  <span className="text-sm mx-2">作成日順</span>
                </span>
              </SelectItem>
              <SelectItem value="size" className="cursor-pointer">
                <span className="flex items-center">
                  <File className="h-4 w-4" />
                  <span className="text-sm mx-2">サイズ順</span>
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 overflow-y-auto">
          <VirtualizedList
            data={files}
            rowRenderer={(item) => (
              <FileListItem key={item.id} file={item} refetch={refetch} />
            )}
            loadingRenderer={() => <PostListItemSkeleton />}
            loadMore={fetchNextPage}
            hasNextPage={hasNextPage}
            isLoading={isLoading}
            rowHeight={48}
            noRowsRenderer={() => (
              <div className="pt-5 px-2 text-center text-gray-500">
                ファイルが存在しません
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
};

function PostListItemSkeleton() {
  return (
    <div className="flex items-center p-2">
      <div className="w-full h-5 bg-gray-200 rounded"></div>
    </div>
  );
}

function FileListItem({
  file,
  refetch,
}: {
  file: {
    name: string;
    id: string;
    createdAt: Date;
    size: number;
    path: string;
  };
  refetch: () => void;
}) {
  const [expand, setExpand] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { mutate: deleteFile, isPending } = trpc.file.deleteFile.useMutation({
    onSuccess: () => {
      toast.success("ファイルを削除しました");
      refetch();
      setIsDeleteDialogOpen(false);
    },
    onError: () => {
      toast.error("ファイルの削除に失敗しました");
      setIsDeleteDialogOpen(false);
    },
  });

  const handleDelete = async (fileId: string) => {
    deleteFile({ fileId });
  };

  return (
    <>
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ファイル削除の確認</DialogTitle>
            <DialogDescription className="flex flex-col items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
              <img src={file.path} className="w-12 h-12 rounded mx-auto" />「
              {file.name || "タイトルなし"}」を削除してもよろしいですか？
              この操作は取り消せません。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row">
            <Button
              variant="destructive"
              className="flex-1 font-bold"
              onClick={() => handleDelete(file.id)}
              disabled={isPending}
              loading={isPending}
            >
              削除する
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              キャンセル
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div
        className="flex items-center justify-between gap-4 p-2 hover:bg-gray-100 cursor-pointer overflow-x-hidden"
        onClick={() => setExpand(true)}
      >
        <div className="flex flex-1 items-center gap-2 overflow-x-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
          <img src={file.path} className="w-6 h-6 rounded" />
          <div className="flex-1 flex flex-col text-sm truncate">
            <span className="flex-1 text-sm truncate">
              {file.name || "タイトルなし"}
            </span>
            <div className="flex text-xs truncate text-gray-500 gap-4">
              <span>
                {format(new Date(file.createdAt), "yyyy/MM/dd HH:mm")}
              </span>
              <span>{file.size} bytes</span>
            </div>
          </div>
        </div>
        <Button
          variant="destructive"
          size="sm"
          className="font-bold"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDeleteDialogOpen(true);
          }}
          disabled={isPending}
          loading={isPending}
        >
          削除
        </Button>
      </div>
      <ExpandedImage
        expand={expand}
        src={file.path}
        alt={file.name}
        onClick={() => setExpand(false)}
      />
    </>
  );
}
