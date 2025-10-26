import { prisma } from "@/prisma";
import { PostSchema } from "@/types/src/domains";
import { z } from "zod";
import { premiumPlanProcedure, protectedProcedure, router } from "../init";
import { GenerateReplyPostsUseCase } from "../usecases/threadDetail/GenerateReplyPostsUseCase";
import { GetPostWithChildrenUseCase } from "../usecases/threadDetail/GetPostWithChildrenUseCase";

const getPostWithChildrenUseCase = new GetPostWithChildrenUseCase();

export const postRouter = router({
  updatePostBody: protectedProcedure
    .input(z.object({ id: PostSchema.shape.id, body: PostSchema.shape.body }))
    .mutation(async ({ ctx, input }) => {
      return await prisma.post.update({
        where: {
          id: input.id,
          userId: ctx.currentUser?.id,
        },
        data: {
          body: input.body,
        },
      });
    }),

  changeToArchive: protectedProcedure
    .input(z.object({ id: PostSchema.shape.id }))
    .mutation(async ({ ctx, input }) => {
      return await prisma.post.update({
        where: {
          id: input.id,
          userId: ctx.currentUser?.id,
        },
        data: {
          isArchived: true,
        },
      });
    }),

  changeToUnArchive: protectedProcedure
    .input(z.object({ id: PostSchema.shape.id }))
    .mutation(async ({ ctx, input }) => {
      return await prisma.post.update({
        where: {
          id: input.id,
          userId: ctx.currentUser?.id,
        },
        data: {
          isArchived: false,
        },
      });
    }),

  generateReplyPost: premiumPlanProcedure
    .input(
      z.object({
        postId: PostSchema.shape.id,
        type: z.enum(["agreement", "survey", "feedback"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const generateReplyPostsUseCase = new GenerateReplyPostsUseCase();
      return await generateReplyPostsUseCase.execute({
        postId: input.postId,
        userId: ctx.currentUser.id,
        type: input.type,
      });
    }),

  getPostWithChildren: protectedProcedure
    .input(
      z.object({
        id: PostSchema.shape.id,
      })
    )
    .query(async ({ input }) => {
      return await getPostWithChildrenUseCase.execute({ id: input.id });
    }),
});
