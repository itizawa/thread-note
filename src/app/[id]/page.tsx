import { Footer } from "@/components/feature/layout/Footer";
import { Navigation } from "@/components/feature/layout/Navigation";
import { PublicPostTimeLine } from "@/components/feature/threadDetail/PublicPostTimeLine";
import { PublicThreadInformation } from "@/components/feature/threadDetail/PublicThreadInformation";
import { Skeleton } from "@/components/ui/skeleton";
import { urls } from "@/consts/urls";
import { generateMetadataObject } from "@/lib/generateMetadataObject";
import { HydrateClient, trpc } from "@/trpc/server";
import { Metadata, NextSegmentPage } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const generateMetadata = async ({
  params,
  searchParams,
}: NextSegmentPage<{
  params: { id: string };
}>["arguments"]): Promise<Metadata> => {
  const { id: threadId } = await params;
  const ogp = (await searchParams).ogp;
  const type = typeof ogp === "string" ? ogp : "default";

  const { threadWithPosts } = await trpc.thread.getPublicThreadWithPosts({
    id: threadId,
  });

  if (!threadWithPosts)
    return generateMetadataObject({
      title: "Thread Not Found",
      description: "The requested thread does not exist.",
      images: [`/api/og?title=NotFound?type=${type}`],
    });

  return generateMetadataObject({
    title: threadWithPosts.title || undefined,
    description: threadWithPosts.posts[0]?.body || undefined,
    images: [
      `/api/og?title=${encodeURIComponent(
        threadWithPosts.title || ""
      )}&type=${type}`,
    ],
  });
};
const Page: NextSegmentPage<{
  params: { id: string };
}> = async ({ params }) => {
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
};

export default Page;
