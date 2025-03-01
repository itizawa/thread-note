import { getCurrentUser } from "@/app/actions/userActions";
import { PostTimeLine } from "@/components/feature/threadDetail/PostTimeLine";
import { ThreadInformation } from "@/components/feature/threadDetail/ThreadInformation";
import { Skeleton } from "@/components/ui/skeleton";
import { urls } from "@/consts/urls";
import { generateMetadataObject } from "@/lib/generateMetadataObject";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";

type Props = { params: Promise<{ id: string }> };

export const metadata: Metadata = generateMetadataObject({
  title: "Thread Note - New",
});

export default async function Page({ params }: Props) {
  const { id: threadId } = await params;

  const currentUser = await getCurrentUser();
  if (!currentUser) redirect(urls.top);

  return (
    <div className="h-full relative">
      <main className="w-full overflow-y-auto border-r md:px-6 px-2 md:pt-6 pt-4 pb-4">
        <div className="w-full max-w-[700px] mx-auto space-y-4">
          <ThreadInformation threadId={threadId} />
          <div className="overflow-y-auto">
            <Suspense fallback={<Skeleton className="w-full h-20" />}>
              <PostTimeLine threadId={threadId} />
            </Suspense>
          </div>
        </div>
      </main>

      {/* <aside className="hidden w-80 shrink-0 overflow-auto p-4 md:block bg-white">
        <ThreadInformation threadId={threadId} />
      </aside> */}
    </div>
  );
}
