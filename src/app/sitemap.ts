import { MetadataRoute } from "next";

const baseUrl = "https://www.thread-note.com/";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
    },
    {
      url: `${baseUrl}/terms`,
    },
  ];

  // const postPaths: MetadataRoute.Sitemap = pages.map((page) => ({
  //   url: `${baseUrl}/pages/${page.id}`,
  //   lastModified: new Date(page.publishedAt),
  //   changeFrequency: "never",
  // }));

  return [...staticPaths];
}
