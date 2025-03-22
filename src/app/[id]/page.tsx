import { Footer } from "@/features/layout/Footer";
import { Navigation } from "@/features/layout/Navigation";
import { PublicPostTimeLine } from "@/features/threadDetail/PublicPostTimeLine";
import { PublicThreadInformation } from "@/features/threadDetail/PublicThreadInformation";
import { urls } from "@/shared/consts/urls";
import { generateMetadataObject } from "@/shared/lib/generateMetadataObject";
import { Skeleton } from "@/shared/ui/skeleton";
import { HydrateClient, trpc } from "@/trpc/server";
import { ArrowLeft } from "lucide-react";
import { Metadata, NextSegmentPage } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const generateMetadata = async ({
  params,
}: NextSegmentPage<{
  params: { id: string };
}>["arguments"]): Promise<Metadata> => {
  const { id: threadId } = await params;

  const { threadWithPosts } = await trpc.thread.getPublicThreadWithPosts({
    id: threadId,
  });

  if (!threadWithPosts)
    return generateMetadataObject({
      title: "Thread Not Found",
      description: "The requested thread does not exist.",
      images: ["/api/og?title=NotFound"],
    });

  return generateMetadataObject({
    title: threadWithPosts.title || undefined,
    description: threadWithPosts.posts[0]?.body || undefined,
    images: [
      `/api/og?title=${encodeURIComponent(threadWithPosts.title || "")}`,
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
          <div className="w-full max-w-[700px] mx-auto space-y-4 flex flex-col">
            <Link
              href={urls.userDetails(thread.userId)}
              className="flex items-center space-x-1 text-gray-700"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-xs">一覧に戻る</span>
            </Link>
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
