import { prisma } from "@/prisma";
import type { Thread } from "@prisma/client";

export class GetThreadInfoUseCase {
  async execute({ id }: { id: Thread["id"] }) {
    const thread = await prisma.thread.findFirst({
      where: {
        id,
      },
    });

    return thread;
  }
}
