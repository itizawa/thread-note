import { Footer } from "@/features/layout/Footer";
import { Navigation } from "@/features/layout/Navigation";
import { PublicPostTimeLine } from "@/features/threadDetail/PublicPostTimeLine";
import { PublicThreadInformation } from "@/features/threadDetail/PublicThreadInformation";
import { urls } from "@/shared/consts/urls";
import { generateMetadataObject } from "@/shared/lib/generateMetadataObject";
import { LinkToBack } from "@/shared/ui/LinkToBack";
import { Skeleton } from "@/shared/ui/skeleton";
import { HydrateClient, trpc } from "@/trpc/server";
import { Metadata, NextSegmentPage } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const generateMetadata = async ({
  params,
}: NextSegmentPage<{
  params: { id: string };
}>["arguments"]): Promise<Metadata> => {
  const { id: threadId } = await params;

  const { threadWithPost } = await trpc.thread.getPublicThreadForOgp({
    id: threadId,
  });

  if (!threadWithPost)
    return generateMetadataObject({
      title: "Thread Not Found",
      description: "The requested thread does not exist.",
      images: ["/api/og?title=NotFound"],
    });

  const title =
    threadWithPost.ogpTitle || threadWithPost.title || "タイトルなし";
  const description =
    threadWithPost.ogpDescription ||
    threadWithPost.posts[0]?.body ||
    "スレッドの内容がありません。";

  return generateMetadataObject({
    title,
    description,
    images: [
      threadWithPost.ogpImagePath ||
        `/api/og?title=${encodeURIComponent(title || "")}`,
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
            <LinkToBack
              href={urls.userDetails(thread.userId)}
              text="一覧に戻る"
            />
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
