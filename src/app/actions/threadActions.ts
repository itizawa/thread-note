"use server";

import { trpc } from "@/trpc/server";

export const createThreadWithFirstPost = async (body: string) => {
  return await trpc.thread.createThreadWithFirstPost({ body });
};
