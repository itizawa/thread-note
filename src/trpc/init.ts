import { auth } from "@/auth";
import { User } from "@prisma/client";
import { initTRPC, TRPCError } from "@trpc/server";
import { cache } from "react";
import superjson from "superjson";

export const createTRPCContext = cache(async () => {
  const session = await auth();

  return {
    currentUser: session?.user || null,
  };
});
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<typeof createTRPCContext>().create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  transformer: superjson,
});
// Base router and procedure helpers
export const router = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;

export const protectedProcedure = t.procedure.use<{ currentUser: User }>(
  ({ ctx, next }) => {
    if (!ctx.currentUser) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    return next({
      ctx,
    });
  }
);
