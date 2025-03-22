import { prisma } from "@/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { urls } from "./shared/consts/urls";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Google],
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: urls.dashboard,
    signOut: urls.top,
  },
});
