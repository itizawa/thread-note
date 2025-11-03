"use client";

import { Box } from "@/shared/components/Box";
import { Typography } from "@/shared/components/Typography";
import { urls } from "@/shared/consts/urls";
import { useRouter } from "next-nprogress-bar";
import {
  PostDetailPaperHeader,
  PostDetailPaperLayout,
} from "./PostDetailPaper.layout";

export const PostDetailPaperError = ({ threadId }: { threadId: string }) => {
  const router = useRouter();

  const handleClose = () => {
    router.push(urls.dashboardThreadDetails(threadId));
  };

  return (
    <PostDetailPaperLayout
      headerSection={<PostDetailPaperHeader onClose={handleClose} />}
      contentSection={
        <Box pt="16px" textAlign="center">
          <Typography variant="body1" color="error">
            エラーが発生しました
          </Typography>
        </Box>
      }
      footerSection={<></>}
    />
  );
};
