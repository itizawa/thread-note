import { prisma, cleanUpAllTableForTest } from "@/__tests__/setup";
import { ListThreadsUseCase } from "./index";

describe("ListThreadsUseCase", () => {
  let useCase: ListThreadsUseCase;
  let user: { id: string; email: string; name: string | null };

  beforeEach(async () => {
    await cleanUpAllTableForTest();
    useCase = new ListThreadsUseCase();
    
    user = await prisma.user.create({
      data: {
        email: "test@example.com",
        name: "Test User",
      },
    });
  });

  describe("status field", () => {
    it("should include status field in select", async () => {
      const thread = await prisma.thread.create({
        data: {
          userId: user.id,
          title: "Test Thread",
          status: "WIP",
          isPublic: false,
        },
      });

      await prisma.post.create({
        data: {
          threadId: thread.id,
          userId: user.id,
          body: "Test post",
        },
      });

      const result = await useCase.execute({
        userId: user.id,
        sort: { type: "createdAt", direction: "desc" },
        inCludePrivate: true,
      });

      expect(result.threads[0]).toHaveProperty("status");
      expect(result.threads[0].status).toBe("WIP");
    });

    it("should exclude CLOSED threads when excludeClosed is true", async () => {
      const wipThread = await prisma.thread.create({
        data: {
          userId: user.id,
          title: "WIP Thread",
          status: "WIP",
          isPublic: false,
        },
      });

      const closedThread = await prisma.thread.create({
        data: {
          userId: user.id,
          title: "Closed Thread",
          status: "CLOSED",
          isPublic: false,
        },
      });

      await prisma.post.create({
        data: { threadId: wipThread.id, userId: user.id, body: "WIP post" },
      });

      await prisma.post.create({
        data: { threadId: closedThread.id, userId: user.id, body: "Closed post" },
      });

      const resultWithClosed = await useCase.execute({
        userId: user.id,
        sort: { type: "createdAt", direction: "desc" },
        excludeClosed: false,
        inCludePrivate: true,
      });

      const resultWithoutClosed = await useCase.execute({
        userId: user.id,
        sort: { type: "createdAt", direction: "desc" },
        excludeClosed: true,
        inCludePrivate: true,
      });

      expect(resultWithClosed.totalCount).toBeGreaterThan(resultWithoutClosed.totalCount);
      expect(resultWithoutClosed.threads.every(t => t.status !== "CLOSED")).toBe(true);
    });
  });
});