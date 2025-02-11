import { z } from 'zod';

export const PostScalarFieldEnumSchema = z.enum(['id','body','userId','createdAt','updatedAt','threadId']);

export default PostScalarFieldEnumSchema;
