import { z } from 'zod';
import { ThreadStatusSchema } from '../inputTypeSchemas/ThreadStatusSchema'

/////////////////////////////////////////
// THREAD SCHEMA
/////////////////////////////////////////

export const ThreadSchema = z.object({
  status: ThreadStatusSchema,
  id: z.string().uuid(),
  userId: z.string(),
  title: z.string().nullable(),
  isPublic: z.boolean(),
  ogpTitle: z.string().nullable(),
  ogpDescription: z.string().nullable(),
  ogpImagePath: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  lastPostedAt: z.coerce.date(),
})

export type Thread = z.infer<typeof ThreadSchema>

export default ThreadSchema;
