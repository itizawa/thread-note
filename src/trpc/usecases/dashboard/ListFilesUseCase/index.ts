import { prisma } from "@/prisma";

export class ListFilesUseCase {
  async execute({
    userId,
    cursor,
    limit = 10,
    sort,
  }: {
    userId: string;
    cursor?: string;
    limit?: number;
    sort: {
      type: "createdAt" | "size";
      direction: "asc" | "desc";
    };
  }) {
    // 検索条件に一致するファイルの総数を取得
    const totalCount = await prisma.file.count({
      where: {
        userId,
      },
    });

    // 検索条件に一致するファイルを取得
    const files = await prisma.file.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        name: true,
        size: true,
        path: true,
        createdAt: true,
      },
      orderBy: {
        [sort.type]: sort.direction,
      },
      take: limit + 1, // 次のページがあるか確認するために 1 つ多く取得
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}), // カーソルがある場合はスキップ
    });

    const hasNextPage = files.length > limit;

    return {
      files: files.slice(0, limit), // 余分に取得した 1 件を削除
      nextCursor: hasNextPage ? files[files.length - 1].id : null,
      totalCount,
    };
  }
}
