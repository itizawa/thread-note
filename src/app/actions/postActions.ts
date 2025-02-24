"use server";

import { AppRouter } from "@/trpc/routers/_app";
import { trpc } from "@/trpc/server";
import { inferRouterInputs } from "@trpc/server";

export const updatePostBody = async (
  args: inferRouterInputs<AppRouter>["post"]["updatePostBody"]
) => {
  await trpc.post.updatePostBody(args);
};

export const changeToArchive = async (
  args: inferRouterInputs<AppRouter>["post"]["changeToArchive"]
) => {
  await trpc.post.changeToArchive(args);
};

export const generateReplyPost = async (
  args: inferRouterInputs<AppRouter>["post"]["generateReplyPost"]
) => {
  await trpc.post.generateReplyPost(args);
};
