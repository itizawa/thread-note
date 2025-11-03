import { Box } from "@/shared/components/Box";
import { Skeleton } from "@/shared/components/Skeleton";
import { Stack } from "@/shared/components/Stack";
import { generateMetadataObject } from "@/shared/lib/generateMetadataObject";
import { trpc } from "@/trpc/server";
import { Metadata, NextSegmentPage } from "next";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
  PostDetailPaper,
  PostDetailPaperError,
  PostDetailPaperSkeleton,
} from "./_components/PostDetailPaper";
import { PostTimeLine } from "./_components/PostTimeLine";
import {
  ThreadInformation,
  ThreadInformationSkeleton,
} from "./_components/ThreadInformation";

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
  const postIdString = typeof postId === "string" ? postId : undefined;

  return (
    <Stack height="100%" sx={{ overflowY: "scroll" }}>
      <Box display="flex" height="100%">
        <Stack
          flex={2}
          minWidth={0}
          height="100%"
          sx={{
            overflowY: "auto",
            display: { xs: postId ? "none" : "flex", md: "flex" },
          }}
        >
          <Suspense fallback={<ThreadInformationSkeleton />}>
            <ThreadInformation threadId={threadId} />
          </Suspense>
          <Suspense
            fallback={
              <Stack px="16px" py="8px">
                <Skeleton width="100%" height="80px" />
                <Skeleton width="100%" height="80px" />
              </Stack>
            }
          >
            <Box flex={1} height="100%" minHeight={0}>
              <PostTimeLine threadId={threadId} />
            </Box>
          </Suspense>
        </Stack>
        {postIdString && (
          <Box sx={{ flex: 1 }} key={postIdString} minWidth={0}>
            <ErrorBoundary
              fallback={<PostDetailPaperError threadId={threadId} />}
            >
              <Suspense
                fallback={<PostDetailPaperSkeleton threadId={threadId} />}
              >
                <PostDetailPaper threadId={threadId} postId={postIdString} />
              </Suspense>
            </ErrorBoundary>
          </Box>
        )}
      </Box>
    </Stack>
  );
}
