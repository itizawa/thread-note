import { Box } from "@/shared/components/Box";
import { IconButton } from "@/shared/components/IconButton";
import { Stack } from "@/shared/components/Stack";
import { Typography } from "@/shared/components/Typography";
import { ArrowBackOutlined, CloseOutlined } from "@mui/icons-material";
import type { ReactNode } from "react";

type PostDetailPaperLayoutProps = {
  headerSection: ReactNode;
  contentSection: ReactNode;
  footerSection: ReactNode;
};

export const PostDetailPaperLayout = ({
  headerSection,
  contentSection,
  footerSection,
}: PostDetailPaperLayoutProps) => {
  return (
    <Stack
      borderRight={(theme) => `1px solid ${theme.palette.divider}`}
      bgcolor="background.paper"
      height="100%"
      boxShadow="0 0 10px 0 rgba(0, 0, 0, 0.1)"
    >
      {headerSection}
      <Stack pb="8px" flex={1} minHeight={0} sx={{ overflowY: "auto" }}>
        {contentSection}
      </Stack>
      {footerSection}
    </Stack>
  );
};

type PostDetailPaperHeaderProps = {
  onClose: () => void;
};

export const PostDetailPaperHeader = ({
  onClose,
}: PostDetailPaperHeaderProps) => {
  return (
    <Box
      p="8px 16px"
      display="flex"
      justifyContent={{ xs: "flex-start", md: "space-between" }}
      alignItems="center"
      sx={{
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      <IconButton
        onClick={onClose}
        size="small"
        sx={{ display: { xs: "block", md: "none" } }}
      >
        <ArrowBackOutlined />
      </IconButton>
      <Typography variant="body2" bold>
        スレッド
      </Typography>
      <IconButton
        size="small"
        onClick={onClose}
        sx={{ display: { xs: "none", md: "block" } }}
      >
        <CloseOutlined />
      </IconButton>
    </Box>
  );
};
