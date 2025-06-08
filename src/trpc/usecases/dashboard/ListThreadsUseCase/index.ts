import type { 
  IThreadNoteRepository, 
  ListThreadsArgs 
} from "@/trpc/applications/interfaces/repositories/ThreadNoteRepository";

export class ListThreadsUseCase {
  constructor(private threadRepository: IThreadNoteRepository) {}

  async execute(args: ListThreadsArgs) {
    return await this.threadRepository.findManyByUserId(args);
  }
}
