"use server";

import { AppRouter } from "@/trpc/routers/_app";
import { trpc } from "@/trpc/server";
import { inferRouterInputs } from "@trpc/server";

export const getCurrentUser = async (
  args: inferRouterInputs<AppRouter>["user"]["getCurrentUser"]
) => {
  return await trpc.user.getCurrentUser(args);
};
