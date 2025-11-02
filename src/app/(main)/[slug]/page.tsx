import { ThreadList } from "@/app/(main)/dashboard/_components/ThreadList";
import { SCROLL_CONTAINER_ID } from "@/shared/consts/domId";
import { generateMetadataObject } from "@/shared/lib/generateMetadataObject";
import { Metadata } from "next";

export const metadata: Metadata = generateMetadataObject({
  title: "Thread Note - ダッシュボード",
});
export default async function Page() {
  return (
    <div className="relative h-full">
      {/* メインコンテンツ */}
      <main
        className="w-full overflow-y-auto border-r md:px-6 px-2 md:pt-6 pt-4 pb-4 h-full"
        id={SCROLL_CONTAINER_ID}
      >
        <div className="w-full max-w-[700px] mx-auto h-full">
          <ThreadList />
        </div>
      </main>
    </div>
  );
}
