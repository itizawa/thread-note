import { PostSchema } from "@/types/src/domains";
import { protectedProcedure, router } from "../init";
import { CreateThreadWithFIrstPostUseCase } from "../usecases/thread/CreateThreadWithFIrstPostUseCase";

const createThreadWithFIrstPostUseCase = new CreateThreadWithFIrstPostUseCase();

export const threadRouter = router({
  createThreadWithFirstPost: protectedProcedure
    .input(PostSchema.pick({ body: true }))
    .mutation(async ({ ctx, input }) => {
      return await createThreadWithFIrstPostUseCase.execute({
        postBody: input.body,
        currentUser: ctx.currentUser,
      });
    }),
});
