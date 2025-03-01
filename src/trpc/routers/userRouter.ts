import { prisma } from "@/prisma";
import { UserSchema } from "@/types/src/domains";
import { z } from "zod";
import { baseProcedure, protectedProcedure, router } from "../init";

export const userRouter = router({
  getCurrentUser: baseProcedure.query(async ({ ctx }) => {
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
