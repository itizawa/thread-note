import { z } from 'zod';

export const PostScalarFieldEnumSchema = z.enum(['id','body','userId','createdAt','updatedAt','threadId','parentId','isArchived']);

export default PostScalarFieldEnumSchema;
