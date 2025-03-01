import { prisma } from "@/prisma";
import type { User } from "@prisma/client";

export class SearchThreadsUseCase {
  async execute({
    userId,
    searchQuery,
    cursor,
    limit = 10,
  }: {
    userId: User["id"];
    searchQuery: string;
    cursor?: string;
    limit?: number;
  }) {
    // 検索クエリが空の場合は空の結果を返す
    if (!searchQuery.trim()) {
      return {
        threads: [],
        nextCursor: null,
        totalCount: 0,
      };
    }

    // 基本的な検索条件
    const where = {
      userId,
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

    // 検索条件に一致するスレッドの総数を取得
    const totalCount = await prisma.thread.count({ where });

    // 検索条件に一致するスレッドを取得
    const threads = await prisma.thread.findMany({
      where,
      select: {
        id: true,
        title: true,
        createdAt: true,
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
        // 検索結果のハイライト用に最初に一致した投稿を取得
        posts: {
          where: {
            body: {
              contains: searchQuery,
              mode: "insensitive",
            },
          },
          select: {
            body: true,
          },
          take: 1,
        },
      },
      orderBy: {
        createdAt: "desc",
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
}
