import { z } from 'zod';
import { protectedProcedure, publicProcedure, router } from '../init';
import { TRPCError } from '@trpc/server';
import { prisma } from '@/prisma';

export const tagRouter = router({
  getTagsByThreadId: publicProcedure
    .input(z.object({ threadId: z.string() }))
    .query(async ({ input }) => {
      const threadTags = await prisma.threadTag.findMany({
        where: { threadId: input.threadId },
        include: { tag: true },
        orderBy: { tag: { name: 'asc' } },
      });

      return threadTags.map((threadTag) => threadTag.tag);
    }),

  searchTags: protectedProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ input }) => {
      const tags = await prisma.tag.findMany({
        where: {
          name: {
            contains: input.query,
            mode: 'insensitive',
          },
        },
        orderBy: { name: 'asc' },
        take: 10,
      });

      return tags;
    }),

  createTag: protectedProcedure
    .input(z.object({ name: z.string().min(1).max(50) }))
    .mutation(async ({ input }) => {
      try {
        const tag = await prisma.tag.create({
          data: { name: input.name },
        });
        return tag;
      } catch {
        // 既にタグが存在する場合は既存のものを返す
        const existingTag = await prisma.tag.findUnique({
          where: { name: input.name },
        });
        if (existingTag) {
          return existingTag;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create tag',
        });
      }
    }),

  addTagToThread: protectedProcedure
    .input(z.object({ threadId: z.string(), tagId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const thread = await prisma.thread.findUnique({
        where: { id: input.threadId },
      });

      if (!thread) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Thread not found',
        });
      }

      if (thread.userId !== ctx.currentUser.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You are not authorized to edit this thread',
        });
      }

      try {
        const threadTag = await prisma.threadTag.create({
          data: {
            threadId: input.threadId,
            tagId: input.tagId,
          },
          include: { tag: true },
        });
        return threadTag.tag;
      } catch {
        // 既に関連付けがある場合はエラーをスロー
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Tag already added to thread',
        });
      }
    }),

  removeTagFromThread: protectedProcedure
    .input(z.object({ threadId: z.string(), tagId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const thread = await prisma.thread.findUnique({
        where: { id: input.threadId },
      });

      if (!thread) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Thread not found',
        });
      }

      if (thread.userId !== ctx.currentUser.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You are not authorized to edit this thread',
        });
      }

      await prisma.threadTag.delete({
        where: {
          threadId_tagId: {
            threadId: input.threadId,
            tagId: input.tagId,
          },
        },
      });

      return { success: true };
    }),

  getThreadsByTag: publicProcedure
    .input(
      z.object({
        tagName: z.string(),
        limit: z.number().min(1).max(50).default(20),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ input }) => {
      const tag = await prisma.tag.findUnique({
        where: { name: input.tagName },
      });

      if (!tag) {
        return { threads: [], totalCount: 0 };
      }

      const [threads, totalCount] = await Promise.all([
        prisma.thread.findMany({
          where: {
            tags: {
              some: {
                tagId: tag.id,
              },
            },
            isPublic: true,
          },
          include: {
            user: true,
            tags: {
              include: { tag: true },
            },
          },
          orderBy: { lastPostedAt: 'desc' },
          take: input.limit,
          skip: input.offset,
        }),
        prisma.thread.count({
          where: {
            tags: {
              some: {
                tagId: tag.id,
              },
            },
            isPublic: true,
          },
        }),
      ]);

      return {
        threads: threads.map((thread) => ({
          ...thread,
          tags: thread.tags.map((threadTag) => threadTag.tag),
        })),
        totalCount,
      };
    }),
});