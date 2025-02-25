import { prisma } from "@/prisma";
import { baseProcedure, router } from "../init";

export const userRouter = router({
  getCurrentUser: baseProcedure.query(async ({ ctx }) => {
    const user = await prisma.user.findUnique({
      where: {
        id: ctx.currentUser?.id,
      },
      include: {
        planSubscription: {
          select: {
            plan: true,
          },
        },
      },
    });
    return user;
  }),
});
