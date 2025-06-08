import { z } from 'zod';

export const ThreadTagScalarFieldEnumSchema = z.enum(['id','threadId','tagId','createdAt']);

export default ThreadTagScalarFieldEnumSchema;
