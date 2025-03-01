import { prisma } from "@/prisma";
import { UserSchema } from "@/types/src/domains";
import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../init";

export const userRouter = router({
  getCurrentUser: publicProcedure.query(async ({ ctx }) => {
    return ctx.currentUser;
  }),

  updateUserName: protectedProcedure
    .input(
      z.object({
        name: UserSchema.shape.name,
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await prisma.user.update({
        where: {
          id: ctx.currentUser.id,
        },
        data: {
          name: input.name,
        },
      });
    }),
});
