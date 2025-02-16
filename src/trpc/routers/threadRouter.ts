import { prisma } from "@/prisma";
import { PostSchema, ThreadSchema, UserSchema } from "@/types/src/domains";
import { z } from "zod";
import { baseProcedure, protectedProcedure, router } from "../init";
import { ListThreadsUseCase } from "../usecases/dashboard/ListThreadsUseCase";
import { CreateThreadWithFIrstPostUseCase } from "../usecases/newThread/CreateThreadWithFIrstPostUseCase";
import { CreatePostInDetailUseCase } from "../usecases/threadDetail/CreatePostInDetailUseCase";
import { GetThreadInfoUseCase } from "../usecases/threadDetail/GetThreadInfoUseCase";
import { GetThreadWithPostsUseCase } from "../usecases/threadDetail/GetThreadWithPostsUseCase";

const createThreadWithFIrstPostUseCase = new CreateThreadWithFIrstPostUseCase();
const getThreadWithInfoUseCase = new GetThreadInfoUseCase();
const getThreadWithPostsUseCase = new GetThreadWithPostsUseCase();
const listThreadsUseCase = new ListThreadsUseCase();
const createPostInDetailUseCase = new CreatePostInDetailUseCase();

export const threadRouter = router({
  listThreadsByUserId: baseProcedure
    .input(UserSchema.pick({ id: true }))
    .query(async ({ input }) => {
      return await listThreadsUseCase.execute({
        userId: input.id,
      });
    }),

  getThreadInfo: protectedProcedure
    .input(ThreadSchema.pick({ id: true }))
    .query(async ({ input }) => {
      return await getThreadWithInfoUseCase.execute({
        id: input.id,
      });
    }),

  updateThreadInfo: baseProcedure
    .input(ThreadSchema.pick({ id: true, title: true }))
    .mutation(async ({ ctx, input }) => {
      return await prisma.thread.update({
        where: {
          id: input.id,
          userId: ctx.currentUser?.id,
        },
        data: {
          title: input.title,
        },
      });
    }),

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
