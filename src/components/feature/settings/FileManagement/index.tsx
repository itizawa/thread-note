"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VirtualizedList } from "@/components/ui/virtualizedList";
import { trpc } from "@/trpc/client";
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
    <div className="flex flex-col space-y-4 h-full">
      <div className="overflow-y-auto flex flex-col rounded-lg border bg-white flex-1">
        <div className="border-b px-4 py-3 flex items-center justify-between">
          <h2 className="font-medium">ファイル一覧</h2>
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
  const { mutate: deleteFile, isPending } = trpc.file.deleteFile.useMutation({
    onSuccess: () => {
      toast.success("ファイルを削除しました");
      refetch();
    },
    onError: () => {
      toast.error("ファイルの削除に失敗しました");
    },
  });

  const handleDelete = async (fileId: string) => {
    deleteFile({ fileId });
  };

  return (
    <a href={file.path} target="_blank" rel="noopener noreferrer">
      <div className="flex items-center justify-between gap-4 p-2 hover:bg-gray-100 cursor-pointer overflow-x-hidden">
        <div className="flex flex-1 items-center gap-2 overflow-x-hidden">
          <span className="flex-1 text-sm truncate">
            {file.name || "タイトルなし"}
          </span>
          <span className="text-sm text-gray-500">{file.size} bytes</span>
        </div>
        <Button
          variant="destructive"
          size="sm"
          className="font-bold"
          onClick={(e) => {
            e.preventDefault();
            handleDelete(file.id);
          }}
          disabled={isPending}
          loading={isPending}
        >
          削除
        </Button>
      </div>
    </a>
  );
}
