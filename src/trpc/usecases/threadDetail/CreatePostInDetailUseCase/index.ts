import { prisma } from "@/prisma";
import type { Post, Thread, User } from "@prisma/client";

export class CreatePostInDetailUseCase {
  async execute({
    currentUser,
    body,
    threadId,
    parentId,
  }: {
    currentUser: User;
    threadId: Thread["id"];
    body: Post["body"];
    parentId?: Post["id"];
  }) {
    const createdPost = await prisma.post.create({
      data: {
        body,
        threadId,
        userId: currentUser.id,
        parentId: parentId,
      },
    });

    await prisma.thread.update({
      where: { id: threadId },
      data: {
        lastPostedAt: new Date(),
      },
    });

    return { createdPost };
  }
}
