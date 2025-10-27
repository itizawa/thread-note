"use client";

import { Box } from "@/shared/components/Box";
import { IconButton } from "@/shared/components/IconButton";
import { Stack } from "@/shared/components/Stack";
import { TextField } from "@/shared/components/TextField";
import { Tooltip } from "@/shared/components/Tooltip";
import { Typography } from "@/shared/components/Typography";
import { urls } from "@/shared/consts/urls";
import { useClipBoardCopy } from "@/shared/hooks/useClipBoardCopy";
import { OpenInNewOutlined } from "@mui/icons-material";

import { Share } from "lucide-react";
import Image from "next/image";
import urlJoin from "url-join";

export const ShareInformation = ({
  userId,
  threadTitle,
  threadId,
}: {
  userId: string;
  threadTitle: string | null;
  threadId: string;
}) => {
  const threadDetailUrl = urlJoin(
    window.location.origin,
    urls.threadDetails({
      userId,
      threadId,
    })
  );
  const { copy } = useClipBoardCopy();

  const handleClickOpenPageIcon = () => {
    window.open(threadDetailUrl, "_blank", "noopener,noreferrer");
  };

  const handleClickShare = () => {
    navigator
      ?.share({
        title: "スレッドを共有",
        url: threadDetailUrl,
      })
      .catch(() => void 0); // NOTE: シェアをキャンセルとするとエラーが投げられるため握りつぶす
  };

  // SNS共有用の関数
  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      threadDetailUrl
    )}&text=${threadTitle || ""}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const shareToLine = () => {
    const url = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(
      threadDetailUrl
    )}&text=${threadTitle || ""}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const shareToHatena = () => {
    const url = `https://b.hatena.ne.jp/add?mode=confirm&url=${encodeURIComponent(
      threadDetailUrl
    )}${threadTitle ? `&title=${threadTitle}` : ""}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <Stack rowGap="24px">
      <Stack rowGap="8px">
        <Typography variant="body1" bold>
          公開URL
        </Typography>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          gap="8px"
        >
          <TextField
            fullWidth
            type="text"
            value={threadDetailUrl}
            readOnly
            className="cursor-pointer"
            onClick={() => copy(threadDetailUrl)}
          />
          <Tooltip content="別タブでページを開く">
            <IconButton size="small" onClick={handleClickOpenPageIcon}>
              <OpenInNewOutlined />
            </IconButton>
          </Tooltip>
        </Box>
        <Typography variant="caption" color="textSecondary">
          公開URLをクリックするとコピーできます
        </Typography>
      </Stack>

      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        gap="24px"
      >
        <Tooltip content="Xでシェア">
          <Image
            src={"/sns/x.png"}
            width={24}
            height={24}
            className="hover:opacity-60 cursor-pointer"
            onClick={shareToTwitter}
            alt={"x_icon"}
          />
        </Tooltip>
        <Tooltip content="LINEでシェア">
          <Image
            src={"/sns/line.png"}
            width={32}
            height={32}
            className="hover:opacity-60 cursor-pointer"
            onClick={shareToLine}
            alt={"line_icon"}
          />
        </Tooltip>
        <Tooltip content="はてなブックマークでシェア">
          <Image
            src={"/sns/hatena.png"}
            width={32}
            height={32}
            className="hover:opacity-60 cursor-pointer"
            onClick={shareToHatena}
            alt={"hatena_icon"}
          />
        </Tooltip>
        <Tooltip content="その他のSNSでシェア">
          <button
            className="p-2 hover:bg-gray-200 rounded-md"
            onClick={handleClickShare}
          >
            <Share className="h-5 w-5 cursor-pointer" />
          </button>
        </Tooltip>
      </Box>
    </Stack>
  );
};
