"use client";

import { urls } from "@/shared/consts/urls";
import { useClipBoardCopy } from "@/shared/hooks/useClipBoardCopy";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Tooltip } from "@/shared/ui/Tooltip";
import { Share, SquareArrowOutUpRight } from "lucide-react";
import Image from "next/image";
import urlJoin from "url-join";

export const ShareInformation = ({
  threadTitle,
  threadId,
}: {
  threadTitle: string | null;
  threadId: string;
}) => {
  const threadDetailUrl = urlJoin(
    window.location.origin,
    urls.threadDetails(threadId)
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
    <div className="space-y-6">
      <div className="space-y-2">
        <h4 className="font-medium">公開URL</h4>
        <div className="flex items-end justify-between">
          <div className="flex-1">
            <div className="flex items-center">
              <Input
                type="text"
                value={threadDetailUrl}
                readOnly
                className="cursor-pointer"
                onClick={() => copy(threadDetailUrl)}
              />
            </div>
          </div>
          <Tooltip content="別タブでページを開く">
            <Button
              variant="ghost"
              size="icon"
              className="ml-2"
              onClick={handleClickOpenPageIcon}
            >
              <SquareArrowOutUpRight className="h-4 w-4" />
            </Button>
          </Tooltip>
        </div>
        <p className="text-xs text-muted-foreground">
          URLをクリックするとコピーできます
        </p>
      </div>

      <div className="flex items-center justify-center space-x-6">
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
      </div>
    </div>
  );
};
