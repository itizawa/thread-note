import { prisma } from "@/prisma";
import type { Post, User } from "@prisma/client";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});

export class GenerateReplyPostsUseCase {
  async execute({
    postId,
    userId,
    type,
  }: {
    postId: Post["id"];
    userId: User["id"];
    type: "agreement" | "survey" | "feedback";
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

    const lastChild = postWithChildrenPosts.children.pop();
    const text = [
      postWithChildrenPosts.body,
      ...postWithChildrenPosts.children.map((p) => p.body),
    ].join("\n");

    // トークンの節約のためにコンテキストは5000文字とする
    const truncateText = text.slice(-5000);
    const chatCompletion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: this.generateSystemOrder(type),
        },
        {
          role: "user",
          content: `以下のテキストについて返信を生成してください。\n\n${
            lastChild
              ? `## 内容\n${lastChild.body}\n\n## コンテキスト\n${truncateText}`
              : `## 内容\n${postWithChildrenPosts.body}`
          }`,
        },
      ],
      temperature: 0.7,
      model: "gpt-4o-mini",
    });
    const replyBody = chatCompletion.choices[0].message.content;
    const botUserId = this.getBotId(type);

    if (replyBody) {
      await prisma.post.create({
        data: {
          body: replyBody,
          parentId: postId,
          threadId: postWithChildrenPosts.threadId,
          userId: botUserId,
        },
      });
    }

    return { postWithChildrenPosts, text };
  }

  private generateSystemOrder(type: "agreement" | "survey" | "feedback") {
    switch (type) {
      case "agreement":
        return "あなたは高度なAIアシスタントです。この時良い点について賞賛し、伸ばした方が良い点があれば指摘してください。また200文字以内で返信してください。";
      case "survey":
        return "あなたはユーザーからの調査に基づいて適切な情報を提供するAIアシスタントです。インターネットから情報を検索しユーザーに提示してください。可能であれば情報元のurlを提示してください。";
      case "feedback":
        return "あなたはユーザーのフィードバックに基づいて返信を生成するAIアシスタントです。少しでも疑問に思うことがあればユーザーに指摘し新たな示唆を与えてください。";
      default: {
        const exhaustiveCheck: never = type;
        throw new Error(`${exhaustiveCheck} is invalid type`);
      }
    }
  }

  private getBotId(type: "agreement" | "survey" | "feedback"): string {
    switch (type) {
      case "agreement":
        return "agreement";
      case "survey":
        return "survey";
      case "feedback":
        return "feedback";
      default:
        throw new Error(`${type} is an invalid type`);
    }
  }
}
