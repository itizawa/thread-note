import { prisma } from "@/prisma";
import type { Thread, User, Prisma } from "@prisma/client";
import type {
  IThreadNoteRepository,
  ThreadWithUser,
  ThreadWithPosts,
  ListThreadsArgs,
  SearchThreadsArgs,
  CreateThreadArgs,
  UpdateThreadArgs,
} from "@/trpc/applications/interfaces/repositories/ThreadNoteRepository";

export class ThreadRepository implements IThreadNoteRepository {
  // スレッド取得系
  async findById(id: Thread["id"]): Promise<Thread | null> {
    return await prisma.thread.findUnique({
      where: { id },
    });
  }

  async findByIdWithUser(id: Thread["id"]): Promise<ThreadWithUser | null> {
    return await prisma.thread.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            posts: {
              where: {
                isArchived: false,
              },
            },
          },
        },
      },
    });
  }

  async findByIdWithPosts(
    id: Thread["id"],
    includeArchivedPosts = false
  ): Promise<ThreadWithPosts | null> {
    const postWhereCondition = includeArchivedPosts ? {} : { isArchived: false };

    return await prisma.thread.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        posts: {
          where: {
            ...postWhereCondition,
            parentId: null, // 親投稿のみ取得
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            children: {
              where: postWhereCondition,
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    image: true,
                  },
                },
              },
              orderBy: {
                createdAt: "asc",
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });
  }

  // スレッド一覧取得系
  async findManyByUserId(args: ListThreadsArgs): Promise<{
    threads: ThreadWithUser[];
    nextCursor: string | null;
    totalCount: number;
  }> {
    const where = this.generateWhere(args);
    const orderBy = this.generateOrderBy(args);
    const select = this.generateSelect();

    // 総数を取得
    const totalCount = await prisma.thread.count({ where });

    const { limit = 10 } = args;

    // スレッドを取得
    const threads = await prisma.thread.findMany({
      where,
      select,
      orderBy,
      take: limit + 1,
      cursor: args.cursor ? { id: args.cursor } : undefined,
    });

    const hasNextPage = threads.length > limit;

    return {
      threads: hasNextPage ? threads.slice(0, limit) : threads,
      nextCursor: hasNextPage ? threads[limit].id : null,
      totalCount,
    };
  }

  async findPublicThreadsByUserId(userId: User["id"]): Promise<ThreadWithUser[]> {
    return await prisma.thread.findMany({
      where: {
        userId,
        isPublic: true,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            posts: {
              where: {
                isArchived: false,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async searchThreads(args: SearchThreadsArgs): Promise<(ThreadWithUser & {
    posts: Pick<import("@prisma/client").Post, "id" | "body">[];
  })[]> {
    if (!args.searchQuery.trim()) {
      return [];
    }

    return await prisma.thread.findMany({
      where: {
        userId: args.userId,
        OR: [
          {
            title: {
              contains: args.searchQuery,
              mode: "insensitive",
            },
          },
          {
            posts: {
              some: {
                body: {
                  contains: args.searchQuery,
                  mode: "insensitive",
                },
              },
            },
          },
        ],
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            posts: {
              where: {
                isArchived: false,
              },
            },
          },
        },
        posts: {
          select: {
            id: true,
            body: true,
          },
          where: {
            body: {
              contains: args.searchQuery,
              mode: "insensitive",
            },
          },
          take: 3, // 検索結果のハイライト用に最大3件
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // スレッド作成・更新・削除系
  async create(args: CreateThreadArgs): Promise<Thread> {
    return await prisma.thread.create({
      data: {
        userId: args.userId,
        title: args.title,
      },
    });
  }

  async createWithFirstPost(args: CreateThreadArgs): Promise<Thread> {
    return await prisma.$transaction(async (tx) => {
      const thread = await tx.thread.create({
        data: {
          userId: args.userId,
          title: args.title,
        },
      });

      if (args.firstPost) {
        await tx.post.create({
          data: {
            body: args.firstPost.body,
            userId: args.userId,
            threadId: thread.id,
          },
        });
      }

      return thread;
    });
  }

  async update(args: UpdateThreadArgs): Promise<Thread> {
    const { id, ...updateData } = args;
    
    return await prisma.thread.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: Thread["id"]): Promise<void> {
    await prisma.thread.delete({
      where: { id },
    });
  }

  // 権限チェック系
  async isOwnedByUser(threadId: Thread["id"], userId: User["id"]): Promise<boolean> {
    const thread = await prisma.thread.findUnique({
      where: { id: threadId },
      select: { userId: true },
    });

    return thread?.userId === userId;
  }

  async isPublic(threadId: Thread["id"]): Promise<boolean> {
    const thread = await prisma.thread.findUnique({
      where: { id: threadId },
      select: { isPublic: true },
    });

    return thread?.isPublic === true;
  }

  // プライベートヘルパーメソッド
  private generateWhere(args: ListThreadsArgs): Prisma.ThreadWhereInput {
    const baseWhere: Prisma.ThreadWhereInput = {
      userId: args.userId,
      ...(args.inCludePrivate ? {} : { isPublic: true }),
    };

    if (!args.searchQuery) {
      return baseWhere;
    }

    return {
      ...baseWhere,
      OR: [
        {
          title: {
            contains: args.searchQuery,
            mode: "insensitive",
          },
        },
        {
          posts: {
            some: {
              body: {
                contains: args.searchQuery,
                mode: "insensitive",
              },
            },
          },
        },
      ],
    };
  }

  private generateOrderBy(args: ListThreadsArgs): Prisma.ThreadOrderByWithRelationInput {
    return {
      [args.sort.type]: args.sort.direction,
    };
  }

  private generateSelect(): Prisma.ThreadSelect {
    return {
      id: true,
      title: true,
      createdAt: true,
      lastPostedAt: true,
      _count: {
        select: {
          posts: {
            where: {
              isArchived: false,
            },
          },
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    };
  }
}