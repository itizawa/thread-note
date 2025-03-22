import { prisma } from "@/prisma";
import { UserSchema } from "@/types/src/domains";
import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../init";

export const userRouter = router({
  getCurrentUser: publicProcedure.query(async ({ ctx }) => {
    return ctx.currentUser;
  }),

  updateUserSettings: protectedProcedure
    .input(
      z.object({
        name: UserSchema.shape.name.optional(),
        image: z.string().url().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await prisma.user.update({
        where: {
          id: ctx.currentUser.id,
        },
        data: {
          name: input.name ?? ctx.currentUser.name,
          image: input.image ?? ctx.currentUser.image,
        },
      });
    }),

  getUser: publicProcedure
    .input(
      z.object({
        id: UserSchema.shape.id,
      })
    )
    .query(async ({ input }) => {
      return await prisma.user.findUnique({
        select: {
          id: true,
          name: true,
          image: true,
          createdAt: true,
          _count: {
            select: {
              threads: true,
              posts: true,
            },
          },
        },
        where: {
          id: input.id,
        },
      });
    }),
});
