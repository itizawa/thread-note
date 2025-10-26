import { prisma } from "@/prisma";
import type { Thread } from "@prisma/client";

const selectUserDateObject = {
  select: {
    id: true,
    name: true,
    image: true,
  },
};

export class GetPostWithChildrenUseCase {
  async execute({ id }: { id: Thread["id"] }) {
    const postWithChildren = await prisma.post.findUnique({
      where: { id, isArchived: false },
      include: {
        children: {
          where: { isArchived: false },
          include: {
            user: selectUserDateObject,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
        user: selectUserDateObject,
      },
    });

    return { postWithChildren };
  }
}
