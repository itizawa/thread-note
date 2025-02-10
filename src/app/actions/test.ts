// app/actions.ts
"use server";
import { auth } from "@/auth";
import { prisma } from "@/prisma";

export async function getData() {
  const data = await prisma.user.findMany();
  return data;
}

export async function getCurrentUser() {
  const session = await auth();
  return session;
}
