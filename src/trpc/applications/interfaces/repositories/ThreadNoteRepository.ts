import type { Post, Thread, User } from "@prisma/client";

// Thread関連の複合型定義
export type ThreadWithUser = Thread & {
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
  _count: {
    posts: number;
  };
};

export type ThreadWithPosts = Thread & {
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
  posts: (Post & {
    user: {
      id: string;
      name: string | null;
      image: string | null;
    };
    children: (Post & {
      user: {
        id: string;
        name: string | null;
        image: string | null;
      };
    })[];
  })[];
};

// 検索条件の型定義
export type ListThreadsArgs = {
  userId: User["id"];
  searchQuery?: string;
  cursor?: string;
  limit?: number;
  inCludePrivate?: boolean;
  sort: {
    type: "createdAt" | "lastPostedAt";
    direction: "asc" | "desc";
  };
};

export type SearchThreadsArgs = {
  userId: User["id"];
  searchQuery: string;
};

export type CreateThreadArgs = {
  userId: User["id"];
  title?: string;
  firstPost?: {
    body: string;
  };
};

export type UpdateThreadArgs = {
  id: Thread["id"];
  title?: string;
  isPublic?: boolean;
  isClosed?: boolean;
  ogpTitle?: string;
  ogpDescription?: string;
  ogpImagePath?: string;
};

// Repository インターフェース
export interface IThreadNoteRepository {
  // スレッド取得系
  findById(id: Thread["id"]): Promise<Thread | null>;
  findByIdWithUser(id: Thread["id"]): Promise<ThreadWithUser | null>;
  findByIdWithPosts(
    id: Thread["id"],
    includeArchivedPosts?: boolean
  ): Promise<ThreadWithPosts | null>;

  // スレッド一覧取得系
  findManyByUserId(args: ListThreadsArgs): Promise<{
    threads: ThreadWithUser[];
    nextCursor: string | null;
    totalCount: number;
  }>;

  findPublicThreadsByUserId(userId: User["id"]): Promise<ThreadWithUser[]>;

  searchThreads(args: SearchThreadsArgs): Promise<
    (ThreadWithUser & {
      posts: Pick<Post, "id" | "body">[];
    })[]
  >;

  // スレッド作成・更新・削除系
  create(args: CreateThreadArgs): Promise<Thread>;
  createWithFirstPost(args: CreateThreadArgs): Promise<Thread>;

  update(args: UpdateThreadArgs): Promise<Thread>;

  delete(id: Thread["id"]): Promise<void>;

  // 権限チェック系
  isOwnedByUser(threadId: Thread["id"], userId: User["id"]): Promise<boolean>;
  isPublic(threadId: Thread["id"]): Promise<boolean>;
}
