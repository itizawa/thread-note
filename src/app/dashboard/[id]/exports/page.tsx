import { getCurrentUser } from "@/app/actions/userActions";
import { ExportPostPaper } from "@/features/threadExport/ExportPostPaper";
import { ThreadInformation } from "@/features/threadExport/ThreadInformation";
import { urls } from "@/shared/consts/urls";
import { generateMetadataObject } from "@/shared/lib/generateMetadataObject";
import { LinkToBack } from "@/shared/ui/LinkToBack";
import { Skeleton } from "@/shared/ui/skeleton";
import { Metadata, NextSegmentPage } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";

type Props = { params: Promise<{ id: string }> };

export const generateMetadata = async ({
  params,
}: NextSegmentPage<{
  params: { id: string };
}>["arguments"]): Promise<Metadata> => {
  const { id: threadId } = await params;

  return generateMetadataObject({
    title: `${threadId}のエクスポートページ`,
  });
};

export default async function Page({ params }: Props) {
  const { id: threadId } = await params;

  const currentUser = await getCurrentUser();
  if (!currentUser) redirect(urls.top);

  return (
    <div className="h-full relative">
      <main className="w-full overflow-y-auto border-r md:px-6 px-2 md:pt-6 pt-4 pb-4">
        <div className="w-full max-w-[700px] mx-auto space-y-4">
          <Suspense
            fallback={
              <div className="space-y-4">
                <LinkToBack
                  href={urls.dashboardThreadDetails(threadId)}
                  text="編集に戻る"
                />
                <Skeleton className="w-full h-9" />
              </div>
            }
          >
            <ThreadInformation threadId={threadId} />
          </Suspense>

          <Suspense fallback={<Skeleton className="w-full h-20" />}>
            <ExportPostPaper threadId={threadId} />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
