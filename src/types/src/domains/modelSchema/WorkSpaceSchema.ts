import { z } from 'zod';

/////////////////////////////////////////
// WORK SPACE SCHEMA
/////////////////////////////////////////

export const WorkSpaceSchema = z.object({
  id: z.uuid(),
  ownerId: z.string(),
  name: z.string(),
  slug: z.string(),
  image: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type WorkSpace = z.infer<typeof WorkSpaceSchema>

export default WorkSpaceSchema;
