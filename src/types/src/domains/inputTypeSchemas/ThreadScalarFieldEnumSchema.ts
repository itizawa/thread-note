import { z } from 'zod';

export const ThreadScalarFieldEnumSchema = z.enum(['id','userId','title','createdAt','updatedAt']);

export default ThreadScalarFieldEnumSchema;
