import { PostTimeLine } from "@/components/feature/threadDetail/PostTimeLine";
import { ThreadInformation } from "@/components/feature/threadDetail/ThreadInformation";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

type Props = { params: Promise<{ id: string }> };

export default async function Page({ params }: Props) {
  const { id: threadId } = await params;

  return (
    <div className="flex h-full">
      {/* メインコンテンツ */}
      <main className="flex-1 overflow-auto border-r md:px-6 px-2 md:pt-6 pt-4 pb-4">
        <div className="flex max-w-[700px] mx-auto">
          <Suspense fallback={<Skeleton className="w-full h-20" />}>
            <PostTimeLine threadId={threadId} />
          </Suspense>
        </div>
      </main>

      <aside className="hidden w-80 shrink-0 overflow-auto p-4 md:block bg-white">
        <ThreadInformation threadId={threadId} />
      </aside>
    </div>
  );
}
