import { prisma } from "@/prisma";
import type { User } from "@prisma/client";

export class ListThreadsUseCase {
  async execute({
    userId,
    page,
    cursor,
    limit = 10,
  }: {
    userId: User["id"];
    page?: number;
    cursor?: string;
    limit?: number;
  }) {
    const where = {
      userId,
    };

    const totalCount = await prisma.thread.count({
      where,
    });
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
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit + 1, // 次のページがあるか確認するために 1 つ多く取得
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}), // カーソルがある場合はスキップ
      ...(page ? { take: limit, skip: limit * (page - 1) } : undefined), // ページ指定がある場合はページング
    });

    const hasNextPage = threads.length > limit;

    return {
      threads: threads.slice(0, limit), // 余分に取得した 1 件を削除
      nextCursor: hasNextPage ? threads[threads.length - 1].id : null,
      totalCount,
    };
  }
}
