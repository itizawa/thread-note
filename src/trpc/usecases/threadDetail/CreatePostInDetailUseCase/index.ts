import { prisma } from "@/prisma";
import type { Post, Thread, User } from "@prisma/client";

export class CreatePostInDetailUseCase {
  async execute({
    threadId,
    body,
    currentUser,
  }: {
    threadId: Thread["id"];
    body: Post["body"];
    currentUser: User;
  }) {
    const createdPost = await prisma.post.create({
      data: {
        body,
        threadId,
        userId: currentUser.id,
      },
    });

    return { createdPost };
  }
}
