import { prisma } from "@/prisma";
import { del } from "@vercel/blob";
import { z } from "zod";
import { protectedProcedure, router } from "../init";

export const fileRouter = router({
  /**
   * ログインユーザーのファイル一覧を取得する
   */
  getFiles: protectedProcedure.query(async ({ ctx }) => {
    return await prisma.file.findMany({
      where: {
        userId: ctx.currentUser.id,
      },
      orderBy: {
        createdAt: "desc",
      },
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
});
