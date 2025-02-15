"use server";

import { urls } from "@/consts/urls";
import { trpc } from "@/trpc/server";
import { redirect } from "next/navigation";

export const createThreadWithFirstPost = async (body: string) => {
  const { thread } = await trpc.thread.createThreadWithFirstPost({ body });

  redirect(urls.dashboardThreadDetails(thread.id));
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
