import { z } from 'zod';

/////////////////////////////////////////
// POST SCHEMA
/////////////////////////////////////////

export const PostSchema = z.object({
  id: z.uuid(),
  body: z.string(),
  userId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  threadId: z.string(),
  parentId: z.string().nullable(),
  isArchived: z.boolean(),
})

export type Post = z.infer<typeof PostSchema>

export default PostSchema;
