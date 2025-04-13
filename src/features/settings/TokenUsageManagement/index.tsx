"use client";

import { SCROLL_CONTAINER_ID } from "@/shared/consts/domId";
import { Progress } from "@/shared/ui/progress";
import { VirtualizedWindowScroller } from "@/shared/ui/virtualizedWindowScroller";
import { trpc } from "@/trpc/client";
import { format } from "date-fns";

export const TokenUsageManagement = () => {
  const { data, hasNextPage, fetchNextPage, isLoading, isFetching } =
    trpc.token.listTokenUsages.useInfiniteQuery(
      { limit: 20 },
      { getNextPageParam: (lastPage) => lastPage.nextCursor }
    );
  const { data: currentUsageData } = trpc.token.getCurrentUsage.useQuery();
  const tokenUsages = data?.pages.flatMap((v) => v.tokenUsages) || [];
  const monthlyUsage = currentUsageData?.monthlyUsage || 0;

  // 月間の使用上限（例：100,000トークン）
  const monthlyLimit = 100000;
  const usagePercentage = (monthlyUsage / monthlyLimit) * 100;
  const clampedUsagePercentage = Math.min(usagePercentage, 100);

  return (
    <div className="flex-1 flex flex-col space-y-4 h-full">
      <div className="flex flex-col rounded-lg border bg-white flex-1">
        <div className="border-b px-4 py-3">
          <h2 className="font-bold font-sm">トークン使用履歴</h2>
        </div>
        <div className="flex flex-col space-y-1 px-4 py-3 relative shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              今月の使用量：{monthlyUsage.toLocaleString()} /{" "}
              {monthlyLimit.toLocaleString()} トークン
            </span>
            <span className="text-sm text-gray-500">
              {usagePercentage.toFixed(2)}%
            </span>
          </div>
          <Progress value={clampedUsagePercentage} />
        </div>
        <VirtualizedWindowScroller
          data={tokenUsages}
          rowRenderer={(item) => (
            <TokenUsageListItem key={item.id} tokenUsage={item} />
          )}
          loadingRenderer={() => <TokenUsageListItemSkeleton />}
          loadMore={fetchNextPage}
          hasNextPage={hasNextPage}
          isLoading={isLoading}
          isFetching={isFetching}
          rowHeight={48}
          noRowsRenderer={() => (
            <div className="pt-5 px-2 text-center text-gray-500">
              トークン使用履歴が存在しません
            </div>
          )}
        />
      </div>
      {tokenUsages.length > 10 && (
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

function TokenUsageListItemSkeleton() {
  return (
    <div className="flex items-center p-2">
      <div className="w-full h-5 bg-gray-200 rounded"></div>
    </div>
  );
}

function TokenUsageListItem({
  tokenUsage,
}: {
  tokenUsage: {
    id: string;
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    createdAt: Date;
  };
}) {
  return (
    <div className="flex items-center justify-between gap-4 p-2 hover:bg-gray-100 overflow-x-hidden">
      <div className="flex flex-1 items-center gap-2 overflow-x-hidden">
        <div className="flex-1 flex flex-col text-sm truncate">
          <div className="flex justify-between">
            <span className="text-sm">
              {format(new Date(tokenUsage.createdAt), "yyyy/MM/dd HH:mm")}
            </span>
            <span className="text-sm font-medium">
              {tokenUsage.totalTokens.toLocaleString()} トークン
            </span>
          </div>
          <div className="flex text-xs truncate text-gray-500 gap-4">
            <span>プロンプト: {tokenUsage.promptTokens.toLocaleString()}</span>
            <span>完了: {tokenUsage.completionTokens.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
