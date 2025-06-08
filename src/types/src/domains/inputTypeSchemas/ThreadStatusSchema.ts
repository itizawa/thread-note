import { z } from 'zod';

export const ThreadStatusSchema = z.enum(['WIP','CLOSED']);

export type ThreadStatusType = `${z.infer<typeof ThreadStatusSchema>}`

export default ThreadStatusSchema;
