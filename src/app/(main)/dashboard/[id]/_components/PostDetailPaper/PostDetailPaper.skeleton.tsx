"use client";

import { Box } from "@/shared/components/Box";
import { Skeleton } from "@/shared/components/Skeleton";
import { Stack } from "@/shared/components/Stack";
import { urls } from "@/shared/consts/urls";
import { useRouter } from "next-nprogress-bar";
import {
  PostDetailPaperHeader,
  PostDetailPaperLayout,
} from "./PostDetailPaper.layout";

export const PostDetailPaperSkeleton = ({ threadId }: { threadId: string }) => {
  const router = useRouter();

  const handleClose = () => {
    router.push(urls.dashboardThreadDetails(threadId));
  };

  return (
    <PostDetailPaperLayout
      headerSection={<PostDetailPaperHeader onClose={handleClose} />}
      contentSection={
        <>
          {/* メイン投稿のスケルトン */}
          <Box sx={{ p: "8px 16px" }}>
            <Box display="flex" alignItems="start" gap="8px">
              <Skeleton variant="circular" width={36} height={36} />
              <Stack flex={1} minWidth={0} gap="8px">
                <Box display="flex" alignItems="center" gap="8px">
                  <Skeleton variant="rounded" width={120} height={20} />
                  <Skeleton variant="rounded" width={100} height={16} />
                </Box>
                <Skeleton variant="rounded" width="100%" height={60} />
                <Skeleton variant="rounded" width="80%" height={40} />
              </Stack>
            </Box>
          </Box>

          {/* 返信数表示のスケルトン */}
          <Box sx={{ px: { xs: "8px", md: "16px" } }}>
            <Skeleton variant="rounded" width={80} height={20} />
          </Box>

          {/* 子投稿のスケルトン（2〜3個） */}
          {Array.from({ length: 2 }).map((_, index) => (
            <Box key={index} sx={{ p: "8px 16px" }}>
              <Box display="flex" alignItems="start" gap="8px">
                <Skeleton variant="circular" width={36} height={36} />
                <Stack flex={1} minWidth={0} gap="8px">
                  <Box display="flex" alignItems="center" gap="8px">
                    <Skeleton variant="rounded" width={100} height={20} />
                    <Skeleton variant="rounded" width={90} height={16} />
                  </Box>
                  <Skeleton variant="rounded" width="90%" height={50} />
                </Stack>
              </Box>
            </Box>
          ))}
        </>
      }
      footerSection={
        <Box
          sx={{ px: { xs: "8px", md: "16px" }, pb: { xs: "8px", md: "16px" } }}
        >
          <Stack gap="8px">
            <Skeleton variant="rounded" width="100%" height={100} />
            <Box display="flex" justifyContent="flex-end" gap="8px">
              <Skeleton variant="rounded" width={80} height={36} />
            </Box>
          </Stack>
        </Box>
      }
    />
  );
};
