"use server";

import { AppRouter } from "@/trpc/routers/_app";
import { trpc } from "@/trpc/server";
import { inferRouterInputs } from "@trpc/server";

export const getCurrentUser = async () => {
  return await trpc.user.getCurrentUser();
};

export const updateUserName = async ({
  name,
}: inferRouterInputs<AppRouter>["user"]["updateUserName"]) => {
  return await trpc.user.updateUserName({
    name,
  });
};
