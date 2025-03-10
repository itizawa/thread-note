import openGraphScraper from "open-graph-scraper";
import { z } from "zod";
import { publicProcedure, router } from "../init";

export const ogpRouter = router({
  fetchByUrl: publicProcedure
    .input(
      z.object({
        url: z.string(),
      })
    )
    .query(async ({ input }) => {
      try {
        const { result } = await openGraphScraper({ url: input.url });
        return {
          title: result.ogTitle,
          description: result.ogDescription || null,
          image: result.ogImage?.[0].url || null,
          favicon: result.favicon || null,
        };
      } catch (e) {
        console.log(e);
        return {
          title: input.url,
          description: null,
          image: null,
          favicon: null,
        };
      }
    }),
});
