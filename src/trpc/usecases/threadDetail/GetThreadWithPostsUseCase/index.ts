import { prisma } from "@/prisma";
import type { Thread } from "@prisma/client";

export class GetThreadWithPostsUseCase {
  async execute({
    id,
    inCludeIsArchived,
  }: {
    id: Thread["id"];
    inCludeIsArchived: boolean;
  }) {
    const threadWithPosts = await prisma.thread.findFirst({
      where: {
        id,
      },
      include: {
        posts: {
          where: {
            isArchived: inCludeIsArchived ? undefined : false,
          },
          orderBy: {
            createdAt: "asc",
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
        },
      },
    });

    return { threadWithPosts };
  }
}
