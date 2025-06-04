import { prisma } from "@/prisma";
import { z } from "zod";
import { protectedProcedure, router } from "../init";

export const tokenRouter = router({
  /**
   * ログインユーザーのトークン使用履歴を取得する（常に作成日の降順でソート）
   */
  listTokenUsages: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor } = input;
      const userId = ctx.currentUser.id;

      const items = await prisma.lLMTokenUsage.findMany({
        take: limit + 1,
        where: { userId },
        orderBy: { createdAt: "desc" },
        cursor: cursor ? { id: cursor } : undefined,
      });

      let nextCursor: typeof cursor = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem?.id;
      }

      return {
        tokenUsages: items,
        nextCursor,
      };
    }),

  /**
   * ユーザーの現在のトークン使用量を取得する
   */
  getCurrentUsage: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.currentUser.id;

    // 現在月の最初の日
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    // 現在月の最後の日
    const endOfMonth = new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);

    // 月間の合計トークン使用量を集計
    const monthlyUsage = await prisma.lLMTokenUsage.aggregate({
      where: {
        userId,
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      _sum: {
        totalTokens: true,
      },
    });

    // 全期間の合計トークン使用量を集計
    const totalUsage = await prisma.lLMTokenUsage.aggregate({
      where: {
        userId,
      },
      _sum: {
        totalTokens: true,
      },
    });

    return {
      monthlyUsage: monthlyUsage._sum.totalTokens || 0,
      totalUsage: totalUsage._sum.totalTokens || 0,
    };
  }),
});
