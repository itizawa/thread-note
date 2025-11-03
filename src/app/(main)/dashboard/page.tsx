import { ThreadList } from "@/app/(main)/dashboard/_components/ThreadList";
import { ThreadListSkeleton } from "@/app/(main)/dashboard/_components/ThreadList/ThreadList.skeleton";
import { SCROLL_CONTAINER_ID } from "@/shared/consts/domId";
import { generateMetadataObject } from "@/shared/lib/generateMetadataObject";
import { Metadata } from "next";
import { Suspense } from "react";

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
            <ThreadList />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
