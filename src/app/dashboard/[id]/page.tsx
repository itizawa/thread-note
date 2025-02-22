import { PostTimeLine } from "@/components/feature/threadDetail/PostTimeLine";
import { ThreadInformation } from "@/components/feature/threadDetail/ThreadInformation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { urls } from "@/consts/urls";
import { Suspense } from "react";

type Props = { params: Promise<{ id: string }> };

export default async function Page({ params }: Props) {
  const { id: threadId } = await params;

  return (
    <div className="h-full relative">
      <main className="w-full overflow-y-auto border-r md:px-6 px-2 md:pt-6 pt-4 pb-4">
        <div className="w-full max-w-[700px] mx-auto space-y-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href={urls.dashboard}>Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>New</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
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
