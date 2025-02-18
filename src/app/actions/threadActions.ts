"use server";

import { AppRouter } from "@/trpc/routers/_app";
import { trpc } from "@/trpc/server";
import { inferRouterInputs } from "@trpc/server";

export const createThreadWithFirstPost = async (body: string) => {
  return await trpc.thread.createThreadWithFirstPost({ body });
};

export const createPostInThread = async (
  args: inferRouterInputs<AppRouter>["thread"]["createPostInThread"]
) => {
  const { createdPost } = await trpc.thread.createPostInThread(args);

  return createdPost;
};

export const updateThreadInfo = async (args: { id: string; title: string }) => {
  await trpc.thread.updateThreadInfo(args);
};
