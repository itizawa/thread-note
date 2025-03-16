"use client";

import { YouTubeEmbed } from "@next/third-parties/google";

type Props = {
  videoid: string;
};

export const YouTubeCard = ({ videoid }: Props) => {
  return <YouTubeEmbed videoid={videoid} />;
};
