import type { User } from "@prisma/client";
import type { 
  IThreadNoteRepository
} from "@/trpc/applications/interfaces/repositories/ThreadNoteRepository";

export class SearchThreadsUseCase {
  constructor(private threadRepository: IThreadNoteRepository) {}

  async execute({
    userId,
    searchQuery,
  }: {
    userId: User["id"];
    searchQuery: string;
  }) {
    // 検索クエリが空の場合は空の結果を返す
    if (!searchQuery.trim()) {
      return [];
    }

    return await this.threadRepository.searchThreads({
      userId,
      searchQuery,
    });
  }
}
