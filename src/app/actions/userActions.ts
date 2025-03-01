"use server";

import { urls } from "@/consts/urls";
import { AppRouter } from "@/trpc/routers/_app";
import { trpc } from "@/trpc/server";
import { inferRouterInputs } from "@trpc/server";
import { revalidatePath } from "next/cache";

export const getCurrentUser = async () => {
  return await trpc.user.getCurrentUser();
};

export const updateUserName = async ({
  name,
}: inferRouterInputs<AppRouter>["user"]["updateUserName"]) => {
  const result = await trpc.user.updateUserName({
    name,
  });

  // ダッシュボード関連のパスを再検証して、getCurrentUserのデータを再取得
  revalidatePath(urls.dashboard);

  return result;
};
