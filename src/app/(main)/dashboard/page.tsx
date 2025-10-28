import { ThreadList } from "@/features/dashboard/ThreadList";
import { SCROLL_CONTAINER_ID } from "@/shared/consts/domId";
import { urls } from "@/shared/consts/urls";
import { generateMetadataObject } from "@/shared/lib/generateMetadataObject";
import { trpc } from "@/trpc/server";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense, use } from "react";

export const metadata: Metadata = generateMetadataObject({
  title: "Thread Note - ダッシュボード",
});

export default function Page() {
  return (
    <div className="relative h-full">
      {/* メインコンテンツ */}
      <main
        className="w-full overflow-y-auto border-r md:px-6 px-2 md:pt-6 pt-4 pb-4 h-full"
        id={SCROLL_CONTAINER_ID}
      >
        <div className="w-full max-w-[700px] mx-auto h-full">
          <Suspense fallback={<ThreadListSkeleton />}>
            <AuthenticatedContent />
          </Suspense>
        </div>
      </main>
    </div>
  );
}

// 認証チェックを行うコンポーネント
function AuthenticatedContent() {
  const currentUser = use(trpc.user.getCurrentUser());

  if (!currentUser) {
    redirect(urls.top);
  }

  return <ThreadList />;
}

// ローディング表示用のスケルトン
function ThreadListSkeleton() {
  return (
    <div className="flex flex-col space-y-4 h-full">
      <div className="flex justify-between items-center gap-4">
        <div className="w-full h-10 bg-gray-200 rounded animate-pulse" />
        <div className="w-24 h-10 bg-gray-200 rounded animate-pulse" />
      </div>
      <div className="rounded-lg border bg-white">
        <div className="border-b px-4 py-3">
          <div className="w-32 h-6 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="space-y-0">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 border-b">
              <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
              <div className="flex flex-1 flex-col gap-2">
                <div className="w-40 h-5 bg-gray-200 rounded animate-pulse" />
                <div className="w-20 h-3 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
