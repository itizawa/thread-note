import { prisma } from "@/prisma";
import { baseProcedure, router } from "../init";
import { threadRouter } from "./threadRouter";

export const appRouter = router({
  currentUser: baseProcedure.query(async (opts) => {
    if (!opts.ctx.currentUser) {
      return {
        currentUser: null,
      };
    }
    const currentUser = await prisma.user.findUnique({
      where: {
        id: opts.ctx.currentUser.id,
      },
    });
    return {
      currentUser,
    };
  }),
  thread: threadRouter,
});

export type AppRouter = typeof appRouter;
