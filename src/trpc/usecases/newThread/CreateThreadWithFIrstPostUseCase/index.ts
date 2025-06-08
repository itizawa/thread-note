import type { Post, PrismaClient, Thread, User } from "@prisma/client";

export class CreateThreadWithFIrstPostUseCase {
  constructor(private prisma: PrismaClient) {}
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
    const now = new Date();

    const thread = await this.prisma.thread.create({
      data: {
        title,
        userId: currentUser.id,
        lastPostedAt: postBody ? now : undefined,
        posts: postBody
          ? {
              create: {
                body: postBody,
                userId: currentUser.id,
              },
            }
          : undefined,
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
