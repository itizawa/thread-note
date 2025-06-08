import { GetThreadInfoUseCase } from "./index";
import type { IThreadNoteRepository } from "@/trpc/applications/interfaces/repositories/ThreadNoteRepository";
import type { Thread } from "@prisma/client";

describe("GetThreadInfoUseCase", () => {
  let useCase: GetThreadInfoUseCase;
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

    useCase = new GetThreadInfoUseCase(mockRepository);
  });

  describe("execute", () => {
    it("should return thread when thread exists", async () => {
      // Arrange
      const threadId = "thread-1";
      const expectedThread: Thread = {
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
      };

      mockRepository.findById.mockResolvedValue(expectedThread);

      // Act
      const result = await useCase.execute({ id: threadId });

      // Assert
      expect(mockRepository.findById).toHaveBeenCalledWith(threadId);
      expect(result).toEqual(expectedThread);
    });

    it("should return null when thread does not exist", async () => {
      // Arrange
      const threadId = "non-existent-thread";
      mockRepository.findById.mockResolvedValue(null);

      // Act
      const result = await useCase.execute({ id: threadId });

      // Assert
      expect(mockRepository.findById).toHaveBeenCalledWith(threadId);
      expect(result).toBeNull();
    });

    it("should handle repository errors", async () => {
      // Arrange
      const threadId = "thread-1";
      const error = new Error("Database connection failed");
      mockRepository.findById.mockRejectedValue(error);

      // Act & Assert
      await expect(useCase.execute({ id: threadId })).rejects.toThrow("Database connection failed");
      expect(mockRepository.findById).toHaveBeenCalledWith(threadId);
    });
  });
});