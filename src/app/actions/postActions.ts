"use server";

import { AppRouter } from "@/trpc/routers/_app";
import { trpc } from "@/trpc/server";
import { inferRouterInputs } from "@trpc/server";

export const updatePostBody = async (
  args: inferRouterInputs<AppRouter>["post"]["updatePostBody"]
) => {
  await trpc.post.updatePostBody(args);
};
