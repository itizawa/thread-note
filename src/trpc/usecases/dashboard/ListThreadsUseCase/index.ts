import { prisma } from "@/prisma";
import type { User } from "@prisma/client";

export class ListThreadsUseCase {
  async execute({ userId }: { userId: User["id"] }) {
    const threads = await prisma.thread.findMany({
      where: {
        userId,
      },
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
    });

    return threads;
  }
}
