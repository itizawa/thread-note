import { prisma, cleanUpAllTableForTest } from "@/__tests__/setup";

describe("threadRouter", () => {
  beforeEach(async () => {
    await cleanUpAllTableForTest();
  });

  describe("thread status", () => {
    it("should create thread with default WIP status", async () => {
      const user = await prisma.user.create({
        data: {
          email: "test@example.com",
          name: "Test User",
        },
      });

      const thread = await prisma.thread.create({
        data: {
          userId: user.id,
          title: "Test Thread",
        },
      });

      expect(thread.status).toBe("WIP");
    });

    it("should update thread status from WIP to CLOSED", async () => {
      const user = await prisma.user.create({
        data: {
          email: "test@example.com",
          name: "Test User",
        },
      });

      const thread = await prisma.thread.create({
        data: {
          userId: user.id,
          title: "Test Thread",
          status: "WIP",
        },
      });

      const updatedThread = await prisma.thread.update({
        where: { id: thread.id },
        data: { status: "CLOSED" },
      });

      expect(updatedThread.status).toBe("CLOSED");
    });

    it("should update thread status from CLOSED to WIP", async () => {
      const user = await prisma.user.create({
        data: {
          email: "test@example.com",
          name: "Test User",
        },
      });

      const thread = await prisma.thread.create({
        data: {
          userId: user.id,
          title: "Test Thread",
          status: "CLOSED",
        },
      });

      const updatedThread = await prisma.thread.update({
        where: { id: thread.id },
        data: { status: "WIP" },
      });

      expect(updatedThread.status).toBe("WIP");
    });
  });
});