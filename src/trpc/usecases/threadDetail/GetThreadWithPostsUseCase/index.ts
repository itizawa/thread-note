import { prisma } from "@/prisma";
import type { Thread } from "@prisma/client";

export class GetThreadWithPostsUseCase {
  async execute({ id }: { id: Thread["id"] }) {
    const threadWithPosts = await prisma.thread.findFirst({
      where: {
        id,
      },
      include: {
        posts: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    return { threadWithPosts };
  }
}
