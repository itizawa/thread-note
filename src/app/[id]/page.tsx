import { Footer } from "@/components/feature/layout/Footer";
import { Navigation } from "@/components/feature/layout/Navigation";
import { PublicPostTimeLine } from "@/components/feature/threadDetail/PublicPostTimeLine";
import { PublicThreadInformation } from "@/components/feature/threadDetail/PublicThreadInformation";
import { Skeleton } from "@/components/ui/skeleton";
import { urls } from "@/consts/urls";
import { generateMetadataObject } from "@/lib/generateMetadataObject";
import { HydrateClient, trpc } from "@/trpc/server";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";

type Props = { params: Promise<{ id: string }> };

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { id: threadId } = await params;
  const { threadWithPosts } = await trpc.thread.getPublicThreadWithPosts({
    id: threadId,
  });

  if (!threadWithPosts)
    return generateMetadataObject({
      title: "Thread Not Found",
      description: "The requested thread does not exist.",
    });

  return generateMetadataObject({
    title: threadWithPosts.title || undefined,
    description: threadWithPosts.posts[0]?.body || undefined,
  });
};
export default async function Page({ params }: Props) {
  const { id: threadId } = await params;

  // 公開状態のThreadかどうかをチェック
  const thread = await trpc.thread.getPublicThreadInfo({
    id: threadId,
  });

  // 公開状態でない場合はトップページにリダイレクト
  if (!thread) redirect(urls.top);

  return (
    <HydrateClient>
      <Navigation />
      <div className="relative bg-gray-100">
        <main className="w-full min-h-screen overflow-y-auto border-r md:px-6 px-2 md:pt-6 pt-4 pb-4">
          <div className="w-full max-w-[700px] mx-auto space-y-4">
            <PublicThreadInformation threadId={threadId} />
            <div className="overflow-y-auto">
              <Suspense fallback={<Skeleton className="w-full h-20" />}>
                <PublicPostTimeLine threadId={threadId} />
              </Suspense>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </HydrateClient>
  );
}
