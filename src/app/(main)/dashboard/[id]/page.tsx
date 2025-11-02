import { getCurrentUser } from "@/app/actions/userActions";
import {
  PostTimeLine,
  PostTimeLineSkeleton,
} from "@/features/threadDetail/PostTimeLine";
import { urls } from "@/shared/consts/urls";
import { generateMetadataObject } from "@/shared/lib/generateMetadataObject";
import { trpc } from "@/trpc/server";
import { Stack } from "@mui/material";
import { Metadata, NextSegmentPage } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

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

export default async function Page({ params, searchParams }: Props) {
  const { id: threadId } = await params;
  const { postId } = await searchParams;

  const currentUser = await getCurrentUser();
  if (!currentUser) redirect(urls.top);

  return (
    <Stack height="100%" sx={{ overflowY: "scroll" }}>
      <Suspense fallback={<PostTimeLineSkeleton />}>
        <PostTimeLine
          threadId={threadId}
          postId={typeof postId === "string" ? postId : undefined}
        />
      </Suspense>
    </Stack>
  );
}
