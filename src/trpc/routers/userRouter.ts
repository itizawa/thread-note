import { baseProcedure, router } from "../init";

export const userRouter = router({
  getCurrentUser: baseProcedure.query(async ({ ctx }) => {
    return ctx.currentUser;
  }),
});
