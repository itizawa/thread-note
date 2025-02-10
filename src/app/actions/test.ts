// app/actions.ts
"use server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getData() {
  const data = await prisma.user.findMany();
  return data;
}
