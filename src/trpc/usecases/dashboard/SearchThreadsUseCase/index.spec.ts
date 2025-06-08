import { SearchThreadsUseCase } from "./index";
import type { IThreadNoteRepository } from "@/trpc/applications/interfaces/repositories/ThreadNoteRepository";

describe("SearchThreadsUseCase", () => {
  let useCase: SearchThreadsUseCase;
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

    useCase = new SearchThreadsUseCase(mockRepository);
  });

  describe("execute", () => {
    it("should return search results when query is provided", async () => {
      // Arrange
      const searchArgs = {
        userId: "user-1",
        searchQuery: "test query",
      };

      const expectedResult = [
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
            posts: 2,
          },
          posts: [
            {
              id: "post-1",
              body: "This is a test query post",
            },
          ],
        },
      ];

      mockRepository.searchThreads.mockResolvedValue(expectedResult);

      // Act
      const result = await useCase.execute(searchArgs);

      // Assert
      expect(mockRepository.searchThreads).toHaveBeenCalledWith({
        userId: "user-1",
        searchQuery: "test query",
      });
      expect(result).toEqual(expectedResult);
    });

    it("should return empty array when search query is empty", async () => {
      // Arrange
      const searchArgs = {
        userId: "user-1",
        searchQuery: "",
      };

      // Act
      const result = await useCase.execute(searchArgs);

      // Assert
      expect(mockRepository.searchThreads).not.toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it("should return empty array when search query is only whitespace", async () => {
      // Arrange
      const searchArgs = {
        userId: "user-1",
        searchQuery: "   \t\n   ",
      };

      // Act
      const result = await useCase.execute(searchArgs);

      // Assert
      expect(mockRepository.searchThreads).not.toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it("should handle repository errors", async () => {
      // Arrange
      const searchArgs = {
        userId: "user-1",
        searchQuery: "test query",
      };

      const error = new Error("Search failed");
      mockRepository.searchThreads.mockRejectedValue(error);

      // Act & Assert
      await expect(useCase.execute(searchArgs)).rejects.toThrow("Search failed");
      expect(mockRepository.searchThreads).toHaveBeenCalledWith({
        userId: "user-1",
        searchQuery: "test query",
      });
    });
  });
});