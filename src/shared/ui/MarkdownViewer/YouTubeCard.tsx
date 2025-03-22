"use client";

import { YouTubeEmbed } from "@next/third-parties/google";

type Props = {
  url: string;
};

export const YouTubeCard = ({ url }: Props) => {
  let videoId: string | null;
  if (url.includes("shorts/")) {
    videoId = url.split("shorts/")[1].split("?")[0];
  } else {
    const urlParams = new URLSearchParams(new URL(url).search);
    videoId = urlParams.get("v");
  }

  if (!videoId) return null;

  return <YouTubeEmbed videoid={videoId} />;
};
