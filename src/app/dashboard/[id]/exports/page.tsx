import { getCurrentUser } from "@/app/actions/userActions";
import { ExportThread } from "@/features/threadExport/ExportThread";
import { urls } from "@/shared/consts/urls";
import { generateMetadataObject } from "@/shared/lib/generateMetadataObject";
import { Metadata, NextSegmentPage } from "next";
import { redirect } from "next/navigation";

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
        <div className="w-full max-w-[700px] mx-auto">
          <ExportThread threadId={threadId} />
        </div>
      </main>
    </div>
  );
}
