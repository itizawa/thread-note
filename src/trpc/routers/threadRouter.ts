import { PostSchema, ThreadSchema } from "@/types/src/domains";
import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../init";
import { ListThreadsUseCase } from "../usecases/dashboard/ListThreadsUseCase";
import { CreateThreadWithFIrstPostUseCase } from "../usecases/newThread/CreateThreadWithFIrstPostUseCase";
import { CreatePostInDetailUseCase } from "../usecases/threadDetail/CreatePostInDetailUseCase";
import { GetThreadWithPostsUseCase } from "../usecases/threadDetail/GetThreadWithPostsUseCase";
import { GetThreadInfoUseCase } from "../usecases/threadDetail/GetThreadInfoUseCase";
import { ThreadRepository } from "../adapter/repositories/ThreadRepository";

// Repository のインスタンスを作成
const threadRepository = new ThreadRepository();

// UseCase に Repository を注入
const createThreadWithFIrstPostUseCase = new CreateThreadWithFIrstPostUseCase(threadRepository);
const getThreadWithPostsUseCase = new GetThreadWithPostsUseCase(threadRepository);
const getThreadInfoUseCase = new GetThreadInfoUseCase(threadRepository);
const listThreadsUseCase = new ListThreadsUseCase(threadRepository);
const createPostInDetailUseCase = new CreatePostInDetailUseCase();

export const threadRouter = router({
  deleteThread: protectedProcedure
    .input(ThreadSchema.pick({ id: true }))
    .mutation(async ({ ctx, input }) => {
      // 権限チェック
      const isOwned = await threadRepository.isOwnedByUser(input.id, ctx.currentUser.id);
      if (!isOwned) {
        throw new Error("権限がありません");
      }
      
      await threadRepository.delete(input.id);
      return { success: true };
    }),
  listThreadsByCurrentUser: protectedProcedure
    .input(
      z.object({
        searchQuery: z.string().trim().optional(),
        cursor: z.string().optional(),
        limit: z.number().min(1).max(100).optional(),
        sort: z.object({
          type: z.union([z.literal("createdAt"), z.literal("lastPostedAt")]),
          direction: z.union([z.literal("asc"), z.literal("desc")]),
        }),
      })
    )
    .query(async ({ input, ctx }) => {
      return await listThreadsUseCase.execute({
        userId: ctx.currentUser.id,
        searchQuery: input.searchQuery,
        cursor: input.cursor,
        limit: input.limit || 10,
        sort: input.sort,
        inCludePrivate: true,
      });
    }),

  listThreadsByUserId: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        searchQuery: z.string().trim().optional(),
        cursor: z.string().optional(),
        limit: z.number().min(1).max(100).optional(),
        sort: z.object({
          type: z.union([z.literal("createdAt"), z.literal("lastPostedAt")]),
          direction: z.union([z.literal("asc"), z.literal("desc")]),
        }),
      })
    )
    .query(async ({ input }) => {
      return await listThreadsUseCase.execute({
        userId: input?.userId,
        searchQuery: input.searchQuery,
        cursor: input.cursor,
        limit: input.limit || 10,
        sort: input.sort,
        inCludePrivate: false,
      });
    }),

  getThreadInfo: protectedProcedure
    .input(ThreadSchema.pick({ id: true }))
    .query(async ({ input }) => {
      return await getThreadInfoUseCase.execute({ id: input.id });
    }),

  getPublicThreadInfo: publicProcedure
    .input(ThreadSchema.pick({ id: true }))
    .query(async ({ input }) => {
      const thread = await threadRepository.findById(input.id);
      
      // 公開されていない場合はnullを返す
      if (!thread || !thread.isPublic) {
        return null;
      }
      
      return thread;
    }),

  updateThreadInfo: protectedProcedure
    .input(ThreadSchema.pick({ id: true, title: true }))
    .mutation(async ({ ctx, input }) => {
      // 権限チェック
      const isOwned = await threadRepository.isOwnedByUser(input.id, ctx.currentUser.id);
      if (!isOwned) {
        throw new Error("権限がありません");
      }
      
      return await threadRepository.update({
        id: input.id,
        title: input.title,
      });
    }),

  updateThreadPublicStatus: protectedProcedure
    .input(
      z.object({
        id: ThreadSchema.shape.id,
        isPublic: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // 権限チェック
      const isOwned = await threadRepository.isOwnedByUser(input.id, ctx.currentUser.id);
      if (!isOwned) {
        throw new Error("権限がありません");
      }
      
      return await threadRepository.update({
        id: input.id,
        isPublic: input.isPublic,
      });
    }),

  updateThreadClosedStatus: protectedProcedure
    .input(
      z.object({
        id: ThreadSchema.shape.id,
        isClosed: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // 権限チェック
      const isOwned = await threadRepository.isOwnedByUser(input.id, ctx.currentUser.id);
      if (!isOwned) {
        throw new Error("権限がありません");
      }
      
      return await threadRepository.update({
        id: input.id,
        isClosed: input.isClosed,
      });
    }),

  updateThreadOgpInfo: protectedProcedure
    .input(
      z.object({
        id: ThreadSchema.shape.id,
        ogpTitle: z.string().nullable(),
        ogpDescription: z.string().nullable(),
        ogpImagePath: z.string().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // 権限チェック
      const isOwned = await threadRepository.isOwnedByUser(input.id, ctx.currentUser.id);
      if (!isOwned) {
        throw new Error("権限がありません");
      }
      
      return await threadRepository.update({
        id: input.id,
        ogpTitle: input.ogpTitle,
        ogpDescription: input.ogpDescription,
        ogpImagePath: input.ogpImagePath,
      });
    }),

  getThreadWithPosts: protectedProcedure
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

  getPublicThreadForOgp: publicProcedure
    .input(
      z.object({
        id: ThreadSchema.shape.id,
      })
    )
    .query(async ({ input }) => {
      const thread = await threadRepository.findById(input.id);
      
      // 公開されていない場合はnullを返す
      if (!thread || !thread.isPublic) {
        return { threadWithPost: null };
      }

      const threadWithPost = await threadRepository.findByIdWithPosts(input.id, false);
      
      return { threadWithPost };
    }),

  getPublicThreadWithPosts: publicProcedure
    .input(
      z.object({
        id: ThreadSchema.shape.id,
      })
    )
    .query(async ({ input }) => {
      const thread = await threadRepository.findById(input.id);
      
      // 公開されていない場合はnullを返す
      if (!thread || !thread.isPublic) {
        return { threadWithPosts: null };
      }
      
      const threadWithPosts = await threadRepository.findByIdWithPosts(input.id, false);
      
      return { threadWithPosts };
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
