import { CreateThreadWithFIrstPostUseCase } from "./index";
import type { IThreadNoteRepository } from "@/trpc/applications/interfaces/repositories/ThreadNoteRepository";
import type { User } from "@prisma/client";

describe("CreateThreadWithFIrstPostUseCase", () => {
  let useCase: CreateThreadWithFIrstPostUseCase;
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

    useCase = new CreateThreadWithFIrstPostUseCase(mockRepository);
  });

  describe("execute", () => {
    const mockUser: User = {
      id: "user-1",
      name: "Test User",
      email: "test@example.com",
      emailVerified: null,
      image: null,
      description: null,
      createdAt: new Date("2023-01-01"),
      updatedAt: new Date("2023-01-01"),
    };

    it("should create thread with first post when postBody is provided", async () => {
      // Arrange
      const args = {
        postBody: "This is the first post",
        title: "Test Thread",
        currentUser: mockUser,
      };

      const createdThread = {
        id: "thread-1",
        title: "Test Thread",
        userId: "user-1",
        isPublic: false,
        isClosed: false,
        ogpTitle: null,
        ogpDescription: null,
        ogpImagePath: null,
        createdAt: new Date("2023-01-01"),
        updatedAt: new Date("2023-01-01"),
        lastPostedAt: new Date("2023-01-01"),
      };

      mockRepository.createWithFirstPost.mockResolvedValue(createdThread);

      // Act
      const result = await useCase.execute(args);

      // Assert
      expect(mockRepository.createWithFirstPost).toHaveBeenCalledWith({
        userId: "user-1",
        title: "Test Thread",
        firstPost: { body: "This is the first post" },
      });
      expect(result).toEqual({ thread: createdThread });
    });

    it("should create thread without first post when postBody is not provided", async () => {
      // Arrange
      const args = {
        title: "Test Thread",
        currentUser: mockUser,
      };

      const createdThread = {
        id: "thread-1",
        title: "Test Thread",
        userId: "user-1",
        isPublic: false,
        isClosed: false,
        ogpTitle: null,
        ogpDescription: null,
        ogpImagePath: null,
        createdAt: new Date("2023-01-01"),
        updatedAt: new Date("2023-01-01"),
        lastPostedAt: new Date("2023-01-01"),
      };

      mockRepository.createWithFirstPost.mockResolvedValue(createdThread);

      // Act
      const result = await useCase.execute(args);

      // Assert
      expect(mockRepository.createWithFirstPost).toHaveBeenCalledWith({
        userId: "user-1",
        title: "Test Thread",
        firstPost: undefined,
      });
      expect(result).toEqual({ thread: createdThread });
    });

    it("should create thread without title when title is not provided", async () => {
      // Arrange
      const args = {
        postBody: "This is the first post",
        currentUser: mockUser,
      };

      const createdThread = {
        id: "thread-1",
        title: null,
        userId: "user-1",
        isPublic: false,
        isClosed: false,
        ogpTitle: null,
        ogpDescription: null,
        ogpImagePath: null,
        createdAt: new Date("2023-01-01"),
        updatedAt: new Date("2023-01-01"),
        lastPostedAt: new Date("2023-01-01"),
      };

      mockRepository.createWithFirstPost.mockResolvedValue(createdThread);

      // Act
      const result = await useCase.execute(args);

      // Assert
      expect(mockRepository.createWithFirstPost).toHaveBeenCalledWith({
        userId: "user-1",
        title: undefined,
        firstPost: { body: "This is the first post" },
      });
      expect(result).toEqual({ thread: createdThread });
    });

    it("should handle repository errors", async () => {
      // Arrange
      const args = {
        postBody: "This is the first post",
        title: "Test Thread",
        currentUser: mockUser,
      };

      const error = new Error("Database error");
      mockRepository.createWithFirstPost.mockRejectedValue(error);

      // Act & Assert
      await expect(useCase.execute(args)).rejects.toThrow("Database error");
      expect(mockRepository.createWithFirstPost).toHaveBeenCalledWith({
        userId: "user-1",
        title: "Test Thread",
        firstPost: { body: "This is the first post" },
      });
    });
  });
});