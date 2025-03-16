import { z } from 'zod';

/////////////////////////////////////////
// FILE SCHEMA
/////////////////////////////////////////

export const FileSchema = z.object({
  id: z.string().uuid(),
  userId: z.string(),
  name: z.string(),
  path: z.string(),
  size: z.number().int(),
  createdAt: z.coerce.date(),
})

export type File = z.infer<typeof FileSchema>

export default FileSchema;
