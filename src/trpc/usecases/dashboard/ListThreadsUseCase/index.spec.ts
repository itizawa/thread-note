import { ListThreadsUseCase } from "./index";
import type { IThreadNoteRepository, ListThreadsArgs } from "@/trpc/applications/interfaces/repositories/ThreadNoteRepository";

describe("ListThreadsUseCase", () => {
  let useCase: ListThreadsUseCase;
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

    useCase = new ListThreadsUseCase(mockRepository);
  });

  describe("execute", () => {
    it("should call repository.findManyByUserId with correct arguments", async () => {
      // Arrange
      const args: ListThreadsArgs = {
        userId: "user-1",
        searchQuery: "test",
        cursor: "cursor-1",
        limit: 10,
        inCludePrivate: true,
        sort: {
          type: "createdAt",
          direction: "desc",
        },
      };

      const expectedResult = {
        threads: [
          {
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
            _count: {
              posts: 5,
            },
          },
        ],
        nextCursor: null,
        totalCount: 1,
      };

      mockRepository.findManyByUserId.mockResolvedValue(expectedResult);

      // Act
      const result = await useCase.execute(args);

      // Assert
      expect(mockRepository.findManyByUserId).toHaveBeenCalledWith(args);
      expect(result).toEqual(expectedResult);
    });

    it("should handle empty results", async () => {
      // Arrange
      const args: ListThreadsArgs = {
        userId: "user-1",
        sort: {
          type: "createdAt",
          direction: "desc",
        },
      };

      const expectedResult = {
        threads: [],
        nextCursor: null,
        totalCount: 0,
      };

      mockRepository.findManyByUserId.mockResolvedValue(expectedResult);

      // Act
      const result = await useCase.execute(args);

      // Assert
      expect(mockRepository.findManyByUserId).toHaveBeenCalledWith(args);
      expect(result).toEqual(expectedResult);
    });

    it("should propagate repository errors", async () => {
      // Arrange
      const args: ListThreadsArgs = {
        userId: "user-1",
        sort: {
          type: "createdAt",
          direction: "desc",
        },
      };

      const error = new Error("Database connection failed");
      mockRepository.findManyByUserId.mockRejectedValue(error);

      // Act & Assert
      await expect(useCase.execute(args)).rejects.toThrow("Database connection failed");
      expect(mockRepository.findManyByUserId).toHaveBeenCalledWith(args);
    });
  });
});