import { prisma } from "@/prisma";
import type { Thread } from "@prisma/client";

const selectUserDateObject = {
  select: {
    id: true,
    name: true,
    image: true,
  },
};

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
            parentId: null,
          },
          orderBy: {
            createdAt: "asc",
          },
          include: {
            children: {
              include: {
                user: selectUserDateObject,
              },
              orderBy: {
                createdAt: "asc",
              },
            },
            user: selectUserDateObject,
          },
        },
      },
    });

    return { threadWithPosts };
  }
}
