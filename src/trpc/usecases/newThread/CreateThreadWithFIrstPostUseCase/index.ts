import { prisma } from "@/prisma";
import type { Post, Thread, User } from "@prisma/client";

export class CreateThreadWithFIrstPostUseCase {
  async execute({
    postBody,
    title,
    tagIds,
    currentUser,
  }: {
    postBody?: Post["body"];
    title?: Thread["title"];
    tagIds?: string[];
    currentUser: User;
  }): Promise<{ thread: Thread }> {
    const thread = await prisma.thread.create({
      data: {
        title,
        posts: {
          create: postBody
            ? {
                body: postBody,
                userId: currentUser.id,
              }
            : [],
        },
        userId: currentUser.id,
        tags: tagIds?.length
          ? {
              create: tagIds.map((tagId) => ({
                tagId,
              })),
            }
          : undefined,
      },
    });

    return { thread };
  }
}
