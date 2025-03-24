"use server";

import { urls } from "@/shared/consts/urls";
import { AppRouter } from "@/trpc/routers/_app";
import { trpc } from "@/trpc/server";
import { inferRouterInputs } from "@trpc/server";
import { revalidatePath } from "next/cache";

export const getCurrentUser = async () => {
  return await trpc.user.getCurrentUser();
};

export const updateUserSettings = async ({
  name,
  image,
  description,
}: inferRouterInputs<AppRouter>["user"]["updateUserSettings"]) => {
  const result = await trpc.user.updateUserSettings({
    name,
    image,
    description,
  });

  // ダッシュボード関連のパスを再検証して、getCurrentUserのデータを再取得
  revalidatePath(urls.dashboard);

  return result;
};
