import { prisma } from "@/prisma";
import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";

export const appRouter = createTRPCRouter({
  currentUser: baseProcedure.query(async (opts) => {
    const currentUser = await prisma.user.findUnique({
      where: {
        id: opts.ctx.currentUser?.id,
      },
    });
    return {
      currentUser,
    };
  }),
  hello: baseProcedure
    .input(
      z.object({
        text: z.string(),
      })
    )
    .query((opts) => {
      return {
        greeting: `hello ${opts.input.text}`,
      };
    }),
});

export type AppRouter = typeof appRouter;
