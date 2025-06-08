import type { Post, Thread, User } from "@prisma/client";
import type { 
  IThreadNoteRepository 
} from "@/trpc/applications/interfaces/repositories/ThreadNoteRepository";

export class CreateThreadWithFIrstPostUseCase {
  constructor(private threadRepository: IThreadNoteRepository) {}

  async execute({
    postBody,
    title,
    currentUser,
  }: {
    postBody?: Post["body"];
    title?: Thread["title"];
    currentUser: User;
  }): Promise<{ thread: Thread }> {
    const thread = await this.threadRepository.createWithFirstPost({
      userId: currentUser.id,
      title,
      firstPost: postBody ? { body: postBody } : undefined,
    });

    return { thread };
  }
}
