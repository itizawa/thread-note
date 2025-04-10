import { z } from 'zod';

/////////////////////////////////////////
// THREAD SCHEMA
/////////////////////////////////////////

export const ThreadSchema = z.object({
  id: z.string().uuid(),
  userId: z.string(),
  title: z.string().nullable(),
  isPublic: z.boolean(),
  isClosed: z.boolean(),
  seoTitle: z.string().nullable(),
  seoDescription: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  lastPostedAt: z.coerce.date(),
})

export type Thread = z.infer<typeof ThreadSchema>

export default ThreadSchema;
