import { prisma } from "@/prisma";
import type { Post, Thread, User } from "@prisma/client";

export class CreateThreadWithFIrstPostUseCase {
  async execute({
    postBody,
    title,
    currentUser,
    emoji,
  }: {
    postBody?: Post["body"];
    title?: Thread["title"];
    currentUser: User;
    emoji?: Thread["emoji"];
  }): Promise<{ thread: Thread }> {
    const thread = await prisma.thread.create({
      data: {
        title,
        emoji,
        posts: {
          create: postBody
            ? {
                body: postBody,
                userId: currentUser.id,
              }
            : [],
        },
        userId: currentUser.id,
      },
    });

    return { thread };
  }
}
