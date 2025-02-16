import { prisma } from "@/prisma";
import { PostSchema } from "@/types/src/domains";
import { z } from "zod";
import { protectedProcedure, router } from "../init";

export const postRouter = router({
  updatePostBody: protectedProcedure
    .input(z.object({ id: PostSchema.shape.id, body: PostSchema.shape.body }))
    .mutation(async ({ ctx, input }) => {
      return await prisma.post.update({
        where: {
          id: input.id,
          userId: ctx.currentUser?.id,
        },
        data: {
          body: input.body,
        },
      });
    }),
});
