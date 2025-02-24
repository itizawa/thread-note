import { prisma } from "@/prisma";
import type { Post, User } from "@prisma/client";

export class GenerateReplyPostsUseCase {
  async execute({
    postId,
    userId,
  }: {
    postId: Post["id"];
    userId: User["id"];
  }) {
    const postWithChildrenPosts = await prisma.post.findFirst({
      where: {
        id: postId,
        userId,
      },
      include: {
        children: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!postWithChildrenPosts) {
      throw new Error("Post not found");
    }

    const text = [
      postWithChildrenPosts.body,
      ...postWithChildrenPosts.children.map((p) => p.body),
    ].join("\n");
    const lastChild =
      postWithChildrenPosts.children[postWithChildrenPosts.children.length - 1];

    // トークンの節約のためにコンテキストは5000文字とする
    const truncateText = text.slice(-5000);

    console.log(text, lastChild, truncateText);

    return { postWithChildrenPosts, text };
  }
}
