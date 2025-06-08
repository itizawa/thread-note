import { prisma } from "@/prisma";
import {
  PostSchema,
  ThreadSchema,
  ThreadStatusSchema,
} from "@/types/src/domains";
import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../init";
import { ListThreadsUseCase } from "../usecases/dashboard/ListThreadsUseCase";
import { CreateThreadWithFIrstPostUseCase } from "../usecases/newThread/CreateThreadWithFIrstPostUseCase";
import { CreatePostInDetailUseCase } from "../usecases/threadDetail/CreatePostInDetailUseCase";
import { GetThreadWithPostsUseCase } from "../usecases/threadDetail/GetThreadWithPostsUseCase";

const createThreadWithFIrstPostUseCase = new CreateThreadWithFIrstPostUseCase();
const getThreadWithPostsUseCase = new GetThreadWithPostsUseCase();
const listThreadsUseCase = new ListThreadsUseCase();
const createPostInDetailUseCase = new CreatePostInDetailUseCase();

export const threadRouter = router({
  deleteThread: protectedProcedure
    .input(ThreadSchema.pick({ id: true }))
    .mutation(async ({ ctx, input }) => {
      return await prisma.thread.delete({
        where: {
          id: input.id,
          userId: ctx.currentUser.id,
        },
      });
    }),
  listThreadsByCurrentUser: protectedProcedure
    .input(
      z.object({
        searchQuery: z.string().trim().optional(),
        cursor: z.string().optional(),
        limit: z.number().min(1).max(100).optional(),
        excludeClosed: z.boolean().default(false),
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
        excludeClosed: input.excludeClosed,
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
        excludeClosed: false,
      });
    }),

  getThreadInfo: protectedProcedure
    .input(ThreadSchema.pick({ id: true }))
    .query(async ({ input }) => {
      // GetThreadInfoUseCaseを使用する代わりに、直接Prismaを使用して必要なフィールドを取得
      const thread = await prisma.thread.findUnique({
        where: {
          id: input.id,
        },
        select: {
          id: true,
          title: true,
          isPublic: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          userId: true,
          ogpTitle: true,
          ogpDescription: true,
          ogpImagePath: true,
        },
      });

      return thread;
    }),

  getPublicThreadInfo: publicProcedure
    .input(ThreadSchema.pick({ id: true }))
    .query(async ({ input }) => {
      const thread = await prisma.thread.findFirst({
        where: {
          id: input.id,
          isPublic: true,
        },
        select: {
          id: true,
          title: true,
          isPublic: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          userId: true,
          ogpTitle: true,
          ogpDescription: true,
        },
      });

      return thread;
    }),

  updateThreadInfo: protectedProcedure
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

  updateThreadPublicStatus: protectedProcedure
    .input(
      z.object({
        id: ThreadSchema.shape.id,
        isPublic: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await prisma.thread.update({
        where: {
          id: input.id,
          userId: ctx.currentUser?.id,
        },
        data: {
          isPublic: input.isPublic,
        },
      });
    }),

  updateThreadStatus: protectedProcedure
    .input(
      z.object({
        id: ThreadSchema.shape.id,
        status: ThreadStatusSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await prisma.thread.update({
        where: {
          id: input.id,
          userId: ctx.currentUser?.id,
        },
        data: {
          status: input.status,
        },
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
      return await prisma.thread.update({
        where: {
          id: input.id,
          userId: ctx.currentUser.id,
        },
        data: {
          ogpTitle: input.ogpTitle,
          ogpDescription: input.ogpDescription,
          ogpImagePath: input.ogpImagePath,
        },
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
      const threadWithPost = await prisma.thread.findFirst({
        where: {
          id: input.id,
          isPublic: true,
        },
        select: {
          id: true,
          title: true,
          ogpTitle: true,
          ogpDescription: true,
          ogpImagePath: true,
          posts: {
            where: {
              isArchived: false,
              parentId: null,
            },
            take: 1,
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      });

      return { threadWithPost };
    }),

  getPublicThreadWithPosts: publicProcedure
    .input(
      z.object({
        id: ThreadSchema.shape.id,
      })
    )
    .query(async ({ input }) => {
      const threadWithPosts = await prisma.thread.findFirst({
        where: {
          id: input.id,
          isPublic: true,
        },
        include: {
          posts: {
            where: {
              isArchived: false,
              parentId: null,
            },
            orderBy: {
              createdAt: "asc",
            },
            include: {
              children: {
                where: {
                  isArchived: false,
                },
                include: {
                  user: {
                    select: {
                      id: true,
                      name: true,
                      image: true,
                    },
                  },
                },
                orderBy: {
                  createdAt: "asc",
                },
              },
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
          },
        },
      });

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

  countThreads: publicProcedure.query(async () => {
    const count = await prisma.thread.count();

    return count;
  }),
});
