import { PostSchema, ThreadSchema } from "@/types/src/domains";
import { z } from "zod";
import { baseProcedure, protectedProcedure, router } from "../init";
import { CreateThreadWithFIrstPostUseCase } from "../usecases/newThread/CreateThreadWithFIrstPostUseCase";
import { CreatePostInDetailUseCase } from "../usecases/threadDetail/CreatePostInDetailUseCase";
import { GetThreadWithPostsUseCase } from "../usecases/threadDetail/GetThreadWithPostsUseCase";

const createThreadWithFIrstPostUseCase = new CreateThreadWithFIrstPostUseCase();
const getThreadWithPostsUseCase = new GetThreadWithPostsUseCase();
const createPostInDetailUseCase = new CreatePostInDetailUseCase();

export const threadRouter = router({
  getThreadWithPosts: baseProcedure
    .input(ThreadSchema.pick({ id: true }))
    .query(async ({ input }) => {
      return await getThreadWithPostsUseCase.execute({
        id: input.id,
      });
    }),
  createThreadWithFirstPost: protectedProcedure
    .input(PostSchema.pick({ body: true }))
    .mutation(async ({ ctx, input }) => {
      return await createThreadWithFIrstPostUseCase.execute({
        postBody: input.body,
        currentUser: ctx.currentUser,
      });
    }),
  createPostInThread: protectedProcedure
    .input(
      z.object({
        body: PostSchema.shape.body,
        threadId: ThreadSchema.shape.id,
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await createPostInDetailUseCase.execute({
        body: input.body,
        currentUser: ctx.currentUser,
        threadId: input.threadId,
      });
    }),
});
