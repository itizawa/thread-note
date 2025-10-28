import { prisma } from "@/prisma";
import { protectedProcedure, router } from "../init";

export const workSpaceRouter = router({
  listWorkSpaces: protectedProcedure.query(async ({ ctx }) => {
    return await prisma.workSpace.findMany({
      where: { ownerId: ctx.currentUser.id },
    });
  }),
});
