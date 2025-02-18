import { z } from 'zod';

/////////////////////////////////////////
// POST SCHEMA
/////////////////////////////////////////

export const PostSchema = z.object({
  id: z.string().uuid(),
  body: z.string({ required_error: '入力してください' }),
  userId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  threadId: z.string(),
  parentId: z.string().nullable(),
  isArchived: z.boolean(),
})

export type Post = z.infer<typeof PostSchema>

export default PostSchema;
