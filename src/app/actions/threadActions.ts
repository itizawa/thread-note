"use server";

import { urls } from "@/consts/urls";
import { trpc } from "@/trpc/server";
import { redirect } from "next/navigation";

export const createThreadWithFirstPost = async (body: string) => {
  const { thread } = await trpc.thread.createThreadWithFirstPost({ body });

  redirect(urls.dashboardThreadDetails(thread.id));
};
