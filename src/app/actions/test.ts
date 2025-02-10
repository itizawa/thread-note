// app/actions.ts
"use server";
import { prisma } from "@/prisma";

export async function getData() {
  const data = await prisma.user.findMany();
  return data;
}
