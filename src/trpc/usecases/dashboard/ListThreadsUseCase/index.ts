import { prisma } from "@/prisma";
import type { User } from "@prisma/client";
import { Prisma } from "@prisma/client";

export class ListThreadsUseCase {
  async execute({
    userId,
    searchQuery,
    cursor,
    limit = 10,
    sort,
  }: {
    userId: User["id"];
    searchQuery?: string;
    cursor?: string;
    limit?: number;
    sort: {
      type: "createdAt" | "lastPostedAt";
      direction: "asc" | "desc";
    };
  }) {
    // whereの条件を生成
    const where = this.generateWhere(userId, searchQuery);

    // 検索条件に一致するスレッドの総数を取得
    const totalCount = await prisma.thread.count({ where });

    // 検索条件に一致するスレッドを取得
    const threads = await prisma.thread.findMany({
      where,
      select: {
        id: true,
        title: true,
        createdAt: true,
        lastPostedAt: true,
        _count: {
          select: {
            posts: {
              where: {
                isArchived: false,
              },
            },
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
      orderBy: {
        [sort.type]: sort.direction,
      },
      take: limit + 1, // 次のページがあるか確認するために 1 つ多く取得
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}), // カーソルがある場合はスキップ
    });

    const hasNextPage = threads.length > limit;

    return {
      threads: threads.slice(0, limit), // 余分に取得した 1 件を削除
      nextCursor: hasNextPage ? threads[threads.length - 1].id : null,
      totalCount,
    };
  }

  /**
   * 検索条件を生成するプライベートメソッド
   * @param userId ユーザーID
   * @param searchQuery 検索クエリ（オプション）
   * @returns 検索条件オブジェクト
   */
  private generateWhere(
    userId: User["id"],
    searchQuery?: string
  ): Prisma.ThreadWhereInput {
    // 基本的な検索条件
    const baseWhere: Prisma.ThreadWhereInput = {
      userId,
    };

    if (!searchQuery) {
      return baseWhere;
    }

    return {
      ...baseWhere,
      OR: [
        // タイトルで検索
        {
          title: {
            contains: searchQuery,
            mode: "insensitive" as const, // 大文字小文字を区別しない
          },
        },
        // 投稿の本文で検索
        {
          posts: {
            some: {
              body: {
                contains: searchQuery,
                mode: "insensitive" as const,
              },
            },
          },
        },
      ],
    };
  }
}
