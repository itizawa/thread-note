"use client";
import { trpc } from "@/trpc/client";

export function CurrentUserInfo() {
  const [data] = trpc.hello.useSuspenseQuery({ text: "world" });
  return <div>{data.greeting}</div>;
}
