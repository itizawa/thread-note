import type { Thread } from "@prisma/client";
import type { 
  IThreadNoteRepository 
} from "@/trpc/applications/interfaces/repositories/ThreadNoteRepository";

export class GetThreadInfoUseCase {
  constructor(private threadRepository: IThreadNoteRepository) {}

  async execute({ id }: { id: Thread["id"] }) {
    return await this.threadRepository.findById(id);
  }
}
