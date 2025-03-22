import { prisma } from "@/prisma";
import type { User } from "@prisma/client";
import { Prisma } from "@prisma/client";

type Args = {
  userId: User["id"];
  searchQuery?: string;
  cursor?: string;
  limit?: number;
  inCludePrivate?: boolean;
  sort: {
    type: "createdAt" | "lastPostedAt";
    direction: "asc" | "desc";
  };
};

export class ListThreadsUseCase {
  async execute(args: Args) {
    // whereの条件を生成
    const where = this.generateWhere(args);
    const orderBy = this.generateOrderBy(args);
    const select = this.generateSelect();

    // 検索条件に一致するスレッドの総数を取得
    const totalCount = await prisma.thread.count({ where });

    const { limit = 10 } = args;

    // 検索条件に一致するスレッドを取得
    const threads = await prisma.thread.findMany({
      where,
      select,
      orderBy,
      take: limit + 1, // 次のページがあるか確認するために 1 つ多く取得
      cursor: args.cursor ? { id: args.cursor } : undefined,
    });

    const hasNextPage = threads.length > limit;

    return {
      threads: hasNextPage ? threads.slice(0, limit) : threads, // 余分に取得した 1 件を削除
      nextCursor: hasNextPage ? threads[limit].id : null,
      totalCount,
    };
  }

  /**
   * スレッドの検索条件を生成する
   * @param args 検索条件のパラメータ
   * @returns Prisma の検索条件オブジェクト
   */
  private generateWhere(args: Args): Prisma.ThreadWhereInput {
    // 基本的な検索条件
    const baseWhere: Prisma.ThreadWhereInput = {
      userId: args.userId,
      ...(args.inCludePrivate ? {} : { isPublic: true }),
    };

    if (!args.searchQuery) {
      return baseWhere;
    }

    return {
      ...baseWhere,
      OR: [
        // タイトルで検索
        {
          title: {
            contains: args.searchQuery,
            mode: "insensitive" as const, // 大文字小文字を区別しない
          },
        },
        // 投稿の本文で検索
        {
          posts: {
            some: {
              body: {
                contains: args.searchQuery,
                mode: "insensitive" as const,
              },
            },
          },
        },
      ],
    };
  }

  private generateOrderBy(args: Args): Prisma.ThreadOrderByWithRelationInput {
    return {
      [args.sort.type]: args.sort.direction,
    };
  }

  private generateSelect(): Prisma.ThreadSelect {
    return {
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
    };
  }
}
