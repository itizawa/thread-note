import { prisma } from "@/prisma";
import type { Post, Thread, User } from "@prisma/client";

export class CreateThreadWithFIrstPostUseCase {
  async execute({
    postBody,
    title,
    emojiIcon,
    currentUser,
  }: {
    postBody?: Post["body"];
    title?: Thread["title"];
    emojiIcon?: Thread["emojiIcon"];
    currentUser: User;
  }): Promise<{ thread: Thread }> {
    const thread = await prisma.thread.create({
      data: {
        title,
        emojiIcon,
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
