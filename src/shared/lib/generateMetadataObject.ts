import type { Metadata } from "next";
import { useTranslation } from "next-i18next";

const DEFAULT_TITLE_KEY = "metadata.defaultTitle";
const DEFAULT_DESCRIPTION_KEY = "metadata.defaultDescription";
const DEFAULT_URL = "https://www.thread-note.com";
const DEFAULT_IMAGE = "https://www.thread-note.com/ogp.png";

type Args = {
  titleKey?: string;
  descriptionKey?: string;
  url?: string;
  images?: string[];
};

export const generateMetadataObject = ({
  titleKey = DEFAULT_TITLE_KEY,
  descriptionKey = DEFAULT_DESCRIPTION_KEY,
  url = DEFAULT_URL,
  images = [DEFAULT_IMAGE],
}: Args = {}): Metadata => {
  const { t } = useTranslation("common");
  const title = t(titleKey);
  const description = t(descriptionKey);

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
