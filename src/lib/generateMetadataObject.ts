import type { Metadata } from "next";

const DEFAULT_TITLE = "Thread Note - スレッド形式のノートサービス";
const DEFAULT_DESCRIPTION =
  "Thread Note はスレッド形式で手軽に情報を残すことができるサービスです。";
const DEFAULT_URL = "https://www.thread-note.com";
const DEFAULT_IMAGE = "https://www.thread-note.com/ogp.png";

type Args = {
  title?: string;
  description?: string;
  url?: string;
  images?: string[];
};

export const generateMetadataObject = ({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  url = DEFAULT_URL,
  images = [DEFAULT_IMAGE],
}: Args = {}): Metadata => {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: "Thread Note",
      locale: "ja_JP",
      type: "website",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: "@",
      creator: "@",
    },
    metadataBase: new URL("https://www.thread-note.com"),
  };
};
