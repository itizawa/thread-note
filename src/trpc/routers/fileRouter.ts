import { prisma } from "@/prisma";
import { del } from "@vercel/blob";
import { z } from "zod";
import { protectedProcedure, router } from "../init";
import { ListFilesUseCase } from "../usecases/dashboard/ListFilesUseCase";

export const fileRouter = router({
  /**
   * ログインユーザーのファイル一覧を取得する
   */
  listFiles: protectedProcedure
    .input(
      z.object({
        cursor: z.string().optional(),
        limit: z.number().min(1).max(20).optional(),
        sort: z.object({
          type: z.union([z.literal("createdAt"), z.literal("size")]),
          direction: z.union([z.literal("asc"), z.literal("desc")]),
        }),
      })
    )
    .query(async ({ ctx, input }) => {
      const listFilesUseCase = new ListFilesUseCase();
      return await listFilesUseCase.execute({
        userId: ctx.currentUser.id,
        cursor: input.cursor,
        limit: input.limit,
        sort: input.sort,
      });
    }),

  /**
   * ファイルを削除する
   */
  deleteFile: protectedProcedure
    .input(
      z.object({
        fileId: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const file = await prisma.file.findUnique({
        where: {
          userId: ctx.currentUser.id,
          id: input.fileId,
        },
      });

      if (!file) {
        return null;
      }

      await del(file.path);

      return await prisma.file.delete({
        where: {
          id: input.fileId,
        },
      });
    }),

  /**
   * ユーザーの現在のファイル使用量を取得する
   */
  getCurrentUsage: protectedProcedure.query(async ({ ctx }) => {
    const usedStorage = await prisma.file.aggregate({
      where: { userId: ctx.currentUser.id },
      _sum: { size: true },
    });

    const currentUsage = usedStorage._sum.size ?? 0;

    return {
      currentUsage,
    };
  }),
});
