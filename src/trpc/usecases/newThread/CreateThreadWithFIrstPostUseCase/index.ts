import { prisma } from "@/prisma";
import type { Post, Thread, User } from "@prisma/client";

export class CreateThreadWithFIrstPostUseCase {
  async execute({
    postBody,
    currentUser,
  }: {
    postBody: Post["body"];
    currentUser: User;
  }): Promise<{ thread: Thread }> {
    const thread = await prisma.thread.create({
      data: {
        posts: {
          create: {
            body: postBody,
            userId: currentUser.id,
          },
        },
        userId: currentUser.id,
      },
    });

    return { thread };
  }
}
