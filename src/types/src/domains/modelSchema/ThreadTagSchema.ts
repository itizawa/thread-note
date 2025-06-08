import { z } from 'zod';

/////////////////////////////////////////
// THREAD TAG SCHEMA
/////////////////////////////////////////

export const ThreadTagSchema = z.object({
  id: z.string().uuid(),
  threadId: z.string(),
  tagId: z.string(),
  createdAt: z.coerce.date(),
})

export type ThreadTag = z.infer<typeof ThreadTagSchema>

export default ThreadTagSchema;
