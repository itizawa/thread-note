import type { Thread } from "@prisma/client";
import type { 
  IThreadNoteRepository 
} from "@/trpc/applications/interfaces/repositories/ThreadNoteRepository";

export class GetThreadWithPostsUseCase {
  constructor(private threadRepository: IThreadNoteRepository) {}

  async execute({
    id,
    inCludeIsArchived,
  }: {
    id: Thread["id"];
    inCludeIsArchived: boolean;
  }) {
    const threadWithPosts = await this.threadRepository.findByIdWithPosts(
      id, 
      inCludeIsArchived
    );

    return { threadWithPosts };
  }
}
