import { z } from 'zod';

export const ThreadScalarFieldEnumSchema = z.enum(['id','userId','title','isPublic','createdAt','updatedAt','lastPostedAt']);

export default ThreadScalarFieldEnumSchema;
