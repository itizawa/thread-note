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
    .input(
      z.object({
        userId: UserSchema.shape.id,
        cursor: z.string().optional(),
        page: z.number().optional(),
        limit: z.number().min(1).max(100).optional(),
      })
    )
    .query(async ({ input }) => {
      return await listThreadsUseCase.execute({
        userId: input.userId,
        page: input.page,
        cursor: input.cursor,
        limit: input.limit || 10,
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
    .input(
      z.object({
        id: ThreadSchema.shape.id,
        includeIsArchived: z.boolean(),
      })
    )
    .query(async ({ input }) => {
      return await getThreadWithPostsUseCase.execute({
        id: input.id,
        inCludeIsArchived: input.includeIsArchived,
      });
    }),

  createThreadWithFirstPost: protectedProcedure
    .input(
      z.object({
        body: PostSchema.shape.body.optional(),
        title: ThreadSchema.shape.title,
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await createThreadWithFIrstPostUseCase.execute({
        postBody: input.body,
        title: input.title,
        currentUser: ctx.currentUser,
      });
    }),

  createPostInThread: protectedProcedure
    .input(
      z.object({
        body: PostSchema.shape.body,
        threadId: ThreadSchema.shape.id,
        parentId: PostSchema.shape.id.optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await createPostInDetailUseCase.execute({
        currentUser: ctx.currentUser,
        body: input.body,
        threadId: input.threadId,
        parentId: input.parentId,
      });
    }),
});
