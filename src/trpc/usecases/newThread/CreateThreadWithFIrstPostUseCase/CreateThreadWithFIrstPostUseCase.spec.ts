import { prisma } from "@/__tests__/setup";
import { CreateThreadWithFIrstPostUseCase } from "@/trpc/usecases/newThread/CreateThreadWithFIrstPostUseCase";
import type { Tag, User } from "@prisma/client";

describe("CreateThreadWithFIrstPostUseCase", () => {
  let useCase: CreateThreadWithFIrstPostUseCase;
  let testUser: User;
  let testTag1: Tag;
  let testTag2: Tag;

  beforeEach(async () => {
    useCase = new CreateThreadWithFIrstPostUseCase(prisma);

    testUser = await prisma.user.create({
      data: {
        email: "test@example.com",
        name: "Test User",
      },
    });

    testTag1 = await prisma.tag.create({
      data: {
        name: "テストタグ1",
      },
    });

    testTag2 = await prisma.tag.create({
      data: {
        name: "テストタグ2",
      },
    });
  });

  describe("正常系", () => {
    it("titleとpostBodyとtagIdsを指定してスレッドと投稿を作成できる", async () => {
      const title = "テストスレッド";
      const postBody = "テスト投稿";
      const tagIds = [testTag1.id, testTag2.id];

      const result = await useCase.execute({
        title,
        postBody,
        tagIds,
        currentUser: testUser,
      });

      expect(result.thread).toBeDefined();
      expect(result.thread.title).toBe(title);
      expect(result.thread.userId).toBe(testUser.id);

      const createdThread = await prisma.thread.findUnique({
        where: { id: result.thread.id },
        include: {
          posts: true,
          tags: {
            include: {
              tag: true,
            },
          },
        },
      });

      expect(createdThread).not.toBeNull();
      expect(createdThread!.title).toBe(title);
      expect(createdThread!.userId).toBe(testUser.id);

      expect(createdThread!.posts).toHaveLength(1);
      expect(createdThread!.posts[0].body).toBe(postBody);
      expect(createdThread!.posts[0].userId).toBe(testUser.id);

      expect(createdThread!.tags).toHaveLength(2);
      const tagNames = createdThread!.tags.map((t) => t.tag.name).sort();
      expect(tagNames).toEqual(["テストタグ1", "テストタグ2"]);
    });

    it("titleのみ指定してスレッドを作成できる（投稿なし、タグなし）", async () => {
      const title = "タイトルのみのスレッド";

      const result = await useCase.execute({
        title,
        currentUser: testUser,
      });

      expect(result.thread).toBeDefined();
      expect(result.thread.title).toBe(title);
      expect(result.thread.userId).toBe(testUser.id);

      const createdThread = await prisma.thread.findUnique({
        where: { id: result.thread.id },
        include: {
          posts: true,
          tags: true,
        },
      });

      expect(createdThread).not.toBeNull();
      expect(createdThread!.title).toBe(title);
      expect(createdThread!.posts).toHaveLength(0);
      expect(createdThread!.tags).toHaveLength(0);
    });

    it("postBodyのみ指定してスレッドと投稿を作成できる（タイトルなし、タグなし）", async () => {
      const postBody = "投稿のみのスレッド";

      const result = await useCase.execute({
        postBody,
        currentUser: testUser,
      });

      expect(result.thread).toBeDefined();
      expect(result.thread.title).toBeNull();
      expect(result.thread.userId).toBe(testUser.id);

      const createdThread = await prisma.thread.findUnique({
        where: { id: result.thread.id },
        include: {
          posts: true,
          tags: true,
        },
      });

      expect(createdThread).not.toBeNull();
      expect(createdThread!.title).toBeNull();
      expect(createdThread!.posts).toHaveLength(1);
      expect(createdThread!.posts[0].body).toBe(postBody);
      expect(createdThread!.tags).toHaveLength(0);
    });

    it("tagIdsのみ指定してスレッドを作成できる（タイトルなし、投稿なし）", async () => {
      const tagIds = [testTag1.id];

      const result = await useCase.execute({
        tagIds,
        currentUser: testUser,
      });

      expect(result.thread).toBeDefined();
      expect(result.thread.title).toBeNull();
      expect(result.thread.userId).toBe(testUser.id);

      const createdThread = await prisma.thread.findUnique({
        where: { id: result.thread.id },
        include: {
          posts: true,
          tags: {
            include: {
              tag: true,
            },
          },
        },
      });

      expect(createdThread).not.toBeNull();
      expect(createdThread!.title).toBeNull();
      expect(createdThread!.posts).toHaveLength(0);
      expect(createdThread!.tags).toHaveLength(1);
      expect(createdThread!.tags[0].tag.name).toBe("テストタグ1");
    });

    it("何も指定しないでスレッドを作成できる（最小パターン）", async () => {
      const result = await useCase.execute({
        currentUser: testUser,
      });

      expect(result.thread).toBeDefined();
      expect(result.thread.title).toBeNull();
      expect(result.thread.userId).toBe(testUser.id);

      const createdThread = await prisma.thread.findUnique({
        where: { id: result.thread.id },
        include: {
          posts: true,
          tags: true,
        },
      });

      expect(createdThread).not.toBeNull();
      expect(createdThread!.title).toBeNull();
      expect(createdThread!.posts).toHaveLength(0);
      expect(createdThread!.tags).toHaveLength(0);
    });

    it("空のtagIds配列を指定してもエラーにならない", async () => {
      const title = "タグなしスレッド";
      const tagIds: string[] = [];

      const result = await useCase.execute({
        title,
        tagIds,
        currentUser: testUser,
      });

      expect(result.thread).toBeDefined();
      expect(result.thread.title).toBe(title);

      const createdThread = await prisma.thread.findUnique({
        where: { id: result.thread.id },
        include: {
          tags: true,
        },
      });

      expect(createdThread!.tags).toHaveLength(0);
    });
  });

  describe("異常系", () => {
    it("存在しないタグIDを指定するとエラーになる", async () => {
      const title = "テストスレッド";
      const postBody = "テスト投稿";
      const tagIds = ["non-existent-tag-id"];

      await expect(
        useCase.execute({
          title,
          postBody,
          tagIds,
          currentUser: testUser,
        })
      ).rejects.toThrow();
    });

    it("無効なユーザーIDを指定するとエラーになる", async () => {
      const invalidUser = {
        id: "invalid-user-id",
        email: "invalid@example.com",
        name: "Invalid User",
      } as User;

      await expect(
        useCase.execute({
          title: "テストスレッド",
          currentUser: invalidUser,
        })
      ).rejects.toThrow();
    });
  });

  describe("データ検証", () => {
    it("作成されたスレッドのデフォルト値が正しく設定される", async () => {
      const result = await useCase.execute({
        title: "デフォルト値検証",
        currentUser: testUser,
      });

      const createdThread = await prisma.thread.findUnique({
        where: { id: result.thread.id },
      });

      expect(createdThread!.isPublic).toBe(false);
      expect(createdThread!.isClosed).toBe(false);
      expect(createdThread!.createdAt).toBeInstanceOf(Date);
      expect(createdThread!.updatedAt).toBeInstanceOf(Date);
      expect(createdThread!.lastPostedAt).toBeInstanceOf(Date);
    });

    it("作成された投稿のデフォルト値が正しく設定される", async () => {
      const result = await useCase.execute({
        postBody: "デフォルト値検証投稿",
        currentUser: testUser,
      });

      const createdPost = await prisma.post.findFirst({
        where: { threadId: result.thread.id },
      });

      expect(createdPost!.isArchived).toBe(false);
      expect(createdPost!.createdAt).toBeInstanceOf(Date);
      expect(createdPost!.updatedAt).toBeInstanceOf(Date);
      expect(createdPost!.parentId).toBeNull();
    });

    it("同じユーザーが複数のスレッドを作成できる", async () => {
      await useCase.execute({
        title: "1つ目のスレッド",
        currentUser: testUser,
      });

      await useCase.execute({
        title: "2つ目のスレッド",
        currentUser: testUser,
      });

      const userThreads = await prisma.thread.findMany({
        where: { userId: testUser.id },
      });

      expect(userThreads).toHaveLength(2);
    });
  });
});
