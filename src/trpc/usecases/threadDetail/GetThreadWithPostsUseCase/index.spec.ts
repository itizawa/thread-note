import { GetThreadWithPostsUseCase } from "./index";
import type { IThreadNoteRepository, ThreadWithPosts } from "@/trpc/applications/interfaces/repositories/ThreadNoteRepository";

describe("GetThreadWithPostsUseCase", () => {
  let useCase: GetThreadWithPostsUseCase;
  let mockRepository: jest.Mocked<IThreadNoteRepository>;

  beforeEach(() => {
    // モックリポジトリを作成
    mockRepository = {
      findById: jest.fn(),
      findByIdWithUser: jest.fn(),
      findByIdWithPosts: jest.fn(),
      findManyByUserId: jest.fn(),
      findPublicThreadsByUserId: jest.fn(),
      searchThreads: jest.fn(),
      create: jest.fn(),
      createWithFirstPost: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      isOwnedByUser: jest.fn(),
      isPublic: jest.fn(),
    };

    useCase = new GetThreadWithPostsUseCase(mockRepository);
  });

  describe("execute", () => {
    it("should return thread with posts when includeArchivedPosts is false", async () => {
      // Arrange
      const threadId = "thread-1";
      const includeArchivedPosts = false;
      
      const expectedResult: ThreadWithPosts = {
        id: "thread-1",
        title: "Test Thread",
        userId: "user-1",
        isPublic: true,
        isClosed: false,
        ogpTitle: null,
        ogpDescription: null,
        ogpImagePath: null,
        createdAt: new Date("2023-01-01"),
        updatedAt: new Date("2023-01-01"),
        lastPostedAt: new Date("2023-01-01"),
        user: {
          id: "user-1",
          name: "Test User",
          image: null,
        },
        posts: [
          {
            id: "post-1",
            body: "First post",
            userId: "user-1",
            threadId: "thread-1",
            parentId: null,
            isArchived: false,
            createdAt: new Date("2023-01-01"),
            updatedAt: new Date("2023-01-01"),
            user: {
              id: "user-1",
              name: "Test User",
              image: null,
            },
            children: [
              {
                id: "post-2",
                body: "Reply to first post",
                userId: "user-1",
                threadId: "thread-1",
                parentId: "post-1",
                isArchived: false,
                createdAt: new Date("2023-01-01"),
                updatedAt: new Date("2023-01-01"),
                user: {
                  id: "user-1",
                  name: "Test User",
                  image: null,
                },
              },
            ],
          },
        ],
      };

      mockRepository.findByIdWithPosts.mockResolvedValue(expectedResult);

      // Act
      const result = await useCase.execute({
        id: threadId,
        inCludeIsArchived: includeArchivedPosts,
      });

      // Assert
      expect(mockRepository.findByIdWithPosts).toHaveBeenCalledWith(threadId, includeArchivedPosts);
      expect(result).toEqual({ threadWithPosts: expectedResult });
    });

    it("should return thread with posts when includeArchivedPosts is true", async () => {
      // Arrange
      const threadId = "thread-1";
      const includeArchivedPosts = true;
      
      const expectedResult: ThreadWithPosts = {
        id: "thread-1",
        title: "Test Thread",
        userId: "user-1",
        isPublic: true,
        isClosed: false,
        ogpTitle: null,
        ogpDescription: null,
        ogpImagePath: null,
        createdAt: new Date("2023-01-01"),
        updatedAt: new Date("2023-01-01"),
        lastPostedAt: new Date("2023-01-01"),
        user: {
          id: "user-1",
          name: "Test User",
          image: null,
        },
        posts: [
          {
            id: "post-1",
            body: "First post",
            userId: "user-1",
            threadId: "thread-1",
            parentId: null,
            isArchived: false,
            createdAt: new Date("2023-01-01"),
            updatedAt: new Date("2023-01-01"),
            user: {
              id: "user-1",
              name: "Test User",
              image: null,
            },
            children: [
              {
                id: "post-3",
                body: "Archived reply",
                userId: "user-1",
                threadId: "thread-1",
                parentId: "post-1",
                isArchived: true,
                createdAt: new Date("2023-01-01"),
                updatedAt: new Date("2023-01-01"),
                user: {
                  id: "user-1",
                  name: "Test User",
                  image: null,
                },
              },
            ],
          },
        ],
      };

      mockRepository.findByIdWithPosts.mockResolvedValue(expectedResult);

      // Act
      const result = await useCase.execute({
        id: threadId,
        inCludeIsArchived: includeArchivedPosts,
      });

      // Assert
      expect(mockRepository.findByIdWithPosts).toHaveBeenCalledWith(threadId, includeArchivedPosts);
      expect(result).toEqual({ threadWithPosts: expectedResult });
    });

    it("should return null when thread does not exist", async () => {
      // Arrange
      const threadId = "non-existent-thread";
      const includeArchivedPosts = false;

      mockRepository.findByIdWithPosts.mockResolvedValue(null);

      // Act
      const result = await useCase.execute({
        id: threadId,
        inCludeIsArchived: includeArchivedPosts,
      });

      // Assert
      expect(mockRepository.findByIdWithPosts).toHaveBeenCalledWith(threadId, includeArchivedPosts);
      expect(result).toEqual({ threadWithPosts: null });
    });

    it("should handle repository errors", async () => {
      // Arrange
      const threadId = "thread-1";
      const includeArchivedPosts = false;
      const error = new Error("Database connection failed");

      mockRepository.findByIdWithPosts.mockRejectedValue(error);

      // Act & Assert
      await expect(
        useCase.execute({
          id: threadId,
          inCludeIsArchived: includeArchivedPosts,
        })
      ).rejects.toThrow("Database connection failed");

      expect(mockRepository.findByIdWithPosts).toHaveBeenCalledWith(threadId, includeArchivedPosts);
    });
  });
});