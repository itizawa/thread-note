import { z } from 'zod';

export const PostScalarFieldEnumSchema = z.enum(['id','body','userId','createdAt','updatedAt','threadId','isArchived']);

export default PostScalarFieldEnumSchema;
