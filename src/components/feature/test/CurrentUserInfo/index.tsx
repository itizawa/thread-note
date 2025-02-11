"use client";

import { trpc } from "@/trpc/client";

export function CurrentUserInfo() {
  const [{ user }] = trpc.currentUser.useSuspenseQuery();

  if (!user) {
    return <div>ユーザー情報が見つかりません。</div>;
  }

  return <div>ログイン中のユーザー：{user?.name}</div>;
}
