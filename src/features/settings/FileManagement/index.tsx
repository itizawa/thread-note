"use client";

import { IconButton } from "@/shared/components/IconButton";
import { Modal } from "@/shared/components/Modal";
import { Stack } from "@/shared/components/Stack";
import { Tooltip } from "@/shared/components/Tooltip";
import { Typography } from "@/shared/components/Typography";
import { SCROLL_CONTAINER_ID } from "@/shared/consts/domId";
import { convertBytesToDisplay } from "@/shared/lib/convertBytesToDisplay";
import { ExpandedImage } from "@/shared/ui/ExpandedImage";

import { Progress } from "@/shared/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { VirtualizedWindowScroller } from "@/shared/ui/virtualizedWindowScroller";
import { trpc } from "@/trpc/client";
import { DeleteOutlined } from "@mui/icons-material";
import { format } from "date-fns";
import { ClockArrowDown, File } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

export const FileManagement = () => {
  const [sortOrder, setSortOrder] = useState<"createdAt" | "size">("createdAt");
  const { data, hasNextPage, fetchNextPage, isLoading, isFetching, refetch } =
    trpc.file.listFiles.useInfiniteQuery(
      {
        limit: 20,
        sort: { type: sortOrder, direction: "desc" },
      },
      { getNextPageParam: (lastPage) => lastPage.nextCursor }
    );
  const { data: currentUsageData, refetch: refetchCurrentUsageData } =
    trpc.file.getCurrentUsage.useQuery();
  const files = data?.pages.flatMap((v) => v.files) || [];
  const currentUsage = currentUsageData?.currentUsage || 0;
  const usagePercentage = (currentUsage / (10 * 1024 * 1024)) * 100;
  const clampedUsagePercentage = Math.min(usagePercentage, 100);

  return (
    <div className="flex-1 flex flex-col space-y-4 h-full">
      <div className="flex flex-col rounded-lg border bg-white flex-1">
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
        <div className="flex flex-col space-y-1 px-4 py-3 relative shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              使用容量：{convertBytesToDisplay(currentUsage)} / 10MB
            </span>
            <span className="text-sm text-gray-500">
              {usagePercentage.toFixed(2)}%
            </span>
          </div>
          <Progress value={clampedUsagePercentage} />
        </div>
        <VirtualizedWindowScroller
          data={files}
          rowRenderer={(item) => (
            <FileListItem
              key={item.id}
              file={item}
              refetch={() => {
                refetch();
                refetchCurrentUsageData();
              }}
            />
          )}
          loadingRenderer={() => <PostListItemSkeleton />}
          loadMore={fetchNextPage}
          hasNextPage={hasNextPage}
          isLoading={isLoading}
          isFetching={isFetching}
          rowHeight={48}
          noRowsRenderer={() => (
            <div className="pt-5 px-2 text-center text-gray-500">
              ファイルが存在しません
            </div>
          )}
        />
      </div>
      {files.length > 10 && (
        <div
          className="py-8 text-center text-gray-500 cursor-pointer hover:opacity-60"
          onClick={() =>
            document
              .getElementById(SCROLL_CONTAINER_ID)
              ?.scrollTo({ top: 0, behavior: "smooth" })
          }
        >
          <span>トップに戻る</span>
        </div>
      )}
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
      <Modal
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        title="ファイル削除の確認"
        titleHelpText="ファイルを削除すると、ファイルは完全に削除されます。"
        actions={{
          type: "default",
          cancel: {
            text: "キャンセル",
            color: "gray",
            onClick: () => setIsDeleteDialogOpen(false),
            disabled: isPending,
          },
          submit: {
            text: "削除する",
            color: "error",
            onClick: () => handleDelete(file.id),
            disabled: isPending,
            loading: isPending,
          },
          align: "right",
        }}
      >
        <Stack gap="8px">
          <Typography variant="body2" bold whiteSpace="pre-wrap">
            {file.name || "タイトルなし"}
          </Typography>
          <Image
            src={file.path}
            alt={file.name}
            width={80}
            height={80}
            className="rounded mx-auto"
          />
          <Typography variant="body2" color="textSecondary">
            ファイルを削除してもよろしいですか？この操作は取り消せません。
          </Typography>
        </Stack>
      </Modal>

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
        <Tooltip content="削除する">
          <IconButton
            size="small"
            color="error"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsDeleteDialogOpen(true);
            }}
            disabled={isPending}
            loading={isPending}
          >
            <DeleteOutlined />
          </IconButton>
        </Tooltip>
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
