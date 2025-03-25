import { getCurrentUser } from "@/app/actions/userActions";
import { PostTimeLine } from "@/features/threadDetail/PostTimeLine";
import { urls } from "@/shared/consts/urls";
import { generateMetadataObject } from "@/shared/lib/generateMetadataObject";
import { trpc } from "@/trpc/server";
import { Metadata, NextSegmentPage } from "next";
import { redirect } from "next/navigation";

type Props = { params: Promise<{ id: string }> };

export const generateMetadata = async ({
  params,
}: NextSegmentPage<{
  params: { id: string };
}>["arguments"]): Promise<Metadata> => {
  const { id: threadId } = await params;

  const thread = await trpc.thread.getThreadInfo({
    id: threadId,
  });

  if (!thread)
    return generateMetadataObject({
      title: "Thread Not Found",
      description: "The requested thread does not exist.",
      images: ["/api/og?title=NotFound"],
    });

  return generateMetadataObject({
    title: thread.title || undefined,
    images: [`/api/og?title=${encodeURIComponent(thread.title || "")}`],
  });
};

export default async function Page({ params }: Props) {
  const { id: threadId } = await params;

  const currentUser = await getCurrentUser();
  if (!currentUser) redirect(urls.top);

  return (
    <div className="h-full relative">
      <main className="w-full overflow-y-auto border-r md:px-6 px-2 md:pt-6 pt-4 pb-4">
        <div className="w-full max-w-[700px] mx-auto">
          <PostTimeLine threadId={threadId} />
        </div>
      </main>

      {/* <aside className="hidden w-80 shrink-0 overflow-auto p-4 md:block bg-white">
        <ThreadInformation threadId={threadId} />
      </aside> */}
    </div>
  );
}
