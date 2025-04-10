import { z } from 'zod';

export const ThreadScalarFieldEnumSchema = z.enum(['id','userId','title','isPublic','isClosed','seoTitle','seoDescription','createdAt','updatedAt','lastPostedAt']);

export default ThreadScalarFieldEnumSchema;
