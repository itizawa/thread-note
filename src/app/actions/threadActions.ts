"use server";

import { trpc } from "@/trpc/server";

export const createThreadWithFirstPost = async (body: string) => {
  return await trpc.thread.createThreadWithFirstPost({ body });
};

export const createPostInThread = async (args: {
  body: string;
  threadId: string;
}) => {
  const { createdPost } = await trpc.thread.createPostInThread(args);

  return createdPost;
};

export const updateThreadInfo = async (args: { id: string; title: string }) => {
  await trpc.thread.updateThreadInfo(args);
};
